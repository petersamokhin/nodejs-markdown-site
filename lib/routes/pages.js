import { Router } from 'express'
import { markdownToHtml } from '../utils/markdown-to-html-handler'
import { isLoggedInAndHaveAccess } from '../config/access-configurator'

const router = Router()

export default () => {
  /**
   * Show pages, generated from markdown, by page
   */
  router.route('/pages/*').get(isLoggedInAndHaveAccess, (req, res) => {
    let fileName = `${appRoot}/views${decodeURIComponent(req.path)}.md`

    markdownToHtml(fileName, 'Article | Markdown Website', req.user.roles, html => {
      res.send(html)
    })
  })

  return router
}
