# Markdown Site Engine [![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg)](http://standardjs.com)
Pages engine for a simple site or blog with content written with Markdown.

## Features
- HTML-generating on-the-fly from the Markdown files.
- Generating of navigation on-the-fly.
- Dynamic permissions management:
  * Each user has a list of roles.
  * Each page and directory should have a list of roles.
  * User can see the page (including navigation) if he has at least one role from page's list.
- Nice looking & adaptive design.
- Fully configurable.

## Requirements
- NodeJS (+ npm)
- MongoDB (used for `passport` sessions, user and paths info)
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