## Ansible PlayBook master slave bridge network to install Apache 

Ansible PlayBook to install Apache - Docker based on network and Expose port
Cleanup if needed
docker ps
docker ps -a
docker rm -f $(docker ps -a -q)
docker images
docker rmi -f $(docker images -q)
docker network ls
docker network rm (C_ID)
docker network prune
Start slave container
docker network ls
docker network create ansible-net

```
Docker run without browser
give lab that do all the steps with browser, just with copy module from manager to node
Docker run with browser via expose port
```

docker run -d \
  --name ansible-slave \
  --network ansible-net \
  -p 8080:80 \
  alpine:3.19 sleep infinity

docker exec -it ansible-slave sh
apk update
apk add openssh python3 sudo
ssh-keygen -A
adduser -D ansible
echo "ansible:ansible" | chpasswd
echo "ansible ALL=(ALL) NOPASSWD:ALL" >> /etc/sudoers
cat /etc/group | grep ansible
/usr/sbin/sshd
netstat -tlnp | grep :22
ssh ansible@ansible-slave                #pass is ansible
ifconfig
exit
ifconfig
exit
```

Start master container

```
docker run -it \
  --name ansible-master \
  --network ansible-net \
  alpine:3.19 sh
apk update
apk add ansible openssh-client sshpass python3
apk add openssh-server
ssh-keygen -A
adduser -D ansible
echo "ansible:ansible" | chpasswd
echo "ansible ALL=(ALL) NOPASSWD:ALL" >> /etc/sudoers
cat /etc/group | grep ansible
/usr/sbin/sshd
netstat -tlnp | grep :22
ssh ansible@ansible-slave
exit
ssh ansible@ansible-master
exit
```

Create inventory based on Agent host

```
tee inventory.yml > /dev/null <<EOF
all:
  children:
    slaves:
      hosts:
        slave-node:
          ansible_host: ansible-slave
          ansible_user: ansible
          ansible_ssh_pass: ansible
          ansible_python_interpreter: /usr/bin/python3

EOF
```

mv inventory.yml inventory-singel-host.yml

```

Create inventory based on Group hosts

```
tee inventory.yml > /dev/null <<EOF
all:
  children:
    master:
      hosts:
        master-node:
          ansible_host: ansible-master
          ansible_user: ansible
          ansible_ssh_pass: ansible
          ansible_python_interpreter: /usr/bin/python3

    slaves:
      hosts:
        slave-node:
          ansible_host: ansible-slave
          ansible_user: ansible
          ansible_ssh_pass: ansible
          ansible_python_interpreter: /usr/bin/python3
EOF
```

Test SSH manually

```
ssh ansible@ansible-slave
exit
ansible all -i inventory.yml -m ping
```

Run the apache play book

```
# Команда записи содержимого в файл (перенаправление ввода в tee)
tee playbook-apache.yml > /dev/null <<EOF
- hosts: slaves               # Группа целевых хостов из файла inventory
  become: yes                 # Выполнение задач с правами суперпользователя (root)
  gather_facts: no            # Отключение сбора системных данных (ускоряет выполнение)

  tasks:                      # Список задач для выполнения

    - name: Update packages   # Название: Обновление списка пакетов
      apk:                    # Используем модуль apk (менеджер пакетов Alpine)
        update_cache: yes     # Аналог apt-get update: обновляем индекс репозиториев

    - name: Install Apache    # Название: Установка Apache и OpenRC
      apk:                    # Снова модуль apk
        name:                 # Список пакетов для установки:
          - apache2           # Сам веб-сервер Apache
          - openrc            # Система инициализации для управления сервисами
        state: present        # Гарантируем, что пакеты установлены

    - name: Create OpenRC dir # Название: Создание директории для работы OpenRC
      file:                   # Модуль для работы с файлами и папками
        path: /run/openrc     # Путь к директории (необходима для работы rc-service)
        state: directory      # Тип объекта — папка

    - name: Init OpenRC       # Название: Инициализация OpenRC (хак для Docker)
      shell: |                # Выполнение команд через оболочку shell
        openrc || true        # Запуск инициализации (игнорируем ошибку, если уже запущен)
        touch /run/openrc/softlevel # Создание файла уровня запуска (нужно для обмана rc-service)

    - name: Add to runlevel   # Название: Добавление Apache в автозагрузку
      shell: rc-update add apache2 || true # Регистрация сервиса в системе управления

    - name: Stop Apache       # Название: Безопасная остановка (если был запущен)
      shell: rc-service apache2 stop || true # Пробуем остановить сервис через rc-service

    - name: Start Apache      # Название: Финальный запуск сервера
      shell: rc-service apache2 start || httpd # Пробуем через сервис, если не выйдет — запускаем бинарник напрямую
EOF
```

Run the playbook of apache web server

```
ansible-playbook -i inventory.yml playbook-apache.yml --syntax-check
ansible-playbook -i inventory.yml playbook-apache.yml -verbose
ansible-playbook -i inventory.yml playbook-apache.yml
```

Test Locally and via the Browser

```
docker exec -it ansible-slave sh
ps aux | grep httpd
apk add curl
curl 172.26.0.2:80
  # Via browser
http:\\localhost:8080
<html><body><h1>It works!</h1></body></html>
```

Separatly apache start playbook

```
tee playbook-start-apache.yml > /dev/null <<EOF
- hosts: slaves
  become: yes
  gather_facts: no

  tasks:
    - name: Add Apache to runlevel
      shell: rc-update add apache2 || true

    - name: Start Apache
      shell: rc-service apache2 start || httpd
EOF
```

Separatly apache stop playbook

```
tee playbook-stop-apache.yml > /dev/null <<EOF
- hosts: slaves
  become: yes
  gather_facts: no

  tasks:

  - name: Stop Apache safely
    shell: rc-service apache2 stop || true
EOF
```
