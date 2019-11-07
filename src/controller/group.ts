/**
 * @ Author: chenkaibo
 * @ Create Time: 2019-11-07 16:30:53
 * @ Modified by: chenkaibo
 * @ Modified time: 2019-11-07 16:34:00
 * @ Description: 团队控制层
 */

import { ParameterizedContext } from 'koa'
import { Group } from '../model'
/**
 * @description 获取个人所创建的团队
 * @author chenkaibo
 * @date 2019-11-07
 * @export
 * @param {ParameterizedContext} ctx
 */
export async function getCreateGroup(ctx: ParameterizedContext) {
  try {
    const groups = await Group.find({ user: ctx.state.user.id }).lean()
    ctx.body = ctx.resp.success({ data: groups })
  } catch (error) {
    ctx.body = ctx.resp.fail({})
  }
}
