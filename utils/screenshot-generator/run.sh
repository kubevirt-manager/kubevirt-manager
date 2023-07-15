#!/bin/sh
docker build -t screenshot-generator:latest .
chmod 777 ./data
docker run -v $(pwd)/data:/data screenshot-generator:latest
