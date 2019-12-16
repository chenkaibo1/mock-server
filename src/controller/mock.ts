/**
 * @ Author: chenkaibo
 * @ Create Time: 2019-11-13 17:22:29
 * @ Modified by: chenkaibo
 * @ Modified time: 2019-11-27 15:59:36
 * @ Description: 接口控制层
 */
import { ParameterizedContext } from 'koa'
import { Mock } from '../model'
import { VM } from 'vm2'
import redis from '../tools/redis'
import * as mockjs from 'mockjs'
import { parse } from 'url'
import { pathToRegexp, compile } from 'path-to-regexp'
import { publish } from 'postal'
import axios from 'axios'
import { assign } from 'lodash'
import * as tools from '../tools'

/**
 * @description 根据项目id获取接口列表
 * @author chenkaibo
 * @date 2019-11-13
 * @export
 * @param {ParameterizedContext} ctx
 */
export async function getMockList(ctx: ParameterizedContext) {
  try {
    const { pid, type } = ctx.query
    let search: any = {
      project: pid
    }
    if (type === 1) {
      search.creator = ctx.state.user.id
    }
    const mocks = await Mock.find(search).lean()
    ctx.body = ctx.resp.success({ data: mocks })
  } catch (error) {
    ctx.body = ctx.resp.fail()
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
    ctx.body = ctx.resp.fail()
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
    const exist = await Mock.findOne({ url: data.url, project: data.project, method: data.method }).lean()
    if (exist) {
      ctx.body = ctx.resp.fail({ message: 'url已存在' })
      return
    }
    const doc = await Mock.create(data)
    publish({
      channel: 'mock',
      topic: 'del.list',
      data: `project:${data.project}:mocks`
    })
    ctx.body = ctx.resp.success({ data: doc.id })
  } catch (error) {
    ctx.body = ctx.resp.fail()
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
    const doc = await Mock.findByIdAndUpdate(id, data).lean()
    publish({
      channel: 'mock',
      topic: 'del.mockData',
      data: `project:mock:${doc.project}:${doc.method}:${doc.url}`
    })
    publish({
      channel: 'mock',
      topic: 'del.list',
      data: `project:${doc.project}:mocks`
    })
    ctx.body = ctx.resp.success()
  } catch (error) {
    ctx.body = ctx.resp.fail()
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
    const doc = await Mock.findByIdAndDelete(id).lean()
    publish({
      channel: 'mock',
      topic: 'del.mockData',
      data: `project:mock:${doc.project}:${doc.method}:${doc.url}`
    })
    publish({
      channel: 'mock',
      topic: 'del.list',
      data: `project:${doc.project}:mocks`
    })
    ctx.body = ctx.resp.success()
  } catch (error) {
    ctx.body = ctx.resp.fail()
  }
}

export async function mockApi(ctx: ParameterizedContext) {
  try {
    const method = ctx.method.toLowerCase()
    const pathNode: any = pathToRegexp('/mock/:projectId(.{24})/:projectName/:mockURL*').exec(ctx.path)
    const projectId = pathNode[1]
    let mockURL = '/' + (pathNode[3] || '')
    const redisKey = `project:mock:${projectId}:${method}:${mockURL}`
    let apiData: any = await redis.get(redisKey)
    if (apiData) {
      apiData = JSON.parse(apiData)
    } else {
      // @ts-ignore
      mockjs.Handler.function = function(options) {
        const mockUrl = api.url.replace(/{/g, ':').replace(/}/g, '') // /api/{user}/{id} => /api/:user/:id
        options.Mock = mockjs
        options._req = ctx.request
        options._req.params = tools.params(mockUrl, mockURL)
        options._req.cookies = ctx.cookies.get.bind(ctx)
        return options.template.call(options.context.currentContext, options)
      }

      const api = await Mock.findOne({ project: projectId, url: mockURL, method }).lean()
      const vm = new VM({
        timeout: 1000,
        sandbox: {
          Mock: mockjs,
          mode: api.mode,
          template: new Function(`return ${api.mode}`) // eslint-disable-line
        }
      })
      vm.run('Mock.mock(new Function("return " + mode)())') // 数据验证，检测 setTimeout 等方法
      apiData = vm.run('Mock.mock(template())') // 沙箱中运行防止死循环
      /* istanbul ignore else */
      if (apiData._res) {
        // 自定义响应 Code
        let _res = apiData._res
        ctx.status = _res.status || /* istanbul ignore next */ 200
        /* istanbul ignore else */
        if (_res.cookies) {
          for (let i in _res.cookies) {
            /* istanbul ignore else */
            if (_res.cookies.hasOwnProperty(i)) ctx.cookies.set(i, _res.cookies[i])
          }
        }
        /* istanbul ignore next */
        if (_res.headers) {
          for (let i in _res.headers) {
            /* istanbul ignore next */
            if (_res.headers.hasOwnProperty(i)) ctx.set(i, _res.headers[i])
          }
        }
        /* istanbul ignore next */
        if (_res.status && parseInt(_res.status, 10) !== 200 && _res.data) apiData = _res.data
        delete apiData['_res']
      }
      await redis.set(redisKey, JSON.stringify(apiData))
    }
    ctx.body = ctx.resp.success({ data: apiData })
  } catch (error) {
    ctx.body = ctx.resp.fail()
  }
}
