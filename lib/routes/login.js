import { Router } from 'express'

const router = Router()

export default (passport) => {
  /**
   * Show login page
   */
  router.route('/login').get((req, res) => res.render('login'))

  /**
   * Authenticate user
   */
  router.route('/login').post(passport.authenticate('local-login', {
    successRedirect: '/markdown-knowledge-base/',
    failureRedirect: '/markdown-knowledge-base/login',
    failureFlash: true
  }))

  return router
}
