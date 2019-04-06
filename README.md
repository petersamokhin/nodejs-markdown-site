# Markdown Site Engine

[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg)](http://standardjs.com) [![contributions welcome](https://img.shields.io/badge/contributions-welcome-brightgreen.svg?style=flat)](https://github.com/petersamokhin/nodejs-markdown-site/issues) [![made-with-Markdown](https://img.shields.io/badge/Made%20with-Markdown-1f425f.svg)]() [![Ask Me Anything !](https://img.shields.io/badge/Ask%20me-anything-1abc9c.svg)](https://GitHub.com/petersamokhin/) [![GitHub license](https://img.shields.io/badge/License-MIT-yellow.svg)](https://github.com/petersamokhin/nodejs-markdown-site/blob/master/LICENSE)

Make your project documentation (or blog, or something else) with Markdown.

#### Demo: [https://petersamokhin.com/markdown-site/demo](https://petersamokhin.com/markdown-site/demo?github-readme)

## Features
- HTML-generating on-the-fly from the Markdown files.
- Generating of navigation on-the-fly.
- Dynamic permissions management:
  * Each user has a list of roles (roles are like GitHub's organization's groups).
  * Each page and directory should have a list of roles.
  * User can see the page (in navigation too) if he has at least one role from page's list.
- Search on all pages depending on access rights of current user.
- Preview of result html page in creating page.
- All settings and access rights are fully configurable (using admin panel or changing the code).
- Too easy to add new setting — admin panel is generated too. You simply need to add new setting and default value, and then you will be able to configure it in admin panel.
- You can simply copy your markdown files to `views/pages/` and (if it necessary) manage access to paths — and then your documentation is ready :) All new pages and directories will be indexed at next page loading.
- Nice looking & adaptive design for all screen sizes.
- Other small but useful features:
  - Each header has `#link` to it
  - Most code snippets will have copy button on header above
  - You can use all `kramdown` features
  - `Main pages folder` from configuration will be always on top in navigation on each page.
  - Pages will have default access rights from config and will be placed in `Main pages folder` if you wont specify path or roles.
  - Advanced error handling (page with information about error will be shown for each error, so no crashes must occur)

## Sample
This readme page after rendering:<br>
<img src="https://i.imgur.com/WDcuj2J.png" width="700"></img>

And mobile version (iPhone 8 Plus):<br>
<img src="https://i.imgur.com/LyiX1FL.jpg" width="300"></img>

## Requirements
- [docker](https://www.docker.com/)
- [docker-compose](https://docs.docker.com/compose/)

## Install
Any \*NIX OS is supported. No guarantees for Windows.

1. Make some directory for installing mongodb from docker:
```bash
cd ~
mkdir mongodocker
cd mongodocker
```

2. Copy necessary files from mongo-docker repository:
```bash
export MONGODB_VERSION=4.0
curl -O --remote-name-all https://raw.githubusercontent.com/docker-library/mongo/master/$MONGODB_VERSION/{Dockerfile,docker-entrypoint.sh}
export DOCKER_USERNAME=username
chmod 755 ./docker-entrypoint.sh
```

2. Create `docker-compose.yml` in your directory with following content:
```yaml
version: '2'

services:
  mymongo:
    image: mymongo
    container_name: mymongo
    restart: always
    build:
      context: .
      dockerfile: ./Dockerfile
    ports: ["27017:27017"]
    volumes:
      - '/etc/mongod.conf:/etc/mongod.conf'
    command:
      - '--config'
      - '/etc/mongod.conf'
    networks:
      mongo_net:
        ipv4_address: 172.22.0.2

networks:
  mongo_net:
    driver: bridge
    ipam:
      config:
      - subnet: 172.22.0.2/24
        gateway: 172.22.0.254
```

Where `172.22.0.2` is public IP for accessing database. You can change it.

3. Create `/etc/mongod.conf` with following content:
```yaml
storage:
  dbPath: /data/db
  journal:
    enabled: true

net:
  port: 27017
  bindIp: 127.0.0.1,172.22.0.2 # here you can see this IP again
```

4. Start mongo in background:
```bash
docker-compose up -d
```

5. Clone this repo. I'm not gonna to upload project to npm, etc.
```bash
git clone https://github.com/petersamokhin/markdown-site
```

6. See started networks and find `mongodb` network's name:
```bash
docker network ls
```
You must see something like this:
```bash
NETWORK ID          NAME                           DRIVER              SCOPE
a117428b09c9        bridge                         bridge              local
0b75179024f0        host                           host                local
b1c67fcbca63        mongo-docker_mongo_net         bridge              local
df7d198ae6c2        none                           null                local
```

Find network with name like `mongo-docker_mongo_net`. It can be literally `mongo-docker_mongo_net`.

7. Change the name of a mongo network at the end of this project's `docker-compose.yml`. Now it's `mongo-docker_mongo_net`.

8. Start project in the background:
```bash
docker-compose up -d
```

## Additional info
You can use local MongoDB which is not in docker container, in this case, you must do it by yourself.

Profit!

## 3rd party
- [babel](https://github.com/babel/babel)
- [bcrypt-nodejs](https://npmjs.org/bcrypt-nodejs/)
- [cheerio](https://github.com/cheeriojs/cheerio)
- [CodeMirror](https://github.com/codemirror/CodeMirror)
- [connect-mongo](https://github.com/jdesboeufs/connect-mongo)
- [consolidate](https://github.com/tj/consolidate.js/)
- [cookie-parser](https://github.com/expressjs/cookie-parser)
- [directory-tree](https://github.com/mihneadb/node-directory-tree)
- [eslint](https://github.com/eslint/eslint)
- [express](https://github.com/expressjs/express)
- [express-session](https://github.com/expressjs/session)
- [jQuery](https://github.com/jquery/jquery)
- [Kotlin Website styles](https://github.com/JetBrains/kotlin-web-site)
- [kramdown](https://github.com/gettalong/kramdown)
- [materialize](https://github.com/Dogfalo/materialize)
- [mkdirp](https://github.com/substack/node-mkdirp)
- [mongoose](https://github.com/Automattic/mongoose)
- [morgan](https://github.com/expressjs/morgan)
- [mustache](https://github.com/mustache/mustache)
- [passport](https://github.com/jaredhanson/passport)
- [passport-local](https://github.com/jaredhanson/passport-local)
- [tags-input](https://github.com/developit/tags-input)

# License
MIT<br>
[Copyright (c) 2018 PeterSamokhin](https://github.com/petersamokhin/markdown-site/blob/master/LICENSE)<br>
https://petersamokhin.com/
