import config from '../config'
import { User } from '../model'
import * as md5 from 'md5'
async function initUser() {
  try {
    const user = await User.findOne({ username: config.admin.username })
    if (!user) {
      User.create({
        username: config.admin.username,
        password: md5(md5(config.admin.password)),
        headImg: '//img.souche.com/20161230/png/fd9f8aecab317e177655049a49b64d02.png'
      })
    }
  } catch (error) {
    console.log(error)
  }
}

export default () => {
  initUser()
}
