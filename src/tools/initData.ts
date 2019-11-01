import config from '../config'
import { User } from '../model'
import * as md5 from 'md5'
async function initUser() {
  try {
    const user = await User.findOne({ username: config.admin.username })
    if (!user) {
      User.create({ username: config.admin.username, password: md5(md5(config.admin.password)) })
    }
  } catch (error) {
    console.log(error)
  }
}

export default () => {
  initUser()
}
