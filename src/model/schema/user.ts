import * as mongoose from 'mongoose'
const Schema = mongoose.Schema

const User = new Schema({
  nickName: String,
  headImg: String,
  username: String,
  password: String,
  create_at: {
    type: Date,
    default: Date.now()
  }
})

export default mongoose.model('User', User)
