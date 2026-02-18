Ansible PlayBook - Docker based on network and Expose port
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
Docker run without browser
give lab that do all the steps with browser, just with copy module from manager to node
Docker run with browser via expose port
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
Start master container
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

Create inventory based on Agent host
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
mv inventory.yml inventory-singel-host.yml
Create inventory based on Group hosts
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

Test SSH manually
ssh ansible@ansible-slave
exit
ansible all -i inventory.yml -m ping
Run the apache play book

tee playbook-apache.yml > /dev/null <<EOF
- hosts: slaves
  become: yes
  gather_facts: no

  tasks:

    - name: Update packages
      apk:
        update_cache: yes

    - name: Install Apache + OpenRC
      apk:
        name:
          - apache2
          - openrc
        state: present

    - name: Create OpenRC runtime directory
      file:
        path: /run/openrc
        state: directory

    - name: Initialize OpenRC (Docker safe)
      shell: |
        openrc || true
        touch /run/openrc/softlevel

    - name: Add Apache to runlevel
      shell: rc-update add apache2 || true

    - name: Stop Apache safely
      shell: rc-service apache2 stop || true

    - name: Start Apache
      shell: rc-service apache2 start || httpd
EOF

Run the playbook of apache web server
ansible-playbook -i inventory.yml playbook-apache.yml --syntax-check
ansible-playbook -i inventory.yml playbook-apache.yml -verbose
ansible-playbook -i inventory.yml playbook-apache.yml

Test Locally and via the Browser
docker exec -it ansible-slave sh
ps aux | grep httpd
apk add curl
curl 172.26.0.2:80
  # Via browser
http:\\localhost:8080
<html><body><h1>It works!</h1></body></html>


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

tee playbook-stop-apache.yml > /dev/null <<EOF
- hosts: slaves
  become: yes
  gather_facts: no

  tasks:

  - name: Stop Apache safely
    shell: rc-service apache2 stop || true
EOF
