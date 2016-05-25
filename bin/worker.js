import kue from 'kue'
import path from 'path'
import tasks from '../Tasks'


const Queue = kue.createQueue({
  prefix: 'mentor-server-queue'
})


let createJob = (name, payload, force) => {
  let task = tasks[name]

  let job = Queue.create(name, payload || {}).removeOnComplete(true)

  if (task.delay && !force) job.delay(task.delay)

  job.on('complete', result => {
    [].concat(result).forEach(entry => {
      if (entry && entry.name && entry.payload)
        createJob(entry.name, entry.payload)
    })

    if (task.repeatable)
      createJob(name, payload)
  })

  job.save()

  return job
}


Object.keys(tasks).forEach(name => {
  let task = tasks[name]

  Queue.process(name, 10, (job, done) => {
    tasks[name]
      .perform(job.data)
      .then(result => done(null, result))
      .catch(error => done(error, null))
  })

  if (task.immediate)
    createJob(name, task.payload, true)
})


let shutdown = () => Queue.shutdown(5000, error => process.exit(0))
process.once('SIGTERM', shutdown)
process.once('SIGINT', shutdown)
