/**
 * @ Author: chenkaibo
 * @ Create Time: 2019-11-19 11:09:51
 * @ Modified by: chenkaibo
 * @ Modified time: 2019-11-19 11:58:09
 * @ Description: 发布服务
 */
import { subscribe } from 'postal'
import redis from '../tools/redis'

// 发布删除mock数据
subscribe({
  channel: 'mock',
  topic: 'del.mockData',
  callback: async function(key) {
    await redis.del(key)
  }
})

// 发布删除api列表
subscribe({
  channel: 'mock',
  topic: 'del.list',
  callback: async function(key) {
    await redis.del(key)
  }
})
