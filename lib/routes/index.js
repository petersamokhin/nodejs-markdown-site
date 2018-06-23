import { Router } from 'express'
import { initAccessRightsForNewPages, isLoggedInAndHaveAccess } from '../config/access-configurator'
import { markdownToHtml } from '../utils/markdown-to-html-handler'
import globalConfig from '../config/global-config'
import { showThrowableError } from '../utils/error-handler'

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
    markdownToHtml(`${appRoot}/views/pages/${globalConfig.main_pages_folder}/readme.md`, 'Markdown Site', req.user.roles, (err, html) => {
      if (err) showThrowableError(res, err)
      res.send(html)
    })

    initAccessRightsForNewPages()
  })

  return router
}
