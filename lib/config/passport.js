import { Strategy as LocalStrategy } from 'passport-local'
import User from '../models/user'
import globalConfig from '../config/global-config'

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
          return done(null, false, req.flash('loginMessage', 'No user found.'))
        }
        if (!user.validPassword(password.toString())) {
          return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.'))
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
        User.findOne({'login': login}, (err, user) => {
          if (err) {
            return done(err)
          }

          if (user) {
            return done(null, false, req.flash('signupMessage', 'That login is already taken.'))
          } else {
            let newUser = new User()

            newUser.login = login
            newUser.password = newUser.generateHash(password)
            newUser.roles = globalConfig.new_user_roles
            newUser.save()

            console.error('new user ' + newUser)

            return err ? done(err) : done(null, newUser)
          }
        })
      } else if (!req.user.login) {
        User.findOne({'login': login}, (err, user) => {
          if (err) {
            return done(err)
          }

          if (user) {
            return done(null, false, req.flash('loginMessage', 'That login is already taken.'))
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
