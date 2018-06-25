import { Router } from 'express'
import * as Configuration from '../utils/configuration'

const router = Router()

export default (passport) => {
  Configuration.get(Configuration.DEFAULT_GLOBAL_PATHS_PREFIX, (pathPrefix) => {
    /**
     * Show login page
     */
    router.route('/login').get((req, res) => res.render('login', {path_prefix: pathPrefix}))

    /**
     * Authenticate user
     */
    router.route('/login').post((req, res, next) => {
      let body = JSON.parse(JSON.stringify(req.body))
      console.error('post login ' + JSON.stringify(body))
      if (body.hasOwnProperty('login_user')) {
        passport.authenticate('local-login', {
          successRedirect: `${pathPrefix}/`,
          failureRedirect: `${pathPrefix}/login`
        })(req, res, next)
      } else if (body.hasOwnProperty('register_user')) {
        Configuration.get(Configuration.SIGN_UP_ALLOWED, (allowed) => {
          if (allowed) {
            passport.authenticate('local-signup', {
              successRedirect: `${pathPrefix}/`,
              failureRedirect: `${pathPrefix}/login`
            })(req, res, next)
          } else {
            res.render('login', {login_error: 'Sorry, signing up is not allowed'})
          }
        })
      } else {
        res.send({error: 'wtf?'})
      }
    })

    router.route('/logout').get((req, res, next) => {
      req.logout()
      req.session.destroy(function (err) {
        if (err) { return next(err) }
        return res.redirect(`${pathPrefix}/login`)
      })
      delete req.session
    })
  })

  return router
}
