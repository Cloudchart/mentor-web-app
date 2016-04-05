import {
  GraphQLID,
  GraphQLString,
  GraphQLNonNull,
  GraphQLBoolean,
} from 'graphql'

import {
  fromGlobalId,
  mutationWithClientMutationId,
} from 'graphql-relay'

import {
  nodeToEdge
} from '../../connections/arrayconnection'

import {
  TopicStorage,
  TopicLinkStorage,
  TopicLinkInsightStorage,
  BotReactionStorage,
} from '../../../storage'

import TopicType from '../../types/TopicType'
import TopicLinkType from '../../types/TopicLinkType'

import {
  EdgeType
} from '../../connections/TopicLinksConnection'


export default mutationWithClientMutationId({

  name: 'RemoveTopicLink',

  inputFields: {
    linkID: {
      type: new GraphQLNonNull(GraphQLID)
    },
  },

  outputFields: {
    link: {
      type: new GraphQLNonNull(TopicLinkType),
    },

    linkID: {
      type: new GraphQLNonNull(GraphQLID),
    },

    topic: {
      type: new GraphQLNonNull(TopicType),
      resolve: async ({ link }) => await TopicStorage.load(link.topic_id)
    }
  },

  mutateAndGetPayload: async ({ linkID }, { rootValue: { viewer } }) => {
    if (!viewer.isAdmin)
      return new Error('Not authorized.')

    let link = await TopicLinkStorage.load(fromGlobalId(linkID).id).catch(() => null)
    if (!link) return new Error('Topic Link not found.')

    // Destroy Topic Link Insights relations
    let relationsIDs = await TopicLinkInsightStorage.loadAllIDs('forTopicLink', { topic_link_id: link.id })
    relationsIDs.forEach(async id => await TopicLinkInsightStorage.destroy(id))

    // Destroy Topic Link Bot Reaction
    let reaction = await BotReactionStorage.loadOne('forOwner', { owner_id: link.id, owner_type: 'TopicLink' })
    await BotReactionStorage.destroy(reaction.id)

    // Destroy Topic Link
    await TopicLinkStorage.destroy(link.id)

    return { link, linkID }
  }

})
