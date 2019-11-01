import * as passport from 'koa-passport'
import * as passportLocal from 'passport-local'
import { User } from '../model'

// 使用本地策略
passport.use(
  new passportLocal.Strategy({ usernameField: 'username', passwordField: 'password' }, (username, password, done) => {
    User.findOne({ username })
      .lean()
      .then((user) => {
        if (username === user.username && password === user.password) {
          done(null, user)
        } else {
          done('用户名或密码错误!', false)
        }
      })
      .catch((err) => done(err))
  })
)
// 序列化 serializeUser 在用户登录验证成功以后将会把用户的数据存储到 session 中
passport.serializeUser((user: any, done) => {
  done(null, user._id + '')
})

// 反序列化 deserializeUser 在每次请求的时候将从 mongodb 中读取用户对象
passport.deserializeUser(async (_id, done) => {
  try {
    const user = await User.findById(_id)
    done(null, user)
  } catch (err) {
    done(err)
  }
})
export default passport
