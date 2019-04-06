import { exec } from './shell'
import fs from 'fs'
import * as Configuration from './configuration'

/**
 * Kramdown wrapper.
 *
 * Read markdown file,
 * generate html,
 * replace title and content keywords.
 */
export function renderHtml (file, title, template, callback) {
  if (fs.existsSync(file)) {
    Configuration.getSeveral((items) => {
      // need to call using `ruby -EUTF-8` because it can't process unicode symbols.
      const params = ['-EUTF-8', '-S', 'kramdown', '--input', 'GFM', '--no-hard-wrap', '--smart-quotes', 'apos,apos,quot,quot', '--no-enable-coderay', file]
      exec('ruby', params, (err, html) => {
        if (err) {
          console.log(`kramdown error: ${err}`)
          callback('Kramdown error')
        }

        let content = fs.readFileSync(template).toString().replace(items[0], html).replace(items[1], title)
        callback(null, content)
      })
    }, Configuration.KEYWORD_MARKDOWN_CONTENT, Configuration.KEYWORD_PAGE_TITLE)
  } else {
    callback('Kramdown error')
  }
}

/**
 * Use script for input string, not file
 */
export function renderHtmlFromString (string, callback) {
  const params = ['-EUTF-8', '-S', `${appRoot}/public/ruby/kramdown-from-input-string.rb`, string]
  exec('ruby', params, (err, html) => {
    if (err) {
      callback('Kramdown error')
      return
    }
    callback(null, html)
  })
}
