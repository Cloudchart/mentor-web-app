import {
  TopicStorage,
  InsightStorage,
  UserTopicInsightStorage,
  SlackChannelStorage,
  ThemeInsightStorage,
} from '../storage'


const Data = {
  user: {
    InitialQueueSize: 10,
    MaxQueueSize:     16,
    QueueFillRate:    2 / (1 * 60 * 60 * 1000)
  },
  slackChannel: {
    InitialQueueSize: 1,
    MaxQueueSize:     1,
    QueueFillRate:    1 / (2 * 60 * 60 * 1000)
  }
}


let addInsight = async ({ user_id, topic_ids }) => {
  let topic_id = topic_ids[Math.round(Math.random() * (topic_ids.length - 1))]
  let record = await ThemeInsightStorage.loadAllIDs('newForUserTheme', { userID: user_id, themeID: topic_id, limit: 1 })
  if (!record) return
  await UserTopicInsightStorage.create({ user_id, theme_id: topic_id, insight_id: record[0] })
}


let perform = async ({ user_id }) => {

  let slackChannel = await SlackChannelStorage.loadOne('forUser', { user_id }).catch(() => null)
  let subscribedTopicsIDs = await TopicStorage.loadAllIDs('subscribed', { userID: user_id })

  let unratedInsights = await UserTopicInsightStorage.loadAll('unratedForUser', { user_id })
  let unratedInsightsCount = unratedInsights.length
  let lastUnratedInsight = unratedInsights[unratedInsightsCount - 1]

  let lastRatedInsight = await UserTopicInsightStorage.loadOne('lastRatedForUser', { user_id })

  let {
    InitialQueueSize,
    MaxQueueSize,
    QueueFillRate
  } = Data[slackChannel ? 'slackChannel' : 'user']

  let count = lastRatedInsight || lastUnratedInsight
    ? MaxQueueSize - Math.min(MaxQueueSize, unratedInsightsCount)
    : InitialQueueSize


  let lastActivityDate = Date.now() - Math.max(
    lastRatedInsight ? lastRatedInsight.updated_at : 0,
    lastUnratedInsight ? lastUnratedInsight.created_at : 0
  )

  count = Math.min(
    count,
    Math.floor(lastActivityDate * QueueFillRate)
  )

  while (count > 0) {
    await addInsight({ user_id, topic_ids: subscribedTopicsIDs })
    count--
  }

}


export default {
  perform
}
