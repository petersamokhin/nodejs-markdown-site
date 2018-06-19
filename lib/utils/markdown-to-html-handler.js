import { Markdown } from 'markdown-to-html'
import codeMirrorConfig from '../config/codemirror-mime-mapping'
import cheerio from 'cheerio'
import fs from 'fs'
import globalConfig from '../config/global-config'
import { getAllParentPaths } from '../config/access-configurator'
import generateNavigationForFolder from './generate-table-of-contents'
import mkdirs from 'mkdirp'

export function markdownToHtml (file, userRoles, callback) {
  const markdown = new Markdown()

  const opts = {
    title: 'Test title',
    template: `${appRoot}/${globalConfig.markdown_to_html_page_template}`,
    content_type: 'content_file',
    template_type: 'template_file'
  }

  markdown.render(file, opts, (err, html) => {
    if (err) console.error(`render markdown error: ${err}`)
    prettifyHtml(html, file, userRoles, callback)
  })
}

export function createMarkdownFile (path, title, content, linkCallback) {
  mkdirs(path, () => {
    fs.writeFileSync(path + title + '.md', content)
    const link = path.substring(path.indexOf('pages/'))
    linkCallback(`/markdown-knowledge-base/${link}${title}`)
  })
}

function prettifyHtml (html, file, userRoles, callback) {
  let $ = cheerio.load(html)

  /* Add code highlight by codemirror */
  $('code').each((i, el) => {
    let element = $(el)
    let c = element.attr('class').replace('lang-', '')
    let datalang = codeMirrorConfig.mimeMap[c]

    console.error('data-lang: ' + datalang)

    element.attr('data-lang', datalang)
    element.attr('class', 'code _highlighted')
  })

  /* Fix cyrillic header ids for links */
  let h = []
  const hs = $('h1,h2,h3,h4,h5,h6')

  const cyrillicPattern = /[\u0400-\u04FF]/
  hs.each((i, item) => {
    if (cyrillicPattern.test($(item).text())) {
      $(item).attr('id', 'header-' + i)
    }
  })
  hs.each((index, item) => {
    return h.push($(item).attr('id'))
  })
  h = h.map(x => `#${x}`)

  /* Make links for headers */
  h.forEach(item => {
    $(item).append(`<a class="anchor" href="${item}"></a>`)
  })

  /* Add generated navigation before return */
  generateNavigationForFolder(`${appRoot}/views/pages`, userRoles, nav => {
    /* Change style for active items */
    let htmlWithNav = $.html().replace('{navigation}', nav)
    let $$ = cheerio.load(htmlWithNav)

    getAllParentPaths(file.substring(file.indexOf('/pages')).replace('.md', ''))
      .forEach(item => {
        $$(`*[data-path="${item}"]`).toggleClass('is_active').removeClass('_closed').toggleClass('_opened')
      })

    callback($$.html())
  })
}
