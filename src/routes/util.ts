import * as Router from 'koa-router'
import * as controller from '../controller/util'
const router = new Router()

router.get('/wallpaper', controller.getWallpaper)

export default router
