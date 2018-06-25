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
    Path.getAllRoles((err, pathRoles) => {
      if (err) showThrowableError(res, err)

      User.getAllRoles((err, userRoles) => {
        if (err) showThrowableError(res, err)

        res.render('create', {
          available_folders: walkDirs(appRoot + '/views/pages'),
          available_roles: [...new Set(pathRoles.concat(userRoles))]
        })
      })
    })
  })

  router.route('/edit').get(isLoggedInAndHaveAccess, (req, res) => {
    Configuration.get(Configuration.DEFAULT_PAGES_FOLDER, (defatulFolder) => {
      let pathForEdit = req.query.path
      if (pathForEdit === '/') pathForEdit = '/pages/' + defatulFolder + '/readme'
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
                edit_roles: p.roles
              })
            })
          })
        })
      } else {
        showThrowableError(res, new Error('Sorry, page that you want to edit is not exists: ' + pathForEdit))
      }
    })
  })

  /**
   * Save new article as markdown file to `views/pages/`
   */
  router.route('/create').post(isLoggedInAndHaveAccess, (req, res) => {
    Configuration.get(Configuration.DEFAULT_PAGES_FOLDER, (defaultFolder) => {
      // Hardcoded parent path for all pages
      // If user provided new path, it will have priority above the existing paths
      const path = `${appRoot}/views/pages/${req.body.new_path || req.body.path || defaultFolder}/`.replace(/\/\//g, '/').replace(/\/pages\/pages/g, '/pages')

      if (path.indexOf('../') !== -1) {
        showThrowableError(res, new Error('Sorry, you can\'t create directory or file outside of {__dirname}/views/pages'))
        return
      }

      // Get all selected and new roles
      let roles = [].concat(req.body.roles ? req.body.roles : []).concat(req.body.new_roles ? req.body.new_roles.split(',') : [])

      // Get default roles from config if no roles provided
      if (roles.length === 0) roles = defaultFolder

      // Get, filter, etc. all parent paths
      let parents = [...new Set(getAllParentPaths(`${path.substring(path.indexOf('/pages'))}/${req.body.title}`.replace('//', '/')))]

      if (req.body.old_path) {
        let fp = `${appRoot}/views/pages/${req.body.old_path}.md`.replace(/\/\//g, '/').replace(/\/pages\/pages/g, '/pages')
        console.error(`Handle edit page: path=${req.body.old_path}, full=${fp}`)
        fs.unlink(fp)
      }

      // Create page
      // and add roles for it page and all parent paths (or create them with these roles)
      createMarkdownFile(path, req.body.title, req.body.markdown, (page) => {
        changePathsManyRoles(parents, roles)
        res.redirect(page)
      })
    })
  })
  return router
}
