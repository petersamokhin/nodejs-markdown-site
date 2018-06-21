# Markdown Site Engine

[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg)](http://standardjs.com) [![contributions welcome](https://img.shields.io/badge/contributions-welcome-brightgreen.svg?style=flat)](https://github.com/petersamokhin/nodejs-markdown-site/issues) [![made-with-Markdown](https://img.shields.io/badge/Made%20with-Markdown-1f425f.svg)]() [![Ask Me Anything !](https://img.shields.io/badge/Ask%20me-anything-1abc9c.svg)](https://GitHub.com/petersamokhin/) [![GitHub license](data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB3aWR0aD0iNzgiIGhlaWdodD0iMjAiPjxsaW5lYXJHcmFkaWVudCBpZD0iYiIgeDI9IjAiIHkyPSIxMDAlIj48c3RvcCBvZmZzZXQ9IjAiIHN0b3AtY29sb3I9IiNiYmIiIHN0b3Atb3BhY2l0eT0iLjEiLz48c3RvcCBvZmZzZXQ9IjEiIHN0b3Atb3BhY2l0eT0iLjEiLz48L2xpbmVhckdyYWRpZW50PjxjbGlwUGF0aCBpZD0iYSI+PHJlY3Qgd2lkdGg9Ijc4IiBoZWlnaHQ9IjIwIiByeD0iMyIgZmlsbD0iI2ZmZiIvPjwvY2xpcFBhdGg+PGcgY2xpcC1wYXRoPSJ1cmwoI2EpIj48cGF0aCBmaWxsPSIjNTU1IiBkPSJNMCAwaDQ3djIwSDB6Ii8+PHBhdGggZmlsbD0iIzk3Q0EwMCIgZD0iTTQ3IDBoMzF2MjBINDd6Ii8+PHBhdGggZmlsbD0idXJsKCNiKSIgZD0iTTAgMGg3OHYyMEgweiIvPjwvZz48ZyBmaWxsPSIjZmZmIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LWZhbWlseT0iRGVqYVZ1IFNhbnMsVmVyZGFuYSxHZW5ldmEsc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxMTAiPjx0ZXh0IHg9IjI0NSIgeT0iMTUwIiBmaWxsPSIjMDEwMTAxIiBmaWxsLW9wYWNpdHk9Ii4zIiB0cmFuc2Zvcm09InNjYWxlKC4xKSIgdGV4dExlbmd0aD0iMzcwIj5saWNlbnNlPC90ZXh0Pjx0ZXh0IHg9IjI0NSIgeT0iMTQwIiB0cmFuc2Zvcm09InNjYWxlKC4xKSIgdGV4dExlbmd0aD0iMzcwIj5saWNlbnNlPC90ZXh0Pjx0ZXh0IHg9IjYxNSIgeT0iMTUwIiBmaWxsPSIjMDEwMTAxIiBmaWxsLW9wYWNpdHk9Ii4zIiB0cmFuc2Zvcm09InNjYWxlKC4xKSIgdGV4dExlbmd0aD0iMjEwIj5NSVQ8L3RleHQ+PHRleHQgeD0iNjE1IiB5PSIxNDAiIHRyYW5zZm9ybT0ic2NhbGUoLjEpIiB0ZXh0TGVuZ3RoPSIyMTAiPk1JVDwvdGV4dD48L2c+IDwvc3ZnPg==)](https://github.com/petersamokhin/nodejs-markdown-site/blob/master/LICENSE)

Make your project documentation (or blog, or something else) with Markdown.

## Features
- HTML-generating on-the-fly from the Markdown files.
- Generating of navigation on-the-fly.
- Dynamic permissions management:
  * Each user has a list of roles.
  * Each page and directory should have a list of roles.
  * User can see the page (including navigation) if he has at least one role from page's list.
- Nice looking & adaptive design.
- Fully configurable.
- Other small but useful features:
  - Each header has `#link` to it
  - Most code snippets will have copy button on header above
  - All `kramdown` features

## TODO
- [x] Better error handling.
- [x] Global refactoring of code.
- [ ] Store configuration in database.
- [ ] Admin's page for change configurations (after previous paragraph).
- [ ] Better visual editor (maybe like GitHub's).
- [ ] Preview of result html on `/create` page.
- [ ] Search.

## Sample
This readme page after rendering:<br>
![](https://i.imgur.com/tFUfOZ5.png){:width="700px"}

And mobile version (iPhone 8 Plus):<br>
![](https://i.imgur.com/Qhf4mdu.jpg){:width="300px"}

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
