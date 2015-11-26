import {
  GraphQLList,
  GraphQLString,
  GraphQLObjectType,
} from 'graphql'


export default new GraphQLObjectType({

  name: 'UserQuestionnaire',

  fields: {

    questions: {
      type: new GraphQLList(GraphQLString),
      resolve: () => []
    }

  },

})
