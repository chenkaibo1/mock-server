/**
 * @ Author: chenkaibo
 * @ Create Time: 2019-11-05 16:22:18
 * @ Modified by: chenkaibo
 * @ Modified time: 2019-11-13 17:51:27
 * @ Description: mock数据模型
 */

'use strict'

import * as mongoose from 'mongoose'
const Schema = mongoose.Schema
const ObjectId = mongoose.Types.ObjectId

const schema = new Schema({
  project: {
    type: ObjectId,
    ref: 'Project'
  },
  description: String,
  mode: String,
  url: String,
  method: String,
  parameters: String,
  response_model: String,
  create_at: {
    type: Date,
    default: Date.now
  }
})

schema.index({ project: 1, create_at: -1 })

export default mongoose.model('Mock', schema)
