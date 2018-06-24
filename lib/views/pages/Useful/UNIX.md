# UNIX

## kill processes with keyword
```bash
ps -ef | grep KEYWORD | grep -v grep | awk '{print $2}' | xargs kill -9
```

## generate p12, letsencrypt example
```bash
openssl pkcs12 -export -in fullchain.pem -inkey privkey.pem -out keystore.p12 -name letsencrypt.petersamokhin.com -CAfile chain.pem -caname root
```

## extract .pem and .key from .p12
```bash
openssl pkcs12 -nokeys -in letsencrypt.p12 -out letsencrypt.pem
openssl pkcs12 -nocerts -nodes -in letsencrypt.p12 -out letsencrypt.key
```

## run mongodb
```bash
mongod --dbpath /path/to/data/db & exit
```

## compile maven jar
```bash
mvn clean compile assembly:single
```

## install mongodb 3.2 (Ubuntu)
```bash
sudo apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv EA312927
echo "deb http://repo.mongodb.org/apt/ubuntu xenial/mongodb-org/3.2 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-3.2.list
sudo apt-get update
sudo apt-get install -y mongodb-org
```

## make russian great again
```bash
apt-get install language-pack-ru
sudo update-locale
sudo dpkg-reconfigure locales 
```

## routing port 80 to 8080, enable and disable
```bash
sudo iptables (-A or -D) PREROUTING -t nat -i eth0 -p tcp --dport 80 -j REDIRECT --to-port 8080
```

## services
```bash
sudo service nginx restart (start | stop)
```

## nginx conf
```bash
nano /etc/nginx/sites-available/default
```

## git without password, for current repo
```bash
git config credential.helper store
```

## fix node typo for express in webstorm
```bash
npm install --save-dev @types/express
```

## switch git user
```bash
git config --global user.name "user"
git config --global user.email "user@gmail.com"
```

## switch git user for current repo
```bash
git config --local user.name "user" && git config --local user.email "user@gmail.com"
```