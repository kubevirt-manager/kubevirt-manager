#!/bin/sh

RESOLUTION="1920,1200"
WAITMS="18000"

cat screenlist.txt | while read thisline
do
    FILE=`echo $thisline | cut -d , -f 1`
    URL=`echo $thisline | cut -d , -f 2`
    /usr/bin/chromium-browser --headless --window-size=$RESOLUTION --force-device-scale-factor=0.6 --use-gel=swiftshared --disable-software-rasterizer --disable-dev-shm-usage --virtual-time-budget=$WAITMS --no-sandbox --screenshot=/data/$FILE --hide-scrollbars $URL
done