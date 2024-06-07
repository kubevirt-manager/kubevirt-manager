# Node/Angular Builder
#FROM node:20.11-bookworm as builder
FROM node:22.2.0-bookworm as builder

LABEL org.opencontainers.image.authors="marcelo@feitoza.com.br"
LABEL description="Kubevirt Manager 1.4.0 - Builder"

WORKDIR /usr/src/app
COPY . /usr/src/app
RUN cd /usr/src/app/src/assets/ && git clone https://github.com/novnc/noVNC.git
RUN cd /usr/src/app && npm run clean && npm install -g @angular/cli@18.0.3 && npm install && npm run build

# NGINX Image
FROM nginx:1.27-alpine

LABEL org.opencontainers.image.authors="marcelo@feitoza.com.br"
LABEL description="Kubevirt Manager 1.4.0"

RUN mkdir -p /etc/nginx/location.d/
RUN curl -LO https://storage.googleapis.com/kubernetes-release/release/$(curl -s https://storage.googleapis.com/kubernetes-release/release/stable.txt)/bin/linux/amd64/kubectl && \
    chmod +x ./kubectl && mv ./kubectl /usr/local/bin
COPY entrypoint/91-startkubectl.sh /docker-entrypoint.d
COPY conf/*.conf /etc/nginx/conf.d/
RUN chmod +x /docker-entrypoint.d/91-startkubectl.sh
COPY --from=builder /usr/src/app/dist/kubevirtmgr-webui /usr/share/nginx/html
