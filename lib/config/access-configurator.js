import Path from '../models/paths'
import User from '../models/user'
import globalConfig from '../config/global-config'
import { showNotFoundError } from '../utils/error-handler'
import fs from 'fs'

/**
 * Authentication middleware
 */
export function isLoggedInAndHaveAccess (req, res, next) {
  const allowed = req.isAuthenticated()
  const parentPaths = getAllParentPaths(req.path)
  console.error(`access on path ${req.path} ${allowed ? 'allowed' : 'denied'} [parents: ${JSON.stringify(parentPaths)}], user ${JSON.stringify(req.user)}`)

  // If user is logged in
  if (allowed) {
    // And can see all parent paths of current location
    // (there is manual access management with mongo)
    isUserCanSeeAllPaths(req.user.roles, parentPaths, (err, canSee) => {
      if (err) throw err

      if (canSee) {
        next()
      } else {
        showNotFoundError(res)
      }
    })
  } else {
    res.redirect('/markdown-knowledge-base/login')
  }
}

/**
 * User will see the page only if user can see all parent paths.
 *
 * @param userRoles Roles (permissions) array of user.
 * @param paths Paths (string array).
 * @param callback Error or result with boolean if user can see all paths.
 *
 * Note: if user has `super-admin` role, he can see whatever the f*ck he wants
 */
export function isUserCanSeeAllPaths (userRoles, paths, callback) {
  let userAdmin = userRoles.indexOf(globalConfig.super_admin_role) !== -1

  if (paths && paths.length > 0) {
    Path.findManyByPaths(paths, (err, ps) => {
      if (err) callback(err)
      let userHasRoles = ps.map(item => isUserCanSeePath(userRoles, item)).every(item => item)
      let result = userAdmin || userHasRoles
      callback(null, result)
    })
  } else {
    callback(null, userAdmin)
  }
}

/**
 * User will see the path if he has at least one role from path's roles list.
 * @param userRoles Roles (permissions) array of user.
 * @param path Path object from database.
 * @returns {boolean} If user can see the path.
 */
export function isUserCanSeePath (userRoles, path) {
  let admin = userRoles && userRoles.indexOf(globalConfig.super_admin_role) !== -1
  if (path && userRoles && path.roles && userRoles.length > 0 && path.roles.length > 0) {
    return path.roles.some(item => userRoles.indexOf(item) !== -1)
  } else {
    return admin
  }
}

/**
 * Get all parent paths for location, e.g.:
 * /some/long/path => [/some, /some/long, /some/long/path]
 */
export function getAllParentPaths (path) {
  let sep = '/'
  let paths = path.split('/')

  let result = new Set()

  for (let i = 0; i < paths.length; i++) {
    let p = paths.slice(0, i + 1).join(sep)
    if (p) {
      let s = decodeURIComponent(`${sep}${p}`.replace('//', '/'))
      result.add(s)
    }
  }
  return Array.from(result)
}

/**
 * Manage access to one location
 */
export function changePathRoles (path, roles) {
  Path.findOneAndUpdate({path: path}, {$push: {roles: { $each: roles }}}, {upsert: true}, (err) => {
    if (err) throw err
  })
}

/**
 * Manage access to many locations
 */
export function changePathsManyRoles (paths, roles) {
  paths.forEach(p => {
    changePathRoles(p, roles)
  })
}

/**
 * Manage access rights for user
 */
export function changeUserRoles (user, roles) {
  User.findOneAndUpdate({login: user}, {$set: {roles: roles}}, (err) => {
    if (err) throw err
  })
}

/**
 * Walk folder and find necessary access rights for each.
 * If there are no info about folder in database, or user hasn't any role of path,
 * value for path will be false, true otherwise.
 */
export function getAccessMapForFolderChildren (folder, userRoles, callback) {
  let children = Array.from(walkSync(folder)).map(item => item.substring(item.indexOf('/pages')).replace('.md', ''))
  let map = new Map()

  Path.findManyByPaths(children).then(paths => {
    paths.forEach(item => map.set(item.path, item.roles.some(itemRole => userRoles.indexOf(itemRole) !== -1)))
    callback(map)
  })
}

/**
 * Get all children (files and folders) as list (not as tree)
 */
export function walkSync (dir, filelist) {
  const files = fs.readdirSync(dir)
  filelist = filelist || new Set()
  files.forEach(file => {
    if (fs.statSync(dir + '/' + file).isDirectory()) {
      filelist = walkSync(`${dir + '/' + file}`, filelist)
    }
    filelist.add(`${dir}/${file}`)
  })
  return filelist
}

/**
 * Filter walk sync result (only dirs, etc) for front-end.
 */
export function walkDirs (dir, filelist, onlyName, filter) {
  let arr = Array.from(walkSync(dir, filelist))

  if (!filter) {
    arr = arr.filter(item => item.indexOf('.md') === -1)
  }

  return arr.map(item => item.substring(item.indexOf('/pages/') + (onlyName ? 7 : 0)).replace('.md', ''))
}
