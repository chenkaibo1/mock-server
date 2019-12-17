import * as Koa from 'koa'
import * as json from 'koa-json'
import * as bodyparser from 'koa-bodyparser'
import * as session from 'koa-generic-session'
import * as redisStore from 'koa-redis'
import * as logger from 'koa-logger'
import * as cors from 'kcors'
import router from './routes'
import * as onError from 'koa-onerror'
import * as possport from 'koa-passport'
import * as mongoose from 'mongoose'
// import chalk from 'chalk'
import config from './config'
import middleware from './middleware'
import initData from './tools/initData'
import koaStatic from './middleware/static'
const app = new Koa()

// 连接数据库
mongoose.set('debug', true)
mongoose.connect(config.mongodb.url, { useNewUrlParser: true, useUnifiedTopology: true }).then(() => {
  console.log('mongodb connect success!')
  initData()
})
app.keys = config.keys
app.use(
  session({
    store: redisStore(config.redis)
  })
)
app.use(possport.initialize()) // possport 序列化
app.use(possport.session()) // passport session策略
// error handler
onError(app)

// middlewares

process.env.NODE_ENV === 'development' && app.use(koaStatic.routes()).use(koaStatic.allowedMethods())

app.use(
  bodyparser({
    enableTypes: [ 'json', 'form', 'text' ]
  })
)
app.use(json())
if (process.env.NODE_ENV === 'development') {
  app.use(logger())
}

middleware(app) // 加载中间件

app.use(async (ctx, next) => {
  // 允许跨域
  ctx.set('Access-Control-Allow-Origin', '*')
  ctx.set('Access-Control-Allow-Methods', 'POST, GET, PUT, DELETE, OPTIONS')
  ctx.set('Access-Control-Allow-Credentials', 'true')
  await next()
  if (ctx.path === '/favicon.ico') return
  ctx.session.views = (ctx.session.views || 0) + 1
  const reqApp: any = ctx.app
  if (ctx.session.username) reqApp.counter.users[ctx.session.username] = true
})
// 开启跨域资源共享
// app.use(
//   cors({
//     credentials: true
//   })
// )

// routes
router(app)
// error-handling
app.on('error', (err, ctx) => {
  console.error('server error', err, ctx)
})

export default app
