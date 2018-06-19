import { createMarkdownFile } from '../utils/markdown-to-html-handler'
import { isLoggedInAndHaveAccess } from '../config/access-configurator'
import { Router } from 'express'
import globalConfig from '../config/global-config'

const router = Router()

export default () => {
  /**
   * Render page for article creating
   */
  router.route('/create').get(isLoggedInAndHaveAccess, (req, res) => {
    res.render('create')
  })

  /**
   * Save new article as markdown file to `views/pages/`
   */
  router.route('/create').post(isLoggedInAndHaveAccess, (req, res) => {
    const fullPath = `${appRoot}/views/pages/${req.body.path || globalConfig.main_pages_folder}/`

    createMarkdownFile(fullPath, req.body.title, req.body.markdown, (path) => {
      res.redirect(path)
    })
  })
  return router
}
