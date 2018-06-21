import { exec } from './shell'
import fs from 'fs'
import globalConfig from '../config/global-config'

/**
 * Kramdown wrapper.
 *
 * Read markdown file,
 * generate html,
 * replace title and content keywords.
 */
export function renderHtml (file, title, template, callback) {
  // need to call using `ruby -EUTF-8` because it can't process unicode symbols.
  const params = ['-EUTF-8', '-S', '/usr/local/bin/kramdown', '--input', 'GFM', '--no-hard-wrap', '--smart-quotes', 'apos,apos,quot,quot', '--no-enable-coderay', file]
  exec('ruby', params, (err, html) => {
    if (err) callback('Kramdown error')

    let content = fs.readFileSync(template).toString().replace(globalConfig.markdown_template_keyword, html).replace(globalConfig.markdown_page_title_keyword, title)
    callback(null, content)
  })
}
