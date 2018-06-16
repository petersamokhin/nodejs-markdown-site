const router = require('express').Router();
const mth = require('../utils/markdown-to-html-handler');
module.exports = router;

router.route('/').get((req, res) => {
    res.render('index')
});

router.route('/create').get((req, res) => {
    res.render('create')
});

router.route('/create').post((req, res) => {
    const fullPath = `${appRoot}/views/pages/${req.body.path || 'Основные статьи'}/`;

    mth.createMarkdownFile(fullPath, req.body.title, req.body.markdown, (path) => {
        res.redirect(path)
    });
});

router.route('/pages/*').get((req, res) => {
    let fileName = `${appRoot}/views${decodeURIComponent(req.path)}.md`;

    mth.markdownToHtml(fileName, html => {
        res.send(html)
    });
});