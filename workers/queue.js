import NodeResque from 'node-resque'
import redis from './redis'
import jobs from './jobs'

const Queue = new NodeResque.queue({
  connection: {
    redis: redis()
  }
}, jobs)

export default Queue
