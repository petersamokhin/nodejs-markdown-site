import { Router } from 'express'
import { isLoggedInAndHaveAccess } from '../config/access-configurator'
import { markdownToHtml } from '../utils/markdown-to-html-handler'
import globalConfig from '../config/global-config'

const router = Router()

/**
 * Router for main page.
 *
 * Renders `readme.md` from default pages folder.
 */
export default () => {
  /**
   * Render index page ( e.g. readme )
   */
  router.route('/').get(isLoggedInAndHaveAccess, (req, res) => {
    markdownToHtml(`${appRoot}/views/pages/${globalConfig.main_pages_folder}/readme.md`, 'README', req.user.roles, html => {
      res.send(html)
    })
  })

  return router
}
