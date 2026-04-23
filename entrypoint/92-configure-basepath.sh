#!/bin/sh

# Remove trailing slash, so / becomes empty string
APP_BASE_PATH="${APP_BASE_PATH:-/}"
APP_BASE_PATH="${APP_BASE_PATH%/}"

echo "[92-configure-basepath] Using APP_BASE_PATH: '${APP_BASE_PATH}'"

# Copy original html to writable emptyDir
cp -r /usr/share/nginx/html.original/. /usr/share/nginx/html/

# Copy gzip config
cp /etc/nginx/conf.d.templates/gzip.conf /etc/nginx/conf.d/gzip.conf

if [ -z "${APP_BASE_PATH}" ]; then
    # Root path — no base href patch, no rewrite rules needed
    echo "[92-configure-basepath] Serving at root /"
    cp /etc/nginx/conf.d.templates/default-root.conf \
       /etc/nginx/conf.d/default.conf
else
    # Subpath — patch base href and use rewrite rules
    echo "[92-configure-basepath] Serving at ${APP_BASE_PATH}/"
    sed -i "s|<base href=\"/\">|<base href=\"${APP_BASE_PATH}/\">|g" \
        /usr/share/nginx/html/index.html
    envsubst '${APP_BASE_PATH}' \
        < /etc/nginx/conf.d.templates/default-subpath.conf.template \
        > /etc/nginx/conf.d/default.conf
fi

echo "[92-configure-basepath] Done."