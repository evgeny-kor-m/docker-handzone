
Ansible installation based on Docker with rsa key

[КЛЮЧ] (id_rsa) ---> Находится у Master (Секрет)	 
[ЗАМОК/СЛЕПОК] (id_rsa.pub) ---> Находится у Slave в файле authorized_keys	Что делает весь этот сценарий (кратко)
 	        1. Подготовка (Cleanup): Удаляем старые контейнеры, чтобы не было конфликтов портов.
 ХОСТ (Твой ПК)
      +-------------------------------------------------------+
      |  Файл: id_rsa (временно лежал тут)       |
      +-------------------------------------------------------+
                      |                                          ^
          Копирование                      Копирование
           (docker cp)                           (docker cp)
                      |                                          |
                      v                                          |
      +-----------------------------------+    +----------------------------------+
      | ANSIBLE-MASTER                |    | ANSIBLE-SLAVE (Сервер)|
      | (Клиент)                               |    |     adduser ansible             |	        2. Agent (Slave):
      |  openssh, vim, ansible        |    |    openssh, vim, python3 |	                ○ Создаем контейнер.
      |                                                |    |                                              |
      |           [id_rsa] <-------------|-(cp)-|- [id_rsa]                           |
      |       (Приватный)                  |    |    (Сгенерированы тут)   |
      |                                                 |    |          |  [ id_rsa.pub]         |
      |                                                 |    |          | (mv)                         |
      |                                                 |    |          v                                  |
      |                                                 |    |    [authorized_keys]          |
      |                                                 |    |    (Публичный слепок)    |
      +------------------------------------+    +----------------------------------+
           | SSH запрос                                                          ^
           |    "У меня есть ключ RSA,  впусти меня!"    |
           +---------------------------------------------------------->
               	                ○ Внутри ставим sshd (сервер) и python (нужен для работы Ansible).
	                ○ ssh-keygen -A: Создаем "паспорт" серверу.
	                ○ Разрешаем вход по ключам.
	                ○ Создаем пользователя ansible и внутри его папки создаем пару ключей (-t rsa).
	                ○ Хитрый ход: mv id_rsa.pub authorized_keys. Мы сами себе разрешили вход.
	        3. Master:
	                ○ Создаем второй контейнер (откуда будем управлять).
	                ○ Копируем приватный ключ (id_rsa) с Агента на Мастер.
	                ○ chmod 600: SSH очень капризный — если файл ключа доступен для чтения другим пользователям, он откажется работать.
	        4. Проверка:
	                ○ Пинг через Ansible. Если видишь "ping": "pong", значит Master успешно зашел на Agent по SSH-ключу и выполнил там код Python.

Cleanup if needed

docker ps
docker ps -a
docker rm -f $(docker ps -a -q)
docker images
docker rmi -f $(docker images -q)

Ansible Slave Linux
	• ssh-keygen -R It removes a saved host key from your SSH known_hosts file
	• install ansible-slave
	• Go into docker run and install python3
	• Get the private ip
	• ssh-keygen -A Commonly used when setting up servers, containers, or fresh VMs
	• Set PubkeAuth = yes and PasswordAuth = yes in sshd_config file
	• Add ansible user
	• Start the sshd and check the open port

host	ssh-keygen -R "[localhost]:2222"	# Удаляем старые записи о контейнере из базы "доверенных серверов" хоста [.ssh/known_hosts]
# Это нужно, чтобы не было ошибки "REMOTE HOST IDENTIFICATION HAS CHANGED"
		*** Если ты удалишь контейнер и создашь новый, у него будет новый отпечаток. Твой SSH-клиент Fail.
	cat /c/Users/<username>/.ssh/known_hosts	# Просто просмотр файла(для самопроверки) .ssh/known_hosts
		Список серверов, которым "ты доверяеш". Клиент проверяет подлинность сервера. Чтобы никто не подменил fingerprint в будущем (защита от Man-in-the-middle). В known_hosts записывается связка: [IP или Имя сервера] [Тип ключа] [Публичный ключ сервера].
		Когда ты подключаешься через SSH к порту 2222 своего компьютера, твой компьютер запоминает «отпечаток» (fingerprint) того сервера, который там ответил.
	docker run -d --name ansible-slave -p 2222:22 alpine:latest sleep infinity	# Запускаем контейнер Alpine, пробрасываем порт 2222 хоста на 22 порт контейнера
	docker ps	
	docker inspect <Container_ID>	# Смотрим IP адрес контейнера внутри сети Docker (понадобится позже)
Docker Slave	docker exec -it ansible-slave sh	# Заходим внутрь контейнера
	apk add openssh vim python3	# Устанавливаем SSH-сервер, редактор и Python (Ansible работает через Python)
	python --version	# Проверяем установку
	ifconfig
	ssh-keygen -A	# ГЕНЕРАЦИЯ HOST-KEY (Паспорт сервера)
