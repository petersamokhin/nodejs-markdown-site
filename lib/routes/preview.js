import { Router } from 'express'
import { renderHtmlFromString } from '../utils/kramdown'
import { isLoggedInAndHaveAccess } from '../config/access-configurator'
import codeMirrorConfig from '../config/codemirror-mime-mapping'
import cheerio from 'cheerio'

const router = Router()

export default () => {
  router.route('/preview').post(isLoggedInAndHaveAccess, (req, res) => {
    renderHtmlFromString(req.body.markdown, (err, html) => {
      res.send({
        markdown: req.body.markdown,
        error: err || undefined,
        html: html ? prettifyHtml(html) : undefined
      })
    })
  })

  return router
}

function prettifyHtml (html) {
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

  return $.html()
}
