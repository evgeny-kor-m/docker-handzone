Playbook based on "ansible-lab-03" and python Flask
-   Cleanup before
-   Install Ansible cluster via docker
-   make sure you get ping pong

From Master Create app.py based of python flask

'''
tee app.py > /dev/null <<EOF
from flask import Flask

app = Flask(__name__)

@app.route("/")
def home():
    return "Hello!"

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=80)
EOF
'''

Test the app.py locally in ansible slave
-   Create an isolated Python environment at /home/ansible/venv
-   Activates your Python virtual environment
-   Install flask module
-   Run the app.py locally on ansible-slave
-   From master
'''
ansible all -i inventory.yml -m copy -a "src=app.py dest=app.py"
ssh ansible@ansible-slave
python3 -m venv /home/ansible/venv
source /home/ansible/venv/bin/activate
pip install flask
python app.py
'''
From browser localhost:80              # or via curl apk add curl and run the command curl <ip-80>
exit

Via vi editor copy the manage_flask.yml then run the stop and start state
-   Stop and Start service
-   From Master
'''
ansible-playbook -i inventory.yml manage_flask.yml -e "state=stop"
from browser localhost:80

ansible-playbook -i inventory.yml manage_flask.yml -e "state=start"
from browser localhost:80
'''