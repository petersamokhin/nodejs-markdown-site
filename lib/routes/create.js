import { createMarkdownFile } from '../utils/markdown-to-html-handler'
import { getAllParentPaths, isLoggedInAndHaveAccess, walkDirs, changePathsManyRoles } from '../config/access-configurator'
import { Router } from 'express'
import User from '../models/user'
import Path from '../models/paths'
import { showThrowableError } from '../utils/error-handler'
import * as Configuration from '../utils/configuration'
import fs from 'fs'

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
    Configuration.get(Configuration.DEFAULT_GLOBAL_PATHS_PREFIX, (pathPrefix) => {
      Path.getAllRoles((err, pathRoles) => {
        if (err) showThrowableError(res, err)

        User.getAllRoles((err, userRoles) => {
          if (err) showThrowableError(res, err)

          res.render('create', {
            available_folders: walkDirs(appRoot + '/views/pages'),
            available_roles: [...new Set(pathRoles.concat(userRoles))],
            path_prefix: pathPrefix
          })
        })
      })
    })
  })

  router.route('/edit').get(isLoggedInAndHaveAccess, (req, res) => {
    Configuration.getSeveral((items) => {
      let pathForEdit = req.query.path
      if (pathForEdit === '/') pathForEdit = '/pages/' + items[0] + '/readme'
      let fileName = `${appRoot}/views${decodeURIComponent(pathForEdit)}.md`
      if (fs.existsSync(fileName)) {
        Path.getAllRoles((err, pathRoles) => {
          if (err) showThrowableError(res, err)

          User.getAllRoles((err, userRoles) => {
            if (err) showThrowableError(res, err)

            Path.findByPath(pathForEdit, (err, p) => {
              if (err) showThrowableError(res, err)

              res.render('create', {
                available_folders: walkDirs(appRoot + '/views/pages'),
                available_roles: [...new Set(pathRoles.concat(userRoles))],
                edit_mode: true,
                edit_path: pathForEdit.substring(0, pathForEdit.lastIndexOf('/')),
                edit_full_path: pathForEdit,
                edit_text: fs.readFileSync(fileName).toString(),
                edit_title: pathForEdit.substring(pathForEdit.lastIndexOf('/') + 1),
                edit_roles: p.roles,
                path_prefix: items[1]
              })
            })
          })
        })
      } else {
        showThrowableError(res, new Error('Sorry, page that you want to edit is not exists: ' + pathForEdit))
      }
    }, Configuration.DEFAULT_PAGES_FOLDER, Configuration.DEFAULT_GLOBAL_PATHS_PREFIX)
  })

  /**
   * Save new article as markdown file to `views/pages/`
   */
  router.route('/create').post(isLoggedInAndHaveAccess, (req, res) => {
    Configuration.getSeveral((items) => {
      // Hardcoded parent path for all pages
      // If user provided new path, it will have priority above the existing paths
      const path = `${appRoot}/views/pages/${req.body.new_path || req.body.path || items[0]}/`.replace(/\/\//g, '/').replace(/\/pages\/pages/g, '/pages')

      if (path.indexOf('../') !== -1) {
        showThrowableError(res, new Error('Sorry, you can\'t create directory or file outside of {__dirname}/views/pages'))
        return
      }

      // Get all selected and new roles
      let roles = [].concat(req.body.roles ? req.body.roles : []).concat(req.body.new_roles ? req.body.new_roles.split(',') : [])

      // Get default roles from config if no roles provided
      if (roles.length === 0) roles = items[1]

      // Get, filter, etc. all parent paths
      let parents = [...new Set(getAllParentPaths(`${path.substring(path.indexOf('/pages'))}/${req.body.title}`.replace('//', '/')))]

      if (req.body.old_path) {
        let fp = `${appRoot}/views/pages/${req.body.old_path}.md`.replace(/\/\//g, '/').replace(/\/pages\/pages/g, '/pages')
        fs.unlink(fp)
      }

      // Create page
      // and add roles for it page and all parent paths (or create them with these roles)
      createMarkdownFile(path, req.body.title, req.body.markdown, (page) => {
        changePathsManyRoles(parents, roles)
        res.redirect(page)
      })
    }, Configuration.DEFAULT_PAGES_FOLDER, Configuration.DEFAULT_ROLES_PAGE)
  })

  /**
   * Delete page.
   */
  router.route('/create').delete((req, res) => {
    fs.unlink(`${appRoot}/views${req.body.path}.md`.replace(/\/\//g, '/').replace(/\/pages\/pages/g, '/pages'))
    Path.deleteByPath(req.body.path)
    res.send({ok: true})
  })

  return router
}
