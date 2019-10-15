#!/bin/bash
cat /sys/class/thermal/thermal_zone*/temp | sort -n | tail -n1
