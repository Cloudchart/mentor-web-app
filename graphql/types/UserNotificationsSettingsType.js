import {
  GraphQLInt,
  GraphQLString,
  GraphQLNonNull,
  GraphQLObjectType,
} from 'graphql'

export default new GraphQLObjectType({

  name: 'UserNotificationsSettings',

  fields: () => ({

    startAt: {
      type: new GraphQLNonNull(GraphQLString),
      resolve: ({ start_at }) => start_at
    },

    finishAt: {
      type: new GraphQLNonNull(GraphQLString),
      resolve: ({ finish_at }) => finish_at
    },

    utcOffset: {
      type: new GraphQLNonNull(GraphQLInt),
      resolve: ({ utc_offset }) => utc_offset
    },

    timesToSend: {
      type: new GraphQLNonNull(GraphQLInt),
      resolve: ({ times_to_send }) => times_to_send
    }

  })

})
