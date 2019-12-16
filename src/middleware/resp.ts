import { ParameterizedContext } from 'koa'
const respFn = {
  success(resp?: any) {
    return {
      code: 200,
      success: true,
      message: resp ? resp.message : null,
      data: resp ? resp.data : null
    }
  },
  fail(resp?: any) {
    return {
      code: resp ? resp.code : -1,
      success: false,
      message: resp ? resp.message : null,
      data: resp ? resp.data : null
    }
  }
}

export default async (ctx: ParameterizedContext, next: any) => {
  ctx.resp = respFn
  await next()
}
