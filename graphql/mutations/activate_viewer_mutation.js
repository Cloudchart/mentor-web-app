import { GraphQLNonNull } from 'graphql'
import { mutationWithClientMutationId } from 'graphql-relay'
import { UserType } from '../types'
import { UserStorage } from '../../storage'

export default mutationWithClientMutationId({

  name: 'ActivateViewer',

  outputFields: {
    viewer: {
      type: new GraphQLNonNull(UserType)
    }
  },

  mutateAndGetPayload: async (_, { rootValue: { viewer } }) => {
    await UserStorage.update(viewer.id, { is_active: true })
    viewer = UserStorage.load(viewer.id)
    return { viewer }
  }

})
