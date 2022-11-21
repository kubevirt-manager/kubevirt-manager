#!/bin/sh
if [ ! -d $IMGPATH ]
then
  echo "IMGPATH does not exists, check your env vars and volumes..."
  exit
fi

if [ ! -w $IMGPATH ]; then
    echo "Insufficient permissions on $IMGPATH"
    echo "Check runAsUser on Daemonset and grant permissions"
    exit
fi

if [ ! -d $DISKPATH ]
then
  echo "DISKPATH does not exists, check your env vars and volumes..."
  exit
fi

if [ ! -w $DISKPATH ]; then
    echo "Insufficient permissions on $DISKPATH"
    echo "Check runAsUser on Daemonset and grant permissions"
    exit
fi

cd /usr/src/app
node index.js
