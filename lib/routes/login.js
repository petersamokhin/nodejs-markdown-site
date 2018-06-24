import { Router } from 'express'
import * as Configuration from '../utils/configuration'
import { SIGN_UP_ALLOWED } from '../utils/configuration'

const router = Router()

export default (passport) => {
  /**
   * Show login page
   */
  router.route('/login').get((req, res) => res.render('login'))

  /**
   * Authenticate user
   */
  router.route('/login').post((req, res, next) => {
    let body = JSON.parse(JSON.stringify(req.body))
    console.error('post login ' + JSON.stringify(body))
    if (body.hasOwnProperty('login_user')) {
      passport.authenticate('local-login', {
        successRedirect: '/markdown-knowledge-base/',
        failureRedirect: '/markdown-knowledge-base/login'
      })(req, res, next)
    } else if (body.hasOwnProperty('register_user')) {
      Configuration.get(SIGN_UP_ALLOWED, (allowed) => {
        if (allowed) {
          passport.authenticate('local-signup', {
            successRedirect: '/markdown-knowledge-base/',
            failureRedirect: '/markdown-knowledge-base/login'
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
      return res.redirect('/markdown-knowledge-base/login')
    })
    delete req.session
  })

  return router
}
