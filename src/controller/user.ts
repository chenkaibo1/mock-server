import { User } from '../model'
import { ParameterizedContext } from 'koa'
import * as md5 from 'md5'
import passportLocal from '../common/possport'
import * as jwt from 'jsonwebtoken'
import config from '../config'
// 用户登录
export const login = async (ctx: ParameterizedContext, next: any) => {
  try {
    const { username, password } = ctx.request.body
    const exists = await User.findOne({ username })
    if (!exists) await User.create({ username, password: md5(md5(password)) })
    return passportLocal.authenticate('local', async (err, user, info) => {
      if (err) {
        ctx.body = ctx.resp.fail({ message: err })
      }
      if (user) {
        ctx.body = ctx.resp.success({
          message: '登陆成功',
          data: {
            user: { id: user._id, username: user.username },
            token: jwt.sign({ id: user._id, email: user.email, username: user.username }, config.secret, {
              expiresIn: '7d'
            })
          }
        })
        return ctx.login(user)
        // 这里调用ctx.login()函数传入的参数要和上文中的序列化函数passport.serializeUser对应
      }
    })(ctx, next)
  } catch (error) {
    ctx.throw(error)
  }
}
