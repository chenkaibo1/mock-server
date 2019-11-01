const config = {
  version: 'v2.1.0',
  serve: {
    port: 20000
  },
  keys: [ 'some secret hurr' ],
  secret: 'easy-mock',
  session: {
    key: 'easy-mock:sess'
  },
  whitelist: [ '/api/user/login', '/api/user/register', '/api/util/wallpaper' ],
  mongodb: {
    url: 'mongodb://localhost/easy-mock'
  },
  admin: {
    username: 'admin',
    password: '123456'
  },
  redis: {
    host: 'localhost',
    password: '5566123'
  },
  unsplashClientId: '' // 登录页的背景图服务目前支持 默认由bing提供 (https://unsplash.com/developers) 与 [Bing](http://bing.com)
}

export default config
