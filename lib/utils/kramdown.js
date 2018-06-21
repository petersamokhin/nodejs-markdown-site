import { exec } from './shell'
import fs from 'fs'
import globalConfig from '../config/global-config'

export function renderHtml (file, title, template, callback) {
  const params = ['-EUTF-8', '-S', '/usr/local/bin/kramdown', '--input', 'GFM', '--no-hard-wrap', '--smart-quotes', 'apos,apos,quot,quot', '--no-enable-coderay', file]
  exec('ruby', params, (err, html) => {
    if (err) callback(err)

    let content = fs.readFileSync(template).toString().replace(globalConfig.markdown_template_keyword, html).replace(globalConfig.markdown_page_title_keyword, title)
    callback(null, content)
  })
}
