#!/bin/sh
CONFIG_FILE="/etc/nginx/oauth.d/oauth2.conf"
if [ -f $CONFIG_FILE ]; then
    /bin/oauth2-proxy --config $CONFIG_FILE &
fi
