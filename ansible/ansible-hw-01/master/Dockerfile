# master 
FROM alpine:latest

WORKDIR /app

COPY . ./inventory.yml

RUN  apk update && apk add --no-cache openssh-client  vim  ansible  bash

CMD ["sleep", "infinity"]