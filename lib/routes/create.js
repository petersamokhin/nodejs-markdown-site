import { createMarkdownFile } from '../utils/markdown-to-html-handler'
import { changePathRoles, isLoggedInAndHaveAccess, walkDirs } from '../config/access-configurator'
import { Router } from 'express'
import globalConfig from '../config/global-config'
import User from '../models/user'

const router = Router()

export default () => {
  /**
   * Render page for article creating
   */
  router.route('/create').get(isLoggedInAndHaveAccess, (req, res) => {
    User.getAllRoles((err, roles) => {
      if (err) throw err

      res.render('create', {
        available_folders: walkDirs(appRoot + '/views/pages'),
        available_roles: roles
      })
    })
  })

  /**
   * Save new article as markdown file to `views/pages/`
   */
  router.route('/create').post(isLoggedInAndHaveAccess, (req, res) => {
    const path = `${appRoot}/views/pages/${req.body.new_path || req.body.path || globalConfig.main_pages_folder}/`.replace('//', '/')
    let roles = [].concat(req.body.roles ? req.body.roles : []).concat(req.body.new_roles ? req.body.new_roles.split(',') : [])

    createMarkdownFile(path, req.body.title, req.body.markdown, (page) => {
      changePathRoles(page.substring(page.indexOf('/pages')), roles)
      if (req.body.new_path) {
        let newpath = `/pages/${req.body.new_path}`
        if (newpath.endsWith('/')) newpath = newpath.substring(0, newpath.length - 1)
        changePathRoles(newpath, roles)
      }
      res.redirect(page)
    })
  })
  return router
}
