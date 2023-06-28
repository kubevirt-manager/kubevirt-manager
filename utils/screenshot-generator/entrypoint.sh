#!/bin/sh
# This is a script to generate automated screenshots
# for github repo and website
#


RESOLUTION="1920,1280"
WAITMS="18000"

cat screenlist.txt | while read thisline
do
    FILE=`echo $thisline | cut -d , -f 1`
    URL=`echo $thisline | cut -d , -f 2`
    /usr/bin/chromium-browser --disable-logging --disable-extensions --disable-audio-input --disable-audio-output --headless=new --window-size=$RESOLUTION --disable-gpu --force-device-scale-factor=0.7 --disable-software-rasterizer --disable-dev-shm-usage --virtual-time-budget=$WAITMS --disabled-extensions --no-sandbox --screenshot=/data/$FILE --hide-scrollbars $URL
done