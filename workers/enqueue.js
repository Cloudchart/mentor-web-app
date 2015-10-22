import Queue from './queue'
import jobs from './jobs'

export default (name, payload) => {
  let job = jobs[name]
  Queue.connect(() => {
    Queue.enqueue("mentor", name, [payload], () => {
      console.log(`>> Enqueued job "${job.name || name}"`)
    })
  })
}
