/**
 * @ Author: chenkaibo
 * @ Create Time: 2019-11-04 18:03:48
 * @ Modified by: chenkaibo
 * @ Modified time: 2019-11-05 18:01:44
 * @ Description: 项目控制层
 */

import { ParameterizedContext } from 'koa'
import { Project } from '../model'
import { merge } from 'lodash'
export async function getProjects(ctx: ParameterizedContext) {
  try {
    const uid = ctx.state.user.id
    const { type, keywords } = ctx.query // 0 全部 1 我创建的 2 我加入的
    let search
    if (type === 0) {
      search = { $or: [ { user: uid }, { members: { $elemMatch: { $eq: uid } } } ] }
    } else if (type === 1) {
      search = { user: uid }
    } else {
      search = { members: { $elemMatch: { $eq: uid } } }
    }
    if (keywords) {
      const keyExp = new RegExp(keywords, 'i')
      merge(search, { $or: [ { url: keyExp }, { description: keyExp }, { name: keyExp } ] })
    }
    const projects = await Project.find(search)
      .populate([ { path: 'user', select: 'username' }, 'members', 'group' ])
      .lean()
    ctx.body = ctx.resp.success({ data: projects })
  } catch (error) {
    console.log(error)
    ctx.body = ctx.resp.fail({ message: '列表获取失败' })
  }
}
