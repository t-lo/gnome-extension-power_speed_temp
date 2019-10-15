#!/bin/bash

res="0"

[ -e "/sys/class/power_supply/BAT0/power_now" ] && {
	p=$(cat /sys/class/power_supply/BAT0/power_now)
	res="$((p/1000))"
}

[ -e "/sys/class/power_supply/BAT0/current_now" \
  -a -e "/sys/class/power_supply/BAT0/voltage_now" ] && {
	c=$(cat /sys/class/power_supply/BAT0/current_now)
	v=$(cat /sys/class/power_supply/BAT0/voltage_now)
	res="$(( (c/1000000) * (v/1000000) ))"
}

echo -n $res
