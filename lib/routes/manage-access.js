import { changePathRoles, isLoggedInAndHaveAccess } from '../config/access-configurator'
import { Router } from 'express'

const router = Router()

export default () => {
  /**
   * Render page for managing access to pages and for users
   */
  router.route('/manage-access').get(isLoggedInAndHaveAccess, (req, res) => {
    res.render('manage-access')
  })

  /**
   * Handle new permissions
   */
  router.route('/manage-access').post(isLoggedInAndHaveAccess, (req, res) => {
    changePathRoles(req.body.path, req.body.roles.split(','))
    res.redirect('/markdown-knowledge-base/manage-access')
  })

  return router
}
