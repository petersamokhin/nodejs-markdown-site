import { changePathRoles, changeUserRoles, isLoggedInAndHaveAccess, walkDirs } from '../config/access-configurator'
import { Router } from 'express'
import Path from '../models/paths'
import User from '../models/user'
import { showThrowableError } from '../utils/error-handler'
import * as Configuration from '../utils/configuration'

const router = Router()

export default () => {
  /**
   * Render page for managing access to pages and for users
   */
  router.route('/manage-access').get(isLoggedInAndHaveAccess, (req, res) => {
    let walk = walkDirs(appRoot + '/views/pages', null, false, true)

    // ¯\_(ツ)_/¯
    User.getAllRoles((err, userRoles) => {
      if (err) {
        showThrowableError(res, err)
        return
      }

      // ¯\_(ツ)_/¯
      Path.getAllRoles((err, pathRoles) => {
        if (err) {
          showThrowableError(res, err)
          return
        }

        // ¯\_(ツ)_/¯
        User.getAllUsers((err, allUsers) => {
          if (err) {
            showThrowableError(res, err)
            return
          }

          // ¯\_(ツ)_/¯
          Path.getAll((err, paths) => {
            if (err) {
              showThrowableError(res, err)
              return
            }

            let allPaths = []

            paths.forEach(item => {
              allPaths.push({
                path: item.path,
                roles: item.roles
              })
            })

            walk.forEach(item => {
              if (allPaths.every(it => it.path !== item)) {
                allPaths.push({
                  path: item,
                  roles: []
                })
              }
            })

            let data = {
              available_folders: allPaths.sort((a, b) => a.path.localeCompare(b.path)),
              available_users: allUsers,
              available_roles: Array.from(new Set(userRoles.concat(pathRoles)))
            }

            res.render('manage-access', data)
          })
        })
      })
    })
  })

  /**
   * Handle new permissions
   */
  router.route('/manage-access').post(isLoggedInAndHaveAccess, (req, res) => {
    Configuration.getSeveral((items) => {
      let body = JSON.parse(JSON.stringify(req.body))

      if (body.hasOwnProperty('change_roles_user')) {
        let newRoles = (body.user_roles && Array.isArray(body.user_roles) && body.user_roles.length > 0 ? body.user_roles : []).concat((body.new_user_roles ? body.new_user_roles.split(',') : items[0]))
        changeUserRoles(body.selected_user, [...new Set(newRoles)])
      } else if (body.hasOwnProperty('change_roles_path')) {
        let newRoles = (body.path_roles && Array.isArray(body.path_roles) && body.path_roles.length > 0 ? body.path_roles : []).concat((body.new_path_roles ? body.new_path_roles.split(',') : items[1]))
        changePathRoles(body.selected_path, [...new Set(newRoles)])
      }

      res.redirect('/markdown-knowledge-base/manage-access')
    }, Configuration.DEFAULT_ROLES_USER, Configuration.DEFAULT_ROLES_PAGE)
  })

  router.route('/manage-access/get-path-roles').post(isLoggedInAndHaveAccess, (req, res) => {
    console.log('/manage-access/get-path-roles: ' + req.body.path)
    Path.findByPath(req.body.path, (err, item) => {
      if (err) {
        showThrowableError(res, err)
        return
      }

      res.send({
        path: item ? item.path : req.body.path,
        roles: item ? item.roles : []
      })
    })
  })

  router.route('/manage-access/get-user-roles').post(isLoggedInAndHaveAccess, (req, res) => {
    User.findByLogin(req.body.login, (err, item) => {
      if (err) {
        showThrowableError(res, err)
        return
      }

      res.send({
        login: item.login,
        roles: item.roles
      })
    })
  })

  router.route('/manage-access/get-all-settings').post(isLoggedInAndHaveAccess, (req, res) => {
    Path.getAllRoles((err, pathRoles) => {
      User.getAllRoles((err, userRoles) => {
        let allRoles = [...new Set(pathRoles.concat(userRoles))]

        Configuration.getAllSettings((err, settings) => {
          if (err) {
            showThrowableError(err)
            return
          }

          let aar = {}
          allRoles.forEach(i => { aar[i] = null })

          res.send({
            settings: settings,
            ALL_AVAILABLE_ROLES: aar
          })
        })
      })
    })
  })

  router.route('/manage-access/change-settings').post(isLoggedInAndHaveAccess, (req, res) => {
    let body = JSON.parse(JSON.stringify(req.body))
    Configuration.ALL_SETTINGS_KEYS.forEach(key => {
      let hasNewValue = body.hasOwnProperty(key)
      let newValue = body[key]
      Configuration.getDoc(key, (pair) => {
        switch (pair.type) {
          case 'string': {
            if (hasNewValue && newValue.length > 0) {
              Configuration.change(key, {v: newValue})
              console.error(`[${pair.type}] Changing ${key} configuration to «${newValue}» from «${pair.v}»`)
            }
            break
          }
          case 'role': {
            if (hasNewValue && newValue.length > 0) {
              let roles = newValue.split(',')
              if (roles.length > 0) {
                Configuration.change(key, {v: roles})
                console.error(`[${pair.type}] Changing ${key} configuration to «${JSON.stringify(roles)}» from «${JSON.stringify(pair.v)}»`)
              }
            }
            break
          }
          case 'boolean': {
            if (hasNewValue) {
              if (newValue === 'on') {
                Configuration.change(key, {v: true})
                console.error(`[${pair.type}] Changing ${key} configuration to «${true}» from «${pair.v}»`)
              } else {
                console.error(`[${pair.type}] Can't recognize new value for configuration: key=${key}, newValue=${newValue}`)
              }
            } else {
              Configuration.change(key, {v: false})
              console.error(`[${pair.type}] Changing ${key} configuration to «${false}» from «${pair.v}»`)
            }
            break
          }
        }
      })
    })

    res.redirect('/markdown-knowledge-base/manage-access')
  })

  return router
}
