const Markdown = require('markdown-to-html').Markdown;
const mimeMap = require('../config/codemirror-mime-mapping');
const cheerio = require('cheerio');
const fs = require('fs');
const globalConfig = require('../config/global-config');
const generateNav = require('./generate-table-of-contents');
const mkdirs = require('mkdirp');
exports.markdownToHtml = markdownToHtml;
exports.createMarkdownFile = createMarkdownFile;

function markdownToHtml(file, callback) {

    const markdown = new Markdown();

    const opts = {
        title: 'Test title',
        template: fs.readFileSync(appRoot + globalConfig.markdown_to_html_page_template),
        content_type: 'content_file',
        template_type: 'template_text'
    };

    markdown.render(file, opts, (err, html) => {
        if (err) console.error(`render markdown error: ${err}`);
        let prettyHtml = prettifyHtml(html);

        callback(prettyHtml)
    })
}

function prettifyHtml(html) {
    let $ = cheerio.load(html);

    $('code').each((i, el) => {
        el = $(el);
        let c = el.attr('class').replace('lang-', '');

        el.attr('data-lang', mimeMap[c]);
        el.attr('class', 'code _highlighted');
    });

    let h = [];
    const hs = $('h1,h2,h3,h4,h5,h6');
    const cyrillicPattern = /[\u0400-\u04FF]/;
    hs.each((i, item) => {
        if (cyrillicPattern.test($(item).text())) {
            $(item).attr('id', 'header-' + i)
        }
    });

    hs.each((index, item) => {
        return h.push($(item).attr('id'));
    });
    h = h.map(x => `#${x}`);

    h.forEach(item => {
        $(item).append(`<a class="anchor" href="${item}"></a>`)
    });

    return $.html().replace('{navigation}', generateNav(`${appRoot}/views/pages`));
}

function createMarkdownFile(path, title, content, callback) {
    mkdirs(path, () => {
        fs.writeFileSync(path + title + '.md', content);
        const link = path.substring(path.indexOf('pages/'));
        callback(`/markdown-knowledge-base/${link}/${title}`);
    });
}