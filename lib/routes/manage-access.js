import { changePathRoles, changeUserRoles, isLoggedInAndHaveAccess, walkDirs } from '../config/access-configurator'
import { Router } from 'express'
import Path from '../models/paths'
import User from '../models/user'
import { showThrowableError } from '../utils/error-handler'
import * as Configuration from '../utils/configuration'
import fs from 'fs'

const router = Router()

export default () => {
  /**
   * Render page for managing access to pages and for users
   */
  router.route('/manage-access').get(isLoggedInAndHaveAccess, (req, res) => {
    let walk = walkDirs(appRoot + '/views/pages', null, false, true)

    Configuration.get(Configuration.DEFAULT_GLOBAL_PATHS_PREFIX, (pathPrefix) => {
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
                available_roles: Array.from(new Set(userRoles.concat(pathRoles))),
                path_prefix: pathPrefix
              }

              res.render('manage-access', data)
            })
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

      res.redirect(items[2] + '/manage-access')
    }, Configuration.DEFAULT_ROLES_USER, Configuration.DEFAULT_ROLES_PAGE, Configuration.DEFAULT_GLOBAL_PATHS_PREFIX)
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
          Path.getAll((err, allPaths) => {
            if (err) {
              showThrowableError(res, err)
              return
            }

            let allRoles = [...new Set(pathRoles.concat(userRoles))]

            Configuration.getAllSettings((err, settings) => {
              if (err) {
                showThrowableError(err)
                return
              }

              let aar = {}
              allRoles.forEach(i => { aar[i] = null })

              let accessMap = allRoles.map(r => {
                return {
                  name: r,
                  users: allUsers.filter(u => u.roles.indexOf(r) !== -1).map(u => u.login).sort(),
                  paths: allPaths.filter(p => p.roles.indexOf(r) !== -1).map(p => p.path).sort()
                }
              })

              res.send({
                settings: settings,
                ALL_AVAILABLE_ROLES: aar,
                map: accessMap
              })
            })
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
              if (key === Configuration.DEFAULT_GLOBAL_PATHS_PREFIX) {
                Configuration.get(Configuration.DEFAULT_GLOBAL_PATHS_PREFIX, (oldPrefix) => {
                  let publicFolder = `${appRoot}/public/`
                  fs.rename(publicFolder + oldPrefix, publicFolder + newValue, () => {
                    Configuration.change(key, {v: newValue})
                    console.error(`[${pair.type}] Changing ${key} configuration to «${newValue}» from «${pair.v}»`)
                  })
                })
              }
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

    Configuration.get(Configuration.DEFAULT_GLOBAL_PATHS_PREFIX, (pathPrefix) => {
      res.redirect(pathPrefix + '/manage-access')
    })
  })

  return router
}
