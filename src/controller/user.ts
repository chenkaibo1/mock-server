import { User } from '../model'
import { ParameterizedContext } from 'koa'
import * as md5 from 'md5'
import passportLocal from '../common/possport'
import * as jwt from 'jsonwebtoken'
import config from '../config'
import { merge, random } from 'lodash'
const gravatar = [
  '//img.souche.com/20161230/png/58f22ad636a0f33bad8762688f78d425.png',
  '//img.souche.com/20161230/png/6cdcda90c2f86ba1f45393cf5b26e324.png',
  '//img.souche.com/20161230/png/f9d10bb683d940dd14dc1b1344e89568.png',
  '//img.souche.com/20161230/png/8bb4f0fd45ed6ae26533eadd85f0f7ea.png',
  '//img.souche.com/20161230/png/0795744371fd5869af6cab796bdacb95.png',
  '//img.souche.com/20161230/png/bc836261fbb654dda6b653e428014279.png',
  '//img.souche.com/20161230/png/fd9f8aecab317e177655049a49b64d02.png'
]
// 用户登录
export const login = async (ctx: ParameterizedContext, next: any) => {
  try {
    const { username } = ctx.request.body
    const exists = await User.findOne({ username })
    if (!exists) await User.create(merge(ctx.request.body, { headImg: gravatar[random(0, gravatar.length - 1)] }))
    return passportLocal.authenticate('local', async (err, user, info) => {
      if (err) {
        ctx.body = ctx.resp.fail({ message: err })
      }
      if (user) {
        ctx.body = ctx.resp.success({
          message: '登陆成功',
          data: {
            user: { id: user._id, username: user.username, headImg: user.headImg },
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
