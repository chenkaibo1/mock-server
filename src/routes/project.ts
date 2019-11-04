/**
 * @ Author: chenkaibo
 * @ Create Time: 2019-11-04 18:03:24
 * @ Modified by: chenkaibo
 * @ Modified time: 2019-11-04 18:05:53
 * @ Description:项目路由
 */

import * as Router from 'koa-router'
import * as controller from '../controller/project'
const router = new Router()

router.get('/list', controller.getProjects)

export default router
