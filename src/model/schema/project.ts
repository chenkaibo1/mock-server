/**
 * @ Author: chenkaibo
 * @ Create Time: 2019-11-04 17:51:51
 * @ Modified by: chenkaibo
 * @ Modified time: 2019-11-04 17:53:39
 * @ Description: 项目模型
 */

'use strict'
import * as mongoose from 'mongoose'
const Schema = mongoose.Schema
const ObjectId = mongoose.Types.ObjectId

const ProjectSchema = new Schema({
  user: {
    type: ObjectId,
    ref: 'User'
  },
  group: {
    type: ObjectId,
    ref: 'Group'
  },
  name: String,
  url: String,
  description: {
    type: String,
    default: ''
  },
  swagger_url: {
    type: String,
    default: ''
  },
  members: [
    {
      type: ObjectId,
      ref: 'User',
      default: []
    }
  ],
  create_at: {
    type: Date,
    default: Date.now
  }
})

ProjectSchema.index({ user: 1, members: 1, create_at: -1 })

export default mongoose.model('Project', ProjectSchema)
