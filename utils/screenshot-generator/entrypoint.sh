#!/bin/sh

RESOLUTION="2560,1440"
WAITMS="18000"

cat screenlist.txt | while read thisline
do
    FILE=`echo $thisline | cut -d , -f 1`
    URL=`echo $thisline | cut -d , -f 2`
    /usr/bin/chromium-browser --headless --window-size=$RESOLUTION --use-gel=swiftshared --disable-software-rasterizer --disable-dev-shm-usage --virtual-time-budget=$WAITMS --no-sandbox --screenshot=/data/$FILE --hide-scrollbars $URL
done