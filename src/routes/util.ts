/**
 * @ Author: chenkaibo
 * @ Create Time: 2019-11-02 10:43:03
 * @ Modified by: chenkaibo
 * @ Modified time: 2019-11-13 17:29:31
 * @ Description:工具类路由
 */

import * as Router from 'koa-router'
import * as controller from '../controller/util'
const router = new Router()

router.get('/wallpaper', controller.getWallpaper)

export default router
