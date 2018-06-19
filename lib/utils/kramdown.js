import { exec } from './shell'
import fs from 'fs'
import globalConfig from '../config/global-config'

export function renderHtml (file, title, template, callback) {
  exec('kramdown', ['--input', 'GFM', '--no-hard-wrap', '--smart-quotes', 'apos,apos,quot,quot', '--no-enable-coderay', file], (err, html) => {
    if (err) callback(err)

    let content = fs.readFileSync(template).toString().replace(globalConfig.markdown_template_keyword, html).replace(globalConfig.markdown_page_title_keyword, title)
    callback(null, content)
  })
}
