import { Router } from 'express'
import { isLoggedInAndHaveAccess, getAllAvailablePagesForUser } from '../config/access-configurator'
import { findInFiles } from 'find-in-files'
import removeMarkdown from 'remove-markdown'
import * as Configuration from '../utils/configuration'

const router = Router()

export default () => {
  router.route('/search').post(isLoggedInAndHaveAccess, (req, res) => {
    Configuration.get(Configuration.DEFAULT_GLOBAL_PATHS_PREFIX, (pathPrefix) => {
      getAllAvailablePagesForUser(req.user.roles, availableFiles => {
        try {
          findInFiles(req.body.text, availableFiles).then(results => {
            let result = Object.keys(results).map(key => {
              let item = results[key]

              let title = key.substring(key.lastIndexOf('/') + 1, key.lastIndexOf('.'))
              let line = removeMarkdown((Array.isArray(item.line) ? item.line[0] : item.line)).toString()
              if (line.length > 50) line = line.substring(0, 50)

              return {
                title: title,
                line: line,
                path: pathPrefix + '/pages/' + key.substring(key.lastIndexOf('/pages/') + 7, key.lastIndexOf('.'))
              }
            })

            res.send(result)
          })
        } catch (e) {
          res.send([])
        }
      })
    })
  })

  return router
}
