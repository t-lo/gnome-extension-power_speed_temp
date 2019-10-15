#!/bin/bash

sensors | awk '/Package id 0/{printf $4}'