# Создает файлы в /etc/ssh/ssh_host_*_key, без них SSH-сервер не стартует
	echo PubkeyAuthentication yes >> /etc/ssh/sshd_config	#  Это настройки SSH-сервера (демона) внутри контейнера. разрешает вход по SSH-ключам (самое важное для Ansible).          
	echo PasswordAuthentication yes >> /etc/ssh/sshd_config	# разрешает вход по паролю. В данном примере это скорее страховка, чтобы не заблокировать себе вход совсем.
	adduser ansible	# Создаем пользователя 'ansible', под которым будет работать автоматизация
	/usr/sbin/sshd	# Запускаем SSH-сервер (демона)
	netstat -tlnp | grep :22	# Проверяем, слушает ли сервер 22-й порт
	exit	

Configure Ansible User  <Настройка ключей пользователя (Внутри Slave)>
	• Login with ansible user
	• ssh-keygen -t Create client identity
	• Rename to authorized_keys
	
Docker Slave	docker exec -it ansible-slave su - ansible	# Заходим в контейнер сразу под пользователем ansible
	whoami	# Проверяем, кто мы
	ssh-keygen -t rsa -b 4096 -f ~/.ssh/id_rsa -N ""	# ГЕНЕРАЦИЯ ПАРЫ КЛЮЧЕЙ ПОЛЬЗОВАТЕЛЯ (Ключи от квартиры)
# -t rsa    : тип ключа
# -b 4096: длина (сложность)
# -f          : путь сохранения
# -N ""    :  пустой пароль (кодовую фразу). Благодаря этому при использовании ключа система не будет запрашивать пароль. (чтобы Ansible заходил сам)
		Создание файлов: В директории ~/.ssh/ появятся два файла:
		        • id_rsa — Private-key. Его нельзя никому показывать или передавать. С его помощью вы подтверждаете свою личность.
		        • id_rsa.pub — Public-key. Его вы копируете на сервер (обычно в файл ~/.ssh/authorized_keys), к которому хотите подключаться.
	mv .ssh/id_rsa.pub .ssh/authorized_keys	# Добавляем наш публичный ключ в список разрешенных
# Теперь любой, у кого есть файл id_rsa, сможет зайти под юзером ansible
	cat .ssh/authorized_keys	# Проверяем содержимое "белого списка"
	exit	

Test SSH Connection <Проверка доступа с Хоста>
	• Copy the key from docker run to git bash cli
	• Test connection port
	
Host	docker cp ansible-slave:/home/ansible/.ssh/id_rsa .	# Копируем приватный ключ из контейнера к себе на компьютер
	ls
ssh -i id_rsa -p 2222 ansible@localhost	# Пытаемся зайти с хоста по этому ключу
# -i id_rsa: использовать этот ключ
# -p 2222: стучаться в порт 2222
	exit
	cat /home/ansible/.ssh/known_hosts

Ansible Master Linux <Настройка Мастера (Ansible Master)>
	• Docker run the ansible master
	• Go into docker run and install ansible
	• Exit
	• Copy the RSA key into Docker run ( Its generated from agent )
	• Go into docker run and change mode of rsa file key
	• Check the connection via hope ssh from master to agent
	• exit in order to back to ducker run of master
	
Host	docker run -d --name ansible-master alpine:latest sleep infinity	# Запускаем второй контейнер - это будет наш "пульт управления"
Docker Master	docker exec -it ansible-master sh	# Заходим в него, ставим Ansible
	apk add openssh vim ansible
            or
        apk add nano 
ansible --version
exit
Host	docker cp id_rsa ansible-master:/	# Копируем приватный ключ Агента в контейнер Мастера
# Теперь Мастер может "представиться" Агенту как его владелец
Docker Master	docker exec -it ansible-master sh	# Заходим обратно в Мастер
	ls | grep id_rsa
	chmod 600 id_rsa	# КРИТИЧЕСКИЙ ШАГ: Права доступа
# SSH запрещает использовать ключи, которые "видны всем". 
# 600 означает: только владелец может читать и писать.
	Ifconfig	# Проверяем связь напрямую по SSH (Master -> Slave IP)
	ssh -i id_rsa ansible@172.17.0.2
ifconfig
Exit	
	cat /root/.ssh/known_hosts

Configure Ansible <Запуск Ansible>

	• Create the inventory ini or yaml file during docker run exe -it sh session
	• Run the ansible ping command
	
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
	• Test ping pong
ansible -i inventory.ini slaves -m ping
172.17.0.2 | SUCCESS => {
    "ansible_facts": {
        "discovered_interpreter_python": "/usr/bin/python3.12"
    },
    "changed": false,
    "ping": "pong"
}

<img width="1768" height="4038" alt="image" src="https://github.com/user-attachments/assets/8da59c76-9a89-413e-accb-f9735c7d1423" />
