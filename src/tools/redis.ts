import * as Redis from 'ioredis'
import config from '../config'
const client: any = new Redis(config.redis)

export default client
