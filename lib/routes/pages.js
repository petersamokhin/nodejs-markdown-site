import { Router } from 'express'
import { markdownToHtml } from '../utils/markdown-to-html-handler'
import { isLoggedInAndHaveAccess, initAccessRightsForNewPages } from '../config/access-configurator'
import { showThrowableError } from '../utils/error-handler'
import * as Configuration from '../utils/configuration'

const router = Router()

export default () => {
  /**
   * Show pages, generated from markdown, by page
   */
  router.route('/pages/*').get(isLoggedInAndHaveAccess, (req, res) => {
    let fileName = `${appRoot}/views${decodeURIComponent(req.path)}.md`
    let title = `${fileName.substring(fileName.lastIndexOf('/') + 1).replace('.md', '')} | Markdown Website`

    markdownToHtml(fileName, title, req.user.roles, (err, html) => {
      if (err) {
        return showThrowableError(res, err)
      } else {
        Configuration.get(Configuration.DEFAULT_GLOBAL_PATHS_PREFIX, (pathPrefix) => {
          res.send(html.replace(/{path_prefix}/g, pathPrefix))
        })
      }
    })

    initAccessRightsForNewPages()
  })

  return router
}
