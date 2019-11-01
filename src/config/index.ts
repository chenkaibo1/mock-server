// local or development or production
const env = process.env.NODE_ENV || 'development'
import devConfig from './config.dev'
import prodConfig from './config.prod'
export default (env === 'development' ? devConfig : prodConfig)
