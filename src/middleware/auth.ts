import { ParameterizedContext } from 'koa'
import config from '../config'
import * as jwt from 'jsonwebtoken'
import { User } from '../model'
export default async (ctx: ParameterizedContext, next: any) => {
  try {
    if (config.whitelist.includes(ctx.path)) {
      await next()
    } else {
      // passport认证
      if (ctx.isAuthenticated()) {
        const decoded = jwt.verify(ctx.headers.token, config.secret) as any
        if (!decoded) {
          ctx.body = ctx.resp.fail({ message: '权限验证失败' })
          return
        }
        const user = await User.findOne({
          where: {
            id: decoded.id
          }
        })
        if (!user) {
          ctx.body = ctx.resp.fail({ message: '权限验证失败' })
          return
        }
        // ctx.state.user = decoded
        await next()
      } else {
        ctx.body = ctx.resp.fail({ message: '权限验证失败' })
        return
      }
    }
  } catch (error) {
    ctx.body = ctx.resp.fail({ message: '权限验证失败' })
    return
  }
}
