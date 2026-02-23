## Create Ansible based on docker and docker network ( Master, node 1 , node 2 )
## Create test file from master and copy via copy command into both nodes (via Docker compose)

docker compose up -d --build
docker compose down 
docker exec -it ansible-master-01 sh

tee inventory.yml <<EOF
all:
  children:
    slaves:
      hosts:
        slave-node1:
          ansible_host: ansible-slave-01
          ansible_user: ansible
          ansible_ssh_pass: ansible
          ansible_python_interpreter: /usr/bin/python3
        slave-node2:
          ansible_host: ansible-slave-02
          ansible_user: ansible
          ansible_ssh_pass: ansible
          ansible_python_interpreter: /usr/bin/python3
    master:
      hosts:
        master-node:
          ansible_host: ansible-master-01
          ansible_user: ansible
          ansible_ssh_pass: ansible
          ansible_python_interpreter: /usr/bin/python3
    cluster:
      children:
        master:
        slaves:
EOF
ssh ansible@ansible-slave-01
exit
ssh ansible@ansible-slave-02
exit

ansible all -i inventory.yml -m ping
echo "test" > test.txt
ansible slaves -i inventory.yml -m copy -a "src=test.txt dest=/tmp/test.txt"

