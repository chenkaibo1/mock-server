import * as Router from 'koa-router'
import * as koaStatic from 'koa-static'
import { resolve } from 'path'
const staticRouter = new Router()
staticRouter.all('*', koaStatic(resolve(__dirname, '../../static')))
export default staticRouter
