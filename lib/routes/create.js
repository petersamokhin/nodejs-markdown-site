import { createMarkdownFile } from '../utils/markdown-to-html-handler'
import {
  getAllParentPaths,
  isLoggedInAndHaveAccess,
  walkDirs,
  changePathsManyRoles
} from '../config/access-configurator'
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
        available_roles: [...new Set(roles)]
      })
    })
  })

  /**
   * Save new article as markdown file to `views/pages/`
   */
  router.route('/create').post(isLoggedInAndHaveAccess, (req, res) => {
    const path = `${appRoot}/views/pages/${req.body.new_path || req.body.path || globalConfig.main_pages_folder}/`.replace('//', '/').replace('/pages/pages', '/pages')
    let roles = [].concat(req.body.roles ? req.body.roles : []).concat(req.body.new_roles ? req.body.new_roles.split(',') : [])
    if (roles.length === 0) roles = globalConfig.default_page_roles

    let p = `${path.substring(path.indexOf('/pages'))}/${req.body.title}`.replace('//', '/')
    let gap = getAllParentPaths(p)
    let parents = [...new Set(gap)]

    console.log(`NEW ARTICLE ALL PARENTS: roles=${JSON.stringify(roles)}, [${JSON.stringify(gap)}], mapped=${JSON.stringify(parents)}`)
    console.log(`NEW ARTICLE PATH: ${path}`)

    createMarkdownFile(path, req.body.title, req.body.markdown, (page) => {
      changePathsManyRoles(parents, roles)
      res.redirect(page)
    })
  })
  return router
}
