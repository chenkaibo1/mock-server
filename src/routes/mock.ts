/**
 * @ Author: chenkaibo
 * @ Create Time: 2019-11-13 17:27:30
 * @ Modified by: chenkaibo
 * @ Modified time: 2019-11-13 17:36:31
 * @ Description: 接口路由
 */

import * as Router from 'koa-router'
import * as controller from '../controller/mock'
const router = new Router()

router.get('/list', controller.getMockList)
router.get('/detail', controller.getMockDetail)
router.post('/', controller.createMock)
router.put('/:id', controller.editMock)
router.delete('/:id', controller.deleteMock)

export default router
