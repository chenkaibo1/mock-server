import * as Redis from 'ioredis'
import config from '../config'
const client = new Redis(config.redis)

export default client
