import { Router } from 'express'
import { initAccessRightsForNewPages, isLoggedInAndHaveAccess } from '../config/access-configurator'
import { markdownToHtml } from '../utils/markdown-to-html-handler'
import { showThrowableError } from '../utils/error-handler'
import * as Configuration from '../utils/configuration'

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
    Configuration.get(Configuration.DEFAULT_PAGES_FOLDER, (defaultFolder) => {
      markdownToHtml(`${appRoot}/views/pages/${defaultFolder}/readme.md`, 'Markdown Site', req.user.roles, (err, html) => {
        if (err) showThrowableError(res, err)
        res.send(html)
      })

      initAccessRightsForNewPages()
    })
  })

  return router
}
