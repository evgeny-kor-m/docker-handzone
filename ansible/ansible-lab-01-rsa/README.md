## Ansible installation Master Slave RSA
based on Docker

Ansible installation based on Docker with rsa key
Cleanup if needed
docker ps
docker ps -a
docker rm -f $(docker ps -a -q)
docker images
docker rmi -f $(docker images -q)
Ansible Agent Linux
ssh-keygen -R It removes a saved host key from your SSH known_hosts file
install ansible-slave
Go into docker run and install python3
Get the private ip
ssh-keygen -A Commonly used when setting up servers, containers, or fresh VMs
Set PubkeAuth = yes and PasswordAuth = yes in sshd_config file
Add ansible user
Start the sshd and check the open port
ssh-keygen -R "[localhost]:2222"
cat /c/Users/<username>/.ssh/known_hosts
docker run -d --name ansible-slave -p 2222:22 alpine:latest sleep infinity
docker ps
docker inspect <C_ID>
docker exec -it ansible-slave sh
apk add openssh vim python3
python --version
ifconfig

ssh-keygen -A
echo PubkeyAuthentication yes >> /etc/ssh/sshd_config
echo PasswordAuthentication yes >> /etc/ssh/sshd_config
adduser ansible
/usr/sbin/sshd
netstat -tlnp | grep :22
exit
Configure Ansible User
Login with ansible user
ssh-keygen -t Create client identity
Rename to authorized_keys
docker exec -it ansible-slave su - ansible
whoami
ssh-keygen -t rsa -b 4096 -f ~/.ssh/id_rsa -N ""
mv .ssh/id_rsa.pub .ssh/authorized_keys
cat .ssh/authorized_keys
exit
Test SSH Connection
Copy the key from docker run to git bash cli
Test connection port
docker cp ansible-slave:/home/ansible/.ssh/id_rsa .
ls
ssh -i id_rsa -p 2222 ansible@localhost
exit
Ansible Master Linux
Docker run the ansible master
Go into docker run and install ansible
Exit
Copy the RSA key into Docker run ( Its generated from agent )
Go into docker run and change mode of rsa file key
Check the connection via hope ssh from master to agent
exit in order to back to ducker run of master
docker run -d --name ansible-master alpine:latest sleep infinity   
docker exec -it ansible-master sh
apk add openssh vim ansible
            or
        apk add nano 
ansible --version
exit
docker cp id_rsa ansible-master:/  
docker exec -it ansible-master sh
ls | grep id_rsa
chmod 600 id_rsa
ifconfig
ssh -i id_rsa ansible@172.17.0.2
ifconfig
exit
Configure Ansible
Create the inventory ini or yaml file during docker run exe -it sh session
Run the ansible ping command
tee inventory.yml <<EOF
all:
  children:
    slaves:
      hosts:
        172.17.0.2:
          ansible_user: ansible
          ansible_ssh_private_key_file: /id_rsa
EOF

ansible -i inventory.yml slaves -m ping
tee inventory.ini <<EOF
[slaves]
172.17.0.2 ansible_user=ansible ansible_ssh_private_key_file=/id_rsa
EOF

            or via nano
nano inventory.ini
Test ping pong
ansible -i inventory.ini slaves -m ping

172.17.0.2 | SUCCESS => {
    "ansible_facts": {
        "discovered_interpreter_python": "/usr/bin/python3.12"
    },
    "changed": false,
    "ping": "pong"
}
