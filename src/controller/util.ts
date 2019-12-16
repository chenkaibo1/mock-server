/**
 * @ Author: chenkaibo
 * @ Create Time: 2019-10-30 15:41:23
 * @ Modified by: chenkaibo
 * @ Modified time: 2019-12-16 12:35:16
 * @ Description: 工具类控制层
 */

import { ParameterizedContext } from 'koa'
import redis from '../tools/redis'
import config from '../config'
import axios from 'axios'
import * as koaBody from 'koa-body'
import * as path from 'path'
/**
 * @description 获取壁纸
 * @author chenkaibo
 * @date 2019-10-30
 * @export
 * @param {ParameterizedContext} ctx
 */
export async function getWallpaper(ctx: ParameterizedContext) {
  try {
    const wallpaperCache = await redis.get('wallpaper')
    if (wallpaperCache) {
      ctx.body = JSON.parse(wallpaperCache)
      return
    }
    const unsplashClientId = config.unsplashClientId
    const wallpaperAPI = unsplashClientId
      ? 'https://api.unsplash.com/photos/random?orientation=landscape&count=1&client_id=' + unsplashClientId
      : 'https://cn.bing.com/HPImageArchive.aspx?format=js&n=1'
    const imgData = await axios.get(wallpaperAPI)
    const res = unsplashClientId
      ? ctx.resp.success({ data: { data: imgData.data, type: 'unsplash' } })
      : ctx.resp.success({ data: { data: imgData.data.images, type: 'bing' } })
    await redis.set('wallpaper', JSON.stringify(res))
    ctx.status = 200
    ctx.body = res
  } catch (error) {
    ctx.body = ctx.resp.success({
      data: {
        type: 'bing',
        data: [
          {
            url: '/az/hprichbg/rb/SWFC_ZH-CN9558503653_1920x1080.jpg',
            copyrightlink:
              '/search?q=%e4%b8%8a%e6%b5%b7%e4%b8%96%e7%95%8c%e9%87%91%e8%9e%8d%e4%b8%ad%e5%bf%83&form=hpcapt&mkt=zh-cn'
          }
        ]
      }
    })
  }
}

/**
 * @description 文件上传通用接口
 * @author chenkaibo
 * @date 2019-12-07
 * @export
 * @param {ParameterizedContext} ctx { category:类别, type: 类型 }
 */
export async function upload(ctx: ParameterizedContext) {
  try {
    const category = ctx.query.category || 'image'
    const type = ctx.query.type || 'user'
    const fileDir = config.fileDirs[category][type]
    await koaBody({
      multipart: true,
      formidable: {
        uploadDir: fileDir,
        keepExtensions: true,
        onFileBegin: (name, file) => {
          const extname = path.extname(file.name)
          const newName = path.basename(file.name, extname) + new Date().getTime() + extname
          file.path = `${fileDir}/${newName}`
          file.name = newName
        }
      }
    })
    const name = ctx.request.body.files.file.name
    ctx.body = ctx.resp.success({
      data: {
        name: name,
        fullPath: `${fileDir}/${name}`,
        path: `/${category}/${type}/${name}`
      }
    })
  } catch (error) {
    ctx.body = ctx.resp.fail()
  }
}
