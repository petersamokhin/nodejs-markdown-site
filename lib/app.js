import path from 'path'
import express from 'express'
import mongoose from 'mongoose'
import passport from 'passport'
import session from 'express-session'
import connectMongo from 'connect-mongo'
import connectFlash from 'connect-flash'
import configPassport from './config/passport'
import mongoConfig from './config/database'
import globalConfig from './config/global-config'
import indexRouter from './routes/index'
import createRouter from './routes/create'
import loginRouter from './routes/login'
import manageAccessRouter from './routes/manage-access'
import pagesRouter from './routes/pages'
import signUpRouter from './routes/signup'
import { mustache } from 'consolidate'
import cookieParser from 'cookie-parser'
import morgan from 'morgan'

global.appRoot = path.resolve(__dirname)

const app = express()
const MongoStore = connectMongo(session)

mongoose.connect(mongoConfig.mongo_database_url)
const db = mongoose.connection

configPassport(passport)
app.use(cookieParser())
app.use(morgan('dev'))
app.use(express.json())
app.use(express.urlencoded({extended: false}))

app.use(session({
  secret: globalConfig.session_secret,
  resave: true,
  store: new MongoStore({
    mongooseConnection: db
  }),
  saveUninitialized: true
}))
app.use(passport.initialize())
app.use(passport.session())
app.use(connectFlash())
app.set('views', path.join(__dirname, '/views'))
app.set('view engine', 'html')
app.engine('html', mustache)

app.use(express.static(path.join(__dirname, '/public')))

app.use('/markdown-knowledge-base', loginRouter(passport))
app.use('/markdown-knowledge-base', signUpRouter(passport))
app.use('/markdown-knowledge-base', indexRouter())
app.use('/markdown-knowledge-base', createRouter())
app.use('/markdown-knowledge-base', manageAccessRouter())
app.use('/markdown-knowledge-base', pagesRouter())

app.get('/pls500', (req, res) => {
  res.send({
    content: kekmda.test.lol
  })
})

app.use(function (req, res) {
  let data = {
    success: false,
    error_code: 404,
    error_title: 'Страница не найдена, либо недостаточно прав для её просмотра'
  }

  res.status(404).render('error', data)
})

app.use(function (err, req, res, next) {
  let data = {
    success: false,
    error_code: 500,
    error_title: err.toString(),
    error_description: err.stack
  }

  res.status(500).render('error', data)
})

app.listen(3006)
