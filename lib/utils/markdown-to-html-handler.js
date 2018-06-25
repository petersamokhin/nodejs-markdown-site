import { renderHtml } from '../utils/kramdown'
import codeMirrorConfig from '../config/codemirror-mime-mapping'
import cheerio from 'cheerio'
import fs from 'fs'
import { getAllParentPaths } from '../config/access-configurator'
import generateNavigationForFolder from './generate-table-of-contents'
import mkdirs from 'mkdirp'
import * as Configuration from '../utils/configuration'

/**
 * Get the result version of page
 * for rendering from file path
 * based on request location.
 */
export function markdownToHtml (file, title, userRoles, callback) {
  Configuration.get(Configuration.TEMPLATE_FILE, (template) => {
    let tmp = `${appRoot}${template}`

    console.error(`markdownToHtml: file=${file}, title=${title}, roles=${JSON.stringify(userRoles)}, tmp=${JSON.stringify(tmp)}`)

    renderHtml(file, title, tmp, (err, html) => {
      if (err) {
        callback(err)
        return
      }
      prettifyHtml(html, file, userRoles, callback)
    })
  })
}

/**
 * Write markdown content to file.
 */
export function createMarkdownFile (path, title, content, linkCallback) {
  mkdirs(path, () => {
    fs.writeFileSync(path + title + '.md', content)
    const link = path.substring(path.indexOf('pages/'))
    linkCallback(`/markdown-knowledge-base/${link}${title}`)
  })
}

/**
 * Do some manipulations with html before rendering:
 *
 * - Add `data-lang` attributes based `language-${lang}` classes for elements
 * - Colorize code with CodeMirror based on `data-lang` attributes
 * - Fix cyrillic headers (or ids for headers will be empty)
 * - Add links to headers
 * - Add `copy` buttons for code snippets
 * - Add generated navigation
 */
function prettifyHtml (html, file, userRoles, callback) {
  let $ = cheerio.load(html)

  /* Add code highlight by codemirror */
  $('code').each((i, el) => {
    let element = $(el)
    let c = element.attr('class') ? element.attr('class').replace('language-', '') : ''
    let datalang = codeMirrorConfig.mimeMap[c]

    element.attr('data-lang', datalang)
    element.addClass('code _highlighted')
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
    let el = $(item)
    el.append(`<a class="anchor" href="${item}"></a>`)

    let ind = el.parent().children().index(el) + 1
    let pre = el.parent().children()[ind]

    if (pre && pre.name === 'pre') {
      el.append(`<a class="ctrlc" onclick="M.toast({html: 'Скопировано', displayLength: 800})"></a>`)
      let aEl = el.find('a.ctrlc')
      let codeEl = $(pre).find('code')
      let dct = el.attr('id') + '-code'

      codeEl.attr('id', dct)
      aEl.attr('data-clipboard-target', '#' + dct)
    }
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

    callback(null, $$.html())
  })
}
