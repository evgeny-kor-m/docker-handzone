UFW:

With --privileged:
  Container gets full kernel access
  Can use iptables
  Can modify network stack

Internet → Host port 4000 → Docker NAT → Container port 4000 → UFW (inside)


docker run -dit --name ubuntu1 ubuntu
docker run -dit --name ubuntu2 --privileged -p 5000:5000 ubuntu



ubuntu-with-ufw: 172.17.0.4
ubuntu-without-ufw: 172.17.0.3

Host               -> ubuntu-with-ufw (via google)
ubuntu-without-ufw -> ubuntu-with-ufw (via vurl)



docker exec -it ubuntu1 bash - 172.17.0.2
apt update
apt install -y curl

docker exec -it ubuntu2 bash - 172.17.0.3
apt update
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt install -y nodejs nano ufw

ufw enable

ufw status
Status: inactive


ufw allow 4000
ufw status numbered

ufw allow from 172.17.0.3 to any port 5000
