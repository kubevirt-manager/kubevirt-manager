# Node/Angular Builder
FROM node:16.18-bullseye-slim as builder
WORKDIR /usr/src/app
COPY . /usr/src/app
RUN npm install -g @angular/cli@14.2.9 && npm install && ng build --configuration production

# NGINX Image
FROM nginx:1.23-alpine
RUN mkdir -p /etc/nginx/location.d/
RUN curl -LO https://storage.googleapis.com/kubernetes-release/release/$(curl -s https://storage.googleapis.com/kubernetes-release/release/stable.txt)/bin/linux/amd64/kubectl && \
    chmod +x ./kubectl && mv ./kubectl /usr/local/bin
COPY entrypoint/91-startkubectl.sh /docker-entrypoint.d
COPY conf/default.conf /etc/nginx/conf.d/
RUN chmod +x /docker-entrypoint.d/91-startkubectl.sh
COPY --from=builder /usr/src/app/dist/kubevirtmgr-webui /usr/share/nginx/html
