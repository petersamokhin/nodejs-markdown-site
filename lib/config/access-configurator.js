import Path from '../models/paths'
import globalConfig from '../config/global-config'
import fs from 'fs'

export function isLoggedInAndHaveAccess (req, res, next) {
  const allowed = req.isAuthenticated()
  const parentPaths = getAllParentPaths(req.path)
  console.error(`access on path ${req.path} ${allowed ? 'allowed' : 'denied'} [parents: ${JSON.stringify(parentPaths)}], user ${JSON.stringify(req.user)}`)

  if (allowed) {
    isUserCanSeeAllPaths(req.user.roles, parentPaths, (err, canSee) => {
      if (err) throw err

      if (canSee) {
        next()
      } else {
        res.send({error: 'You can`t see this page'})
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
 */
export function isUserCanSeeAllPaths (userRoles, paths, callback) {
  let userAdmin = userRoles.indexOf(globalConfig.super_admin_role) !== -1

  if (paths && paths.length > 0) {
    Path.findManyByPaths(paths, (err, ps) => {
      if (err) callback(err)
      let userHasRoles = ps.map(item => {
        return isUserCanSeePath(userRoles, item)
      }).every(item => item)
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

export function changePathRoles (path, roles) {
  console.error(`changePathRoles path ${path} roles ${roles}`)
  Path.findOneAndUpdate({path: path}, {$set: {roles: roles}}, {upsert: true}, (err) => {
    if (err) throw err
  })
}

export function getAccessMapForFolderChildren (folder, userRoles, callback) {
  let children = Array.from(walkSync(folder)).map(item => item.substring(item.indexOf('/pages')).replace('.md', ''))
  let map = new Map()

  Path.findManyByPaths(children).then(paths => {
    paths.forEach(item => map.set(item.path, item.roles.some(itemRole => userRoles.indexOf(itemRole) !== -1)))
    callback(map)
  })
}

function walkSync (dir, filelist) {
  const files = fs.readdirSync(dir)
  filelist = filelist || new Set()
  files.forEach(file => {
    if (fs.statSync(dir + '/' + file).isDirectory()) {
      filelist = walkSync(`${dir + '/' + file}`, filelist)
    }
    filelist.add(`/${dir}/${file}`)
  })
  return filelist
}
