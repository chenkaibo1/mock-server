/**
 * @ Author: chenkaibo
 * @ Create Time: 2019-11-02 10:43:03
 * @ Modified by: chenkaibo
 * @ Modified time: 2019-11-13 17:29:53
 * @ Description:用户控制层
 */

import { User, Project, Mock } from '../model'
import { ParameterizedContext } from 'koa'
import passportLocal from '../common/possport'
import * as jwt from 'jsonwebtoken'
import config from '../config'
import { merge, random } from 'lodash'
import mock from '../tools/mock'
const gravatar = [
  '//img.souche.com/20161230/png/58f22ad636a0f33bad8762688f78d425.png',
  '//img.souche.com/20161230/png/6cdcda90c2f86ba1f45393cf5b26e324.png',
  '//img.souche.com/20161230/png/f9d10bb683d940dd14dc1b1344e89568.png',
  '//img.souche.com/20161230/png/8bb4f0fd45ed6ae26533eadd85f0f7ea.png',
  '//img.souche.com/20161230/png/0795744371fd5869af6cab796bdacb95.png',
  '//img.souche.com/20161230/png/bc836261fbb654dda6b653e428014279.png',
  '//img.souche.com/20161230/png/fd9f8aecab317e177655049a49b64d02.png'
]
/**
 * @description 用户登录
 * @author chenkaibo
 * @date 2019-11-07
 * @export
 * @param {ParameterizedContext} ctx
 * @param {*} next
 * @returns 
 */
export async function login(ctx: ParameterizedContext, next: any) {
  try {
    const { username } = ctx.request.body
    const exists = await User.findOne({ username })
    if (!exists) {
      // 创建用户
      const newUser = await User.create(merge(ctx.request.body, { headImg: gravatar[random(0, gravatar.length - 1)] }))
      // 创建演示项目
      const newProject = await Project.create({
        user: newUser.id,
        name: '演示项目',
        url: '/example',
        description: '已创建多种 Mock 类型，只需点击预览便可查看效果。亦可编辑，也可删除。'
      })
      await Mock.create(
        mock.examples.map((item) => ({
          project: newProject.id,
          description: item.desc,
          method: item.method,
          url: item.url,
          mode: item.mode
        }))
      )
    }
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

/**
 * @description 通过关键字查找用户
 * @author chenkaibo
 * @date 2019-11-07
 * @export
 * @param {ParameterizedContext} ctx
 */
export async function findUserByKeyword(ctx: ParameterizedContext) {
  try {
    const { keyword } = ctx.query
    const keyExp = new RegExp(keyword, 'i')
    const users = await User.find({ username: keyExp }).lean()
    ctx.body = ctx.resp.success({ data: users })
  } catch (error) {
    ctx.body = ctx.resp.fail({})
  }
}
