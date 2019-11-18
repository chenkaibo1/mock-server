/**
 * @ Author: chenkaibo
 * @ Create Time: 2019-11-07 16:30:53
 * @ Modified by: chenkaibo
 * @ Modified time: 2019-11-18 15:14:17
 * @ Description: 团队控制层
 */

import { ParameterizedContext } from 'koa'
import { Group } from '../model'

/**
 * @description 获取团队列表(个人创建和加入的)
 * @author chenkaibo
 * @date 2019-11-07
 * @export
 * @param {ParameterizedContext} ctx
 */
export async function getGroupList(ctx: ParameterizedContext) {
  try {
    const { keyword } = ctx.query
    const id = ctx.state.user.id
    let search: any = { $or: [ { user: id }, { members: { $elemMatch: { $eq: id } } } ] }
    if (keyword) {
      const keyReg = new RegExp(keyword, 'i')
      search.name = keyReg
    }
    const groups = await Group.find(search).populate('user').lean()
    ctx.body = ctx.resp.success({ data: groups })
  } catch (error) {
    ctx.body = ctx.resp.fail({})
  }
}
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

/**
 * @description 创建团队
 * @author chenkaibo
 * @date 2019-11-08
 * @export
 * @param {ParameterizedContext} ctx
 */
export async function createGroup(ctx: ParameterizedContext) {
  try {
    const doc = await Group.create(ctx.request.body)
    const group = await Group.findOne({ name: ctx.request.body.name })
    if (group) {
      ctx.body = ctx.resp.fail({ message: '该团队已存在' })
    }
    ctx.body = ctx.resp.success({ data: { _id: doc._id } })
  } catch (error) {
    ctx.body = ctx.resp.fail()
  }
}

/**
 * @description 编辑团队
 * @author chenkaibo
 * @date 2019-11-08
 * @export
 * @param {ParameterizedContext} ctx
 */
export async function editGroup(ctx: ParameterizedContext) {
  try {
    await Group.findByIdAndUpdate(ctx.params.id, ctx.request.body)
    ctx.body = ctx.resp.success()
  } catch (error) {
    ctx.body = ctx.resp.fail()
  }
}

/**
 * @description 加入团队
 * @author chenkaibo
 * @date 2019-11-08
 * @export
 * @param {ParameterizedContext} ctx
 */
export async function joinGroup(ctx: ParameterizedContext) {
  try {
    const { name } = ctx.request.body
    const group: any = await Group.findOne({ name })
    if (!group) {
      ctx.body = ctx.resp.fail({ message: `${name}团队不存在` })
    }
    group.members.push(ctx.state.user.id)
    await group.save()
    ctx.body = ctx.resp.success({})
  } catch (error) {
    ctx.body = ctx.resp.fail({})
  }
}

/**
 * @description 删除团队
 * @author chenkaibo
 * @date 2019-11-08
 * @export
 * @param {ParameterizedContext} ctx
 */
export async function deleteGroup(ctx: ParameterizedContext) {
  try {
    await Group.findByIdAndDelete(ctx.params.id)
    ctx.body = ctx.resp.success({})
  } catch (error) {
    ctx.body = ctx.resp.fail({})
  }
}
