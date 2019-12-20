/**
 * @ Author: chenkaibo
 * @ Create Time: 2019-11-02 10:43:03
 * @ Modified by: chenkaibo
 * @ Modified time: 2019-12-19 15:08:18
 * @ Description:工具类路由
 */

import * as Router from 'koa-router'
import * as controller from '../controller/util'
const router = new Router()

router.get('/wallpaper', controller.getWallpaper)
router.get('/dashboard', controller.getDashboard)
router.post('/upload', controller.upload)

export default router
