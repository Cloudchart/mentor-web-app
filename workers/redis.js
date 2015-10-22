import Redis from 'ioredis'

const Client = new Redis({ keyPrefix: 'mentor-web-app-development:' })

export default () => Client.duplicate()
