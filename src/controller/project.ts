/**
 * @ Author: chenkaibo
 * @ Create Time: 2019-11-04 18:03:48
 * @ Modified by: chenkaibo
 * @ Modified time: 2019-11-04 18:10:52
 * @ Description: 项目控制层
 */

import { ParameterizedContext } from 'koa'
import { Project } from '../model'
export async function getProjects(ctx: ParameterizedContext) {
  try {
    const projects = await Project.find({}).populate([ 'members', 'group' ]).lean()
    ctx.body = ctx.resp.success({ data: projects })
  } catch (error) {
    ctx.body = ctx.resp.fail({ message: '列表获取失败' })
  }
}
