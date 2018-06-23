import { Strategy as LocalStrategy } from 'passport-local'
import User from '../models/user'
import * as Configuration from '../utils/configuration'

/**
 * Passport middleware.
 */
export default (passport) => {
  passport.serializeUser((user, done) => {
    done(null, user.id)
  })

  passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
      done(err, user)
    })
  })

  passport.use('local-login', new LocalStrategy({
    usernameField: 'login',
    passwordField: 'password',
    passReqToCallback: true
  },
  (req, login, password, done) => {
    process.nextTick(() => {
      User.findOne({'login': login}, (err, user) => {
        if (err) {
          return done(err)
        }

        if (!user) {
          return done(new Error('No user found'), false)
        }
        if (!user.validPassword(password.toString())) {
          return done(new Error('Oops! Wrong password.'), false)
        } else {
          return done(null, user)
        }
      })
    })
  }))

  passport.use('local-signup', new LocalStrategy({
    usernameField: 'login',
    passwordField: 'password',
    passReqToCallback: true
  },
  (req, login, password, done) => {
    process.nextTick(() => {
      if (!req.user) {
        Configuration.get(Configuration.DEFAULT_ROLES_USER, (defaultRoles) => {
          User.findOne({'login': login}, (err, user) => {
            if (err) {
              return done(err)
            }

            if (user) {
              return done(new Error('That login is already taken'), false)
            } else {
              let newUser = new User()

              newUser.login = login
              newUser.password = newUser.generateHash(password)
              newUser.roles = defaultRoles
              newUser.save()

              console.error('new user ' + newUser)

              return err ? done(err) : done(null, newUser)
            }
          })
        })
      } else if (!req.user.login) {
        User.findOne({'login': login}, (err, user) => {
          if (err) {
            return done(err)
          }

          if (user) {
            return done(new Error('That login is already taken'), false)
          } else {
            let user = req.user
            user.login = login
            user.password = user.generateHash(password)
            user.save(err => {
              return err ? done(err) : done(null, user)
            })
          }
        })
      } else {
        return done(null, req.user)
      }
    })
  }))
}
