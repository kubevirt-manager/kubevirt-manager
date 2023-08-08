# Node/Angular Builder
FROM node:16.20-bookworm as builder
WORKDIR /usr/src/app
COPY . /usr/src/app
RUN cd /usr/src/app/src/assets/ && git clone https://github.com/novnc/noVNC.git
RUN cd /usr/src/app && npm run clean && npm install -g @angular/cli@14.2.9 && npm install && npm run build

# NGINX Image
FROM nginx:1.23-alpine
RUN mkdir -p /etc/nginx/location.d/
RUN curl -LO https://storage.googleapis.com/kubernetes-release/release/$(curl -s https://storage.googleapis.com/kubernetes-release/release/stable.txt)/bin/linux/amd64/kubectl && \
    chmod +x ./kubectl && mv ./kubectl /usr/local/bin
COPY entrypoint/91-startkubectl.sh /docker-entrypoint.d
COPY conf/*.conf /etc/nginx/conf.d/
RUN chmod +x /docker-entrypoint.d/91-startkubectl.sh
COPY --from=builder /usr/src/app/dist/kubevirtmgr-webui /usr/share/nginx/html
