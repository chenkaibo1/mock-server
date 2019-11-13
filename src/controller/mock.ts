/**
 * @ Author: chenkaibo
 * @ Create Time: 2019-11-13 17:22:29
 * @ Modified by: chenkaibo
 * @ Modified time: 2019-11-13 17:38:38
 * @ Description: 接口控制层
 */
import { ParameterizedContext } from 'koa'
import { Mock } from '../model'

/**
 * @description 根据项目id获取接口列表
 * @author chenkaibo
 * @date 2019-11-13
 * @export
 * @param {ParameterizedContext} ctx
 */
export async function getMockList(ctx: ParameterizedContext) {
  try {
    const { pid } = ctx.query
    const mocks: any[] = await Mock.find({ project: pid }).lean()
    ctx.body = ctx.resp.success({ data: mocks })
  } catch (error) {
    ctx.body = ctx.resp.fail({ message: '获取接口列表失败' })
  }
}
/**
 * @description 根据id获取接口详情
 * @author chenkaibo
 * @date 2019-11-13
 * @export
 * @param {ParameterizedContext} ctx
 */
export async function getMockDetail(ctx: ParameterizedContext) {
  try {
    const { id } = ctx.query
    const mocks: any = await Mock.findById(id).lean()
    ctx.body = ctx.resp.success({ data: mocks })
  } catch (error) {
    ctx.body = ctx.resp.fail({ message: '获取接口详情失败' })
  }
}

/**
 * @description 创建接口
 * @author chenkaibo
 * @date 2019-11-13
 * @export
 * @param {ParameterizedContext} ctx
 */
export async function createMock(ctx: ParameterizedContext) {
  try {
    const data = ctx.request.body
    const doc = await Mock.create(data)
    ctx.body = ctx.resp.success({ data: doc.id })
  } catch (error) {
    ctx.body = ctx.resp.fail({ message: '获取接口详情失败' })
  }
}
/**
 * @description 编辑接口
 * @author chenkaibo
 * @date 2019-11-13
 * @export
 * @param {ParameterizedContext} ctx
 */
export async function editMock(ctx: ParameterizedContext) {
  try {
    const data = ctx.request.body
    const id = ctx.params.id
    await Mock.findByIdAndUpdate(id, data)
    ctx.body = ctx.resp.success({ message: '接口修改成功' })
  } catch (error) {
    ctx.body = ctx.resp.fail({ message: '接口修改失败' })
  }
}
/**
 * @description 删除接口
 * @author chenkaibo
 * @date 2019-11-13
 * @export
 * @param {ParameterizedContext} ctx
 */
export async function deleteMock(ctx: ParameterizedContext) {
  try {
    const id = ctx.params.id
    await Mock.findByIdAndDelete(id)
    ctx.body = ctx.resp.success({ message: '接口删除成功' })
  } catch (error) {
    ctx.body = ctx.resp.fail({ message: '接口删除失败' })
  }
}
