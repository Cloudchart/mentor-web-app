import Schedule from 'node-schedule'
import NodeResque from 'node-resque'

import Scheduler from './scheduler'
import Worker from './worker'
import Queue from './queue'

import enqueue from './enqueue'
import jobs from './jobs'


let start = () => {
  Scheduler.connect(() => {
    Scheduler.start()
    Worker.start()

    Object.keys(jobs).forEach(name => {
      let job = jobs[name]
      if (job.schedule) {
        Schedule.scheduleJob(job.schedule, () => {
          enqueue(name, job.payload || {})
        })
      }
      if (job.immediate == true) {
        enqueue(name, job.payload || {})
      }
    })
  })
}


let stop = () => {
  console.log()
  console.log('Shutting down scheduler...')
  Scheduler.end(() => {
    console.log('Shutting down worker...')
    Worker.end(() => {
      process.exit(0)
    })
  })
}


process.on('SIGINT',  stop)
process.on('SIGTERM', stop)

export default {
  start:    start,
  enqueue:  enqueue
}
