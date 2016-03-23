import {
  GraphQLID,
  GraphQLNonNull,
  GraphQLString,
} from 'graphql'

import {
  fromGlobalId,
  mutationWithClientMutationId
} from 'graphql-relay'

import {
  UserCollectionStorage
} from '../../storage'

import UserCollectionType from '../types/UserCollectionType'


export const AddCollectionToUserMutation = mutationWithClientMutationId({
  name: 'AddCollectionToUserMutation',

  inputFields: {
    name: {
      type: new GraphQLNonNull(GraphQLString)
    }
  },

  outputFields: {
    collection: {
      type: new GraphQLNonNull(UserCollectionType)
    },

    collectionID: {
      type: new GraphQLNonNull(GraphQLID),
      resolve: ({ collection }) => collection.id,
    },
  },

  mutateAndGetPayload: async({ name }, { rootValue: { viewer } }) => {
    let collection = await UserCollectionStorage.loadOne('userAndName', { userID: viewer.id, name }).catch(error => null)

    if (!collection)
      collection = await UserCollectionStorage.create({ user_id: viewer.id, name })

    return { collection }
  }
})


export const RemoveCollectionFromUserMutation = mutationWithClientMutationId({
  name: 'RemoveCollectionFromUserMutation',

  inputFields: {
    collectionID: {
      type: new GraphQLNonNull(GraphQLID)
    }
  },

  outputFields: {
    collection: {
      type: new GraphQLNonNull(UserCollectionType)
    },

    collectionID: {
      type: new GraphQLNonNull(GraphQLID),
      resolve: ({ collection }) => collection.id
    }
  },

  mutateAndGetPayload: async ({ collectionID }, { rootValue: { viewer } }) => {
    let collection = await UserCollectionStorage.load(fromGlobalId(collectionID).id).catch(error => null)

    if (!collection || collection.user_id !== viewer.id)
      return new Error("User collection not found.")

    await UserCollectionStorage.destroy(collection.id)

    return { collection }
  }
})
