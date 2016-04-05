import {
  GraphQLID,
  GraphQLList,
  GraphQLString,
  GraphQLNonNull,
  GraphQLBoolean,
} from 'graphql'

import {
  fromGlobalId,
  mutationWithClientMutationId,
} from 'graphql-relay'

import {
  TopicLinkStorage,
  TopicLinkInsightStorage,
  BotReactionStorage,
} from '../../../storage'

import TopicLinkType from '../../types/TopicLinkType'

export default mutationWithClientMutationId({

  name: 'UpdateTopicLink',

  inputFields: {
    linkID: {
      type: new GraphQLNonNull(GraphQLID)
    },
    linkURL: {
      type: new GraphQLNonNull(GraphQLString)
    },
    linkTitle: {
      type: new GraphQLNonNull(GraphQLString)
    },
    linkInsightsIDs: {
      type: new GraphQLNonNull(new GraphQLList(GraphQLID))
    },
    reactionContent: {
      type: new GraphQLNonNull(GraphQLString)
    }
  },

  outputFields: {
    link: {
      type: new GraphQLNonNull(TopicLinkType),
    },

    linkID: {
      type: new GraphQLNonNull(GraphQLID)
    }

  },

  mutateAndGetPayload: async ({ linkID, linkURL, linkTitle, linkInsightsIDs, reactionContent }, { rootValue: { viewer } }) => {
    if (!viewer.isAdmin)
      return new Error('Not authorized.')

    // Load Topic Link
    let link = await TopicLinkStorage.load(fromGlobalId(linkID).id).catch(() => null)
    if (!link) return new Error('Topic Link not found.')

    // Update Topic Link
    link = await TopicLinkStorage.update(link.id, { url: linkURL, title: linkTitle })

    // Update Topic Link Insights relations
    let relations = await TopicLinkInsightStorage.loadAll('forTopicLink', { topic_link_id: link.id })
    let insightsIDs = relations.map(r => r.insight_id)
    let nextInsightsIDs = linkInsightsIDs.map(id => fromGlobalId(id).id)
    let relationsIDsToDestroy = relations.filter(r => nextInsightsIDs.indexOf(r.insight_id) == -1).map(r => r.id)
    let insightsIDsToAdd = nextInsightsIDs.filter(id => insightsIDs.indexOf(id) == -1)

    await relationsIDsToDestroy.forEach(id => TopicLinkInsightStorage.destroy(id))
    await TopicLinkInsightStorage.createMany(insightsIDsToAdd.map(id => ({ topic_link_id: link.id, insight_id: id })))

    // Update Topic Link Bot Reaction
    let reaction = await BotReactionStorage.loadOne('forOwner', { owner_id: link.id, owner_type: 'TopicLink' })
    await BotReactionStorage.update(reaction.id, { content: reactionContent })

    return { link, linkID }
  }

})
