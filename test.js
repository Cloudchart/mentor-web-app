import {
  UpdateUserInsightsQueue
} from './Tasks'

(async () => {

  await UpdateUserInsightsQueue.perform({ user_id: '522ba9ae-873e-4702-8bd1-254b0056a139' })

  process.exit()

})()
