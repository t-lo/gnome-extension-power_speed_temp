const St = imports.gi.St;
const Main = imports.ui.main;
const GLib = imports.gi.GLib;
const MainLoop = imports.mainloop;
const Lang = imports.lang;
const PanelMenu = imports.ui.panelMenu;
const Clutter = imports.gi.Clutter;
const Gio = imports.gi.Gio;
const DATAPATH = "/sys/class/power_supply/BAT0/power_now";


const PowerIndicator = new Lang.Class({
  Name: 'PowerIndicator',
  Extends: PanelMenu.Button,
  powerMeasures: [],


  _init: function(){
    this.parent(0.0, "PowerIndicator", false);
    this.buttonText = new St.Label({
      text: _("Loading..."),
      y_align: Clutter.ActorAlign.CENTER
    });
    this.actor.add_actor(this.buttonText);
    this._refresh();
  },

  _refresh: function(){
    this._updatePowerMeasures(this._getCurrentPower());
    let value = (this._averageTab(this.powerMeasures)).toFixed(2)+"W | "
        + this._getCurrentFrequency().toFixed(2) + "GHz | "
        + this._getCurrentTemp() + "°C";
    this.buttonText.set_text(value);
    this._removeTimeout();
    this._timeout = MainLoop.timeout_add_seconds(3, Lang.bind(this, this._refresh));
  },

  _updatePowerMeasures: function(lastValue){
    if(this.powerMeasures.length>=5){
      this.powerMeasures.shift();
    };
    this.powerMeasures.push(lastValue);
  },

  _averageTab: function(tab){
    let sum=0;
    for(let i=0;i<tab.length;i++){
      sum=sum+tab[i];
    };
    return sum/tab.length;
  },

  _exec_script: function(scriptname) {
    let extension_dir=GLib.get_home_dir()
                        + "/.local/share/gnome-shell/extensions"
                        +"/powerSpeedTemp@thilo.alexander.gmail.com";
    return GLib.spawn_command_line_sync(extension_dir + "/" + scriptname);
  },

  _getCurrentFrequency: function(){               
    let [ret, out] = this._exec_script("getfreq.sh");
    return Number(out)/1000000;
  },

  _getCurrentPower: function(){
    return Number(GLib.file_get_contents(DATAPATH)[1])/1000000;
  },

  _getCurrentTemp: function(){
    // TODO: read all & report max
    return Number(GLib.file_get_contents(
                "/sys/class/thermal/thermal_zone4/temp")[1])/1000;
  },

  _removeTimeout: function(){
    if(this._timeout){
      MainLoop.source_remove(this._timeout);
      this._timeout = null;
    }
  }
})


function init() {
}

let indicator;

function enable() {
    indicator = new PowerIndicator();
    Main.panel.addToStatusArea("power-indicator", indicator);
}

function disable() {
    indicator.destroy();
}
