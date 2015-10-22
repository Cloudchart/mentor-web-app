import NodeResque from 'node-resque'
import redis from './redis'
import jobs from './jobs'

const Worker = new NodeResque.multiWorker({
  name: 'mentor:' + process.pid,
  connection: {
    redis: redis()
  },
  queues: ['mentor'],
  minTaskProcessors: 1,
  maxTaskProcessors: 100
}, jobs)


Worker.on('start', (id) => {
  console.log(`Worker "${Worker.name}#${id}": started.`)
})

Worker.on('end', (id) => {
  console.log(`Worker "${Worker.name}#${id}": ended.`)
})

export default Worker
