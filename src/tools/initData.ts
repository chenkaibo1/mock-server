import config from '../config'
import { User, Project, Mock } from '../model'
import mock from './mock'
import * as md5 from 'md5'
async function initUser() {
  try {
    const user = await User.findOne({ username: config.admin.username })
    if (!user) {
      const newUser = await User.create({
        username: config.admin.username,
        password: md5(md5(config.admin.password)),
        headImg: '//img.souche.com/20161230/png/fd9f8aecab317e177655049a49b64d02.png'
      })
      // 创建演示项目
      const newProject = await Project.create({
        user: newUser.id,
        name: '演示项目',
        url: '/example',
        description: '已创建多种 Mock 类型，只需点击预览便可查看效果。亦可编辑，也可删除。'
      })
      await Mock.create(
        mock.examples.map((item) => ({
          project: newProject.id,
          description: item.desc,
          method: item.method,
          url: item.url,
          mode: item.mode
        }))
      )
    }
  } catch (error) {
    console.log(error)
  }
}

export default () => {
  initUser()
}
