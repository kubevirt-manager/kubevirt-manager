#!/bin/sh
export KM_VERSION="1.5.2"
docker build -t screenshot-generator:$KM_VERSION .
chmod 777 ./data
docker run -v $(pwd)/data:/data screenshot-generator:$KM_VERSION
