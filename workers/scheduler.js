import NodeResque from 'node-resque'
import redis from './redis'


const Scheduler = new NodeResque.scheduler({
  connection: {
    redis: redis()
  }
})

Scheduler.on('start', () => {
  console.log("Scheduler started")
})

Scheduler.on('end', () => {
  console.log("Scheduler ended")
})

export default Scheduler
