#!/bin/bash


cat /sys/devices/system/cpu/cpu*/cpufreq/scaling_cur_freq \
        | awk '    { a=a+1; x[a]=$0; }
               END {for (i=1;i<=a;i=i+1) r=r+x[a];
                    print r/a;}'
