# Markdown Site Engine

[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg)](http://standardjs.com) [![contributions welcome](https://img.shields.io/badge/contributions-welcome-brightgreen.svg?style=flat)](https://github.com/petersamokhin/nodejs-markdown-site/issues) [![made-with-Markdown](https://img.shields.io/badge/Made%20with-Markdown-1f425f.svg)]() [![Ask Me Anything !](https://img.shields.io/badge/Ask%20me-anything-1abc9c.svg)](https://GitHub.com/petersamokhin/) [![GitHub license](https://img.shields.io/badge/License-MIT-yellow.svg)](https://github.com/petersamokhin/nodejs-markdown-site/blob/master/LICENSE)

Make your project documentation (or blog, or something else) with Markdown.

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
<img src="https://i.imgur.com/u5vKAf8.png" width="700"></img>

And mobile version (iPhone 8 Plus):<br>
<img src="https://i.imgur.com/33Dkp1F.jpg" width="300"></img>

## Requirements
- [NodeJS](https://github.com/nodejs/node) (+[ npm](https://github.com/npm/npm))
- [MongoDB](https://github.com/mongodb/mongo) (used for `passport` sessions, user and paths info)
- Ruby (for `kramdown` library)
- `babel`
- `node-sass` (not so necessary if you don't want to change the existing styles, and you still can use plain css)

## Install
1. Clone the repo. I'm not gonna to upload project to npm, etc.
```bash
git clone https://github.com/petersamokhin/markdown-site
```

2. Install dependencies 
```bash
cd markdown-site
npm i
```

3. Rebuild project sources with `babel` (also static files will be copied to `/dist`)
```bash
npm run rebuild
```

## Run 
Run on `http://localhost:3006/markdown-knowledge-base`
```bash
npm start
```

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
