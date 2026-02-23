# slave
FROM alpine:latest

WORKDIR /app

#COPY

RUN apk update && apk add --no-cache openssh python3 sudo vim bash

RUN ssh-keygen -A \
    && adduser -D ansible \
    && echo "ansible:ansible" | chpasswd \
    # Разрешаем пользователю использовать sudo без пароля
    && echo "ansible ALL=(ALL) NOPASSWD:ALL" >> /etc/sudoers  

# Запускаем SSH-сервер в фоновом режиме (через флаг -D чтобы контейнер не закрылся)
CMD ["/usr/sbin/sshd", "-D"]