import { Router } from 'express'
import { markdownToHtml } from '../utils/markdown-to-html-handler'
import { isLoggedInAndHaveAccess } from '../config/access-configurator'
import { showError } from '../utils/error-handler'

const router = Router()

export default () => {
  /**
   * Show pages, generated from markdown, by page
   */
  router.route('/pages/*').get(isLoggedInAndHaveAccess, (req, res) => {
    let fileName = `${appRoot}/views${decodeURIComponent(req.path)}.md`
    let title = `${fileName.substring(fileName.lastIndexOf('/') + 1).replace('.md', '')} | Markdown Website`

    markdownToHtml(fileName, title, req.user.roles, (err, html) => {
      if (err) showError(res, err)
      res.send(html)
    })
  })

  return router
}
