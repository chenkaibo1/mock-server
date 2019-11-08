/**
 * @ Author: chenkaibo
 * @ Create Time: 2019-11-04 18:03:48
 * @ Modified by: chenkaibo
 * @ Modified time: 2019-11-08 18:40:30
 * @ Description: 项目控制层
 */

import { ParameterizedContext } from 'koa'
import { Project, Mock } from '../model'
/**
 * @description 获取项目列表
 * @author chenkaibo
 * @date 2019-11-06
 * @export
 * @param {ParameterizedContext} ctx
 */
export async function getProjects(ctx: ParameterizedContext) {
  try {
    const uid = ctx.state.user.id
    const { type, keyword } = ctx.query // 0 全部 1 我创建的 2 我加入的
    let search
    if (+type === 0) {
      search = { $or: [ { user: uid }, { members: { $elemMatch: { $eq: uid } } } ] }
    } else if (+type === 1) {
      search = { user: uid }
    } else {
      search = { members: { $elemMatch: { $eq: uid } } }
    }
    if (keyword) {
      const keyExp = new RegExp(keyword, 'i')
      search = { $and: [ search, { $or: [ { url: keyExp }, { description: keyExp }, { name: keyExp } ] } ] }
    }
    const projects = await Project.find(search).populate([ 'user', 'members', 'group' ]).lean()
    ctx.body = ctx.resp.success({ data: projects })
  } catch (error) {
    console.log(error)
    ctx.body = ctx.resp.fail({ message: '列表获取失败' })
  }
}

/**
 * @description 创建项目
 * @author chenkaibo
 * @date 2019-11-07
 * @export
 * @param {ParameterizedContext} ctx
 */
export async function createProject(ctx: ParameterizedContext) {
  try {
    await Project.create(ctx.request.body)
    ctx.body = ctx.resp.success({ message: '项目创建成功' })
  } catch (error) {
    ctx.body = ctx.resp.fail({ message: '项目创建失败' })
  }
}

/**
 * @description 克隆项目
 * @author chenkaibo
 * @date 2019-11-06
 * @export
 * @param {ParameterizedContext} ctx
 */
export async function cloneProject(ctx: ParameterizedContext) {
  try {
    const id = ctx.params.id
    const uid = ctx.state.user.id
    if (!id) {
      ctx.body = ctx.resp.fail({ message: '参数错误' })
    }
    const project = await Project.findById(id).lean()
    // 创建演示项目
    const newProject = await Project.create({
      user: uid,
      name: `${project.name}_copy`,
      url: `${project.url}_copy`,
      description: project.description
    })
    const apis = await Mock.find({ project: id }).lean()
    const newAPIs = apis.map((item) => ({
      project: newProject.id,
      description: item.description,
      method: item.method,
      url: item.url,
      mode: item.mode
    }))
    await Mock.create(newAPIs)
    ctx.body = ctx.resp.success({ message: '克隆成功' })
  } catch (error) {
    ctx.body = ctx.resp.fail({ message: '克隆失败' })
  }
}

/** 
 * @description 项目删除
 * @author chenkaibo
 * @date 2019-11-06
 * @export
 * @param {ParameterizedContext} ctx
 */
export async function removeProject(ctx: ParameterizedContext) {
  try {
    const id = ctx.params.id
    await Promise.all([ Project.deleteOne({ _id: id }), Mock.deleteMany({ project: id }) ])
    ctx.body = ctx.resp.success({ message: '删除成功' })
  } catch (error) {
    ctx.body = ctx.resp.fail({ message: '删除失败' })
  }
}
