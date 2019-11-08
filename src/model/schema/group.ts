/**
 * @ Author: chenkaibo
 * @ Create Time: 2019-11-04 17:55:00
 * @ Modified by: chenkaibo
 * @ Modified time: 2019-11-08 15:18:19
 * @ Description:组模型
 */

'use strict'
import * as mongoose from 'mongoose'
const Schema = mongoose.Schema
const ObjectId = mongoose.Types.ObjectId

const schema = new Schema({
  user: {
    type: ObjectId,
    ref: 'User'
  },
  name: {
    type: String,
    unique: true
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

schema.index({ user: 1, create_at: -1 })
schema.index({ name: 1 }, { unique: true })

export default mongoose.model('Group', schema)
