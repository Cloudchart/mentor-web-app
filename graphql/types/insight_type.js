import {
  GraphQLObjectType,
  GraphQLID,
  GraphQLString,
  GraphQLBoolean
} from 'graphql'

let InsightType = new GraphQLObjectType({

  name: 'Insight',

  fields: () => ({

    id: {
      type: GraphQLID
    },
    content: {
      type: GraphQLString
    }

  })

})

export default InsightType
