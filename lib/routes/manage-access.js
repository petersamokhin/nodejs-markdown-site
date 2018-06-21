import { changePathRoles, changeUserRoles, isLoggedInAndHaveAccess, walkDirs } from '../config/access-configurator'
import { Router } from 'express'
import Path from '../models/paths'
import User from '../models/user'

const router = Router()

const r = {
  'request': {
    'selected_path': '/pages/Main articles',
    'path_roles': [
      'manager',
      'reader',
      'creator'
    ],
    'new_path_roles': '4,5,6',
    'selected_user': 'ps',
    'user_roles': [
      'manager',
      'reader',
      'creator'
    ],
    'new_user_roles': '7,8,9',
    'change_roles_user': ''
  }
}

export default () => {
  /**
   * Render page for managing access to pages and for users
   */
  router.route('/manage-access').get(isLoggedInAndHaveAccess, (req, res) => {
    let walk = walkDirs(appRoot + '/views/pages', null, false)

    User.getAllRoles((err, userRoles) => {
      if (err) throw err

      Path.getAllRoles((err, pathRoles) => {
        if (err) throw err

        User.getAllUsers((err, allUsers) => {
          if (err) throw err

          Path.findManyByPaths(walk, (err, paths) => {
            if (err) throw err

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
              available_folders: allPaths,
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
    let body = JSON.parse(JSON.stringify(req.body))

    if (body.hasOwnProperty('change_roles_user')) {
      let newRoles = body.user_roles.concat((body.new_user_roles ? body.new_user_roles.split(',') : []))
      changeUserRoles(body.selected_user, newRoles)
    } else if (body.hasOwnProperty('change_roles_path')) {
      let newRoles = body.path_roles.concat((body.new_path_roles ? body.new_path_roles.split(',') : []))
      changePathRoles(body.selected_path, newRoles)
    }

    res.redirect('/markdown-knowledge-base/manage-access')
  })

  router.route('/manage-access/get-path-roles').post(isLoggedInAndHaveAccess, (req, res) => {
    Path.findByPath(req.body.path, (err, item) => {
      if (err) throw err

      res.send({
        path: item.path,
        roles: item.roles
      })
    })
  })

  router.route('/manage-access/get-user-roles').post(isLoggedInAndHaveAccess, (req, res) => {
    User.findByLogin(req.body.login, (err, item) => {
      if (err) throw err

      res.send({
        login: item.login,
        roles: item.roles
      })
    })
  })

  return router
}
