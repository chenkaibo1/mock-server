import { Context } from 'koa'
const respFn = {
  success(resp: any) {
    return {
      code: 200,
      success: true,
      message: resp.message || null,
      data: resp.data || null
    }
  },
  fail(resp: any) {
    return {
      code: resp.code || -1,
      success: false,
      message: resp.message || null,
      data: resp.data || null
    }
  }
}

export default async (ctx: Context, next: any) => {
  ctx.resp = respFn
  await next()
}
