import path from 'path'
import express from 'express'
import mongoose from 'mongoose'
import passport from 'passport'
import session from 'express-session'
import connectMongo from 'connect-mongo'
import configPassport from './config/passport'
import mongoConfig from './config/database'
import indexRouter from './routes/index'
import createRouter from './routes/create'
import loginRouter from './routes/login'
import previewRouter from './routes/preview'
import manageAccessRouter from './routes/manage-access'
import searchRouter from './routes/search'
import pagesRouter from './routes/pages'
import { mustache } from 'consolidate'
import cookieParser from 'cookie-parser'
import morgan from 'morgan'
import { processAllErrors } from './utils/error-handler'
import * as Configuration from './utils/configuration'

/**
 * Global variable with path
 * to main project directory
 */
global.appRoot = path.resolve(__dirname)

const app = express()
const MongoStore = connectMongo(session)

mongoose.connect(mongoConfig.mongo_database_url)
const db = mongoose.connection

Configuration.setDefaultSettingsIfNecessary(() => {
  configPassport(passport)
  app.use(cookieParser())
  app.use(morgan('dev'))
  app.use(express.json())
  app.use(express.urlencoded({extended: false}))

  app.use(session({
    secret: 'MIICXQIBAAKBgQCTDyYEz0EKmNSgyH2i',
    resave: true,
    store: new MongoStore({
      mongooseConnection: db
    }),
    saveUninitialized: true
  }))
  app.use(passport.initialize())
  app.use(passport.session())
  app.set('views', path.join(__dirname, '/views'))
  app.set('view engine', 'html')
  app.engine('html', mustache)

  app.use(express.static(path.join(__dirname, '/public')))

  /**
   * Note: prefix to all paths used because if project will be hosted
   * on server with many other projects, you can simply
   * use the nginx location like this:
   * location /markdown-site {
 *        proxy_pass http://localhost:3006;
 * }
   */
  app.use('/markdown-site', loginRouter(passport))
  app.use('/markdown-site', indexRouter())
  app.use('/markdown-site', createRouter())
  app.use('/markdown-site', manageAccessRouter())
  app.use('/markdown-site', pagesRouter())
  app.use('/markdown-site', previewRouter())
  app.use('/markdown-site', searchRouter())

  processAllErrors(app)

  app.listen(3006)
})
