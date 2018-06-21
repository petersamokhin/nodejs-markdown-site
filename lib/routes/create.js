import { createMarkdownFile } from '../utils/markdown-to-html-handler'
import { getAllParentPaths, isLoggedInAndHaveAccess, walkDirs, changePathsManyRoles } from '../config/access-configurator'
import { Router } from 'express'
import globalConfig from '../config/global-config'
import User from '../models/user'
import { showThrowableError } from '../utils/error-handler'

const router = Router()

/**
 * Router for creating articles.
 * @returns {Router}
 */
export default () => {
  /**
   * Render page for article creating
   */
  router.route('/create').get(isLoggedInAndHaveAccess, (req, res) => {
    User.getAllRoles((err, roles) => {
      if (err) showThrowableError(res, err)

      res.render('create', {
        available_folders: walkDirs(appRoot + '/views/pages'),
        available_roles: [...new Set(roles)]
      })
    })
  })

  /**
   * Save new article as markdown file to `views/pages/`
   */
  router.route('/create').post(isLoggedInAndHaveAccess, (req, res) => {
    // Hardcoded parent path for all pages
    // If user provided new path, it will have priority above the existing paths
    const path = `${appRoot}/views/pages/${req.body.new_path || req.body.path || globalConfig.main_pages_folder}/`.replace('//', '/').replace('/pages/pages', '/pages')

    // Get all selected and new roles
    let roles = [].concat(req.body.roles ? req.body.roles : []).concat(req.body.new_roles ? req.body.new_roles.split(',') : [])

    // Get default roles from config if no roles provided
    if (roles.length === 0) roles = globalConfig.default_page_roles

    // Get, filter, etc. all parent paths
    let parents = [...new Set(getAllParentPaths(`${path.substring(path.indexOf('/pages'))}/${req.body.title}`.replace('//', '/')))]

    // Create page
    // and add roles for it page and all parent paths (or create them with these roles)
    createMarkdownFile(path, req.body.title, req.body.markdown, (page) => {
      changePathsManyRoles(parents, roles)
      res.redirect(page)
    })
  })
  return router
}
