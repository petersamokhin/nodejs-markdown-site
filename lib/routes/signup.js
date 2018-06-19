import { Router } from 'express'

const router = Router()

export default (passport) => {
  /**
   * Render Sign Up page
   * */
  router.route('/signup').get((req, res) => res.render('signup'))

  /**
   * Register new user
   */
  router.route('/signup').post(passport.authenticate('local-signup', {
    successRedirect: '/markdown-knowledge-base/create',
    failureRedirect: '/markdown-knowledge-base/login',
    failureFlash: true
  }))

  return router
}
