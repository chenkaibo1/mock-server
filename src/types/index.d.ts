import { BaseContext } from 'koa'
declare module 'koa' {
  interface Resp {
    message?: string
    code?: string | number
    data?: any
  }
  interface BaseContext {
    resp: {
      success(resp: Resp): void
      fail(resp: Resp): void
    }
  }
}
