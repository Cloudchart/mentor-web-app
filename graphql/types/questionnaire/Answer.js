import {
  GraphQLInt,
  GraphQLNonNull,
  GraphQLString,
  GraphQLObjectType,
} from 'graphql'

import {
  globalIdField,
} from 'graphql-relay'


export default new GraphQLObjectType({

  name: 'QuestionnaireAnswer',

  fields: () => ({

    id: globalIdField('QuestionnaireAnswer'),

    position: {
      type: new GraphQLNonNull(GraphQLInt),
    },

    content: {
      type: new GraphQLNonNull(GraphQLString),
    },

    outro: {
      type: GraphQLString,
    },

  })

})
