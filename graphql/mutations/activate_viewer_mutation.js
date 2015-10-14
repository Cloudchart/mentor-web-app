import { mutationWithClientMutationId } from 'graphql-relay'

import { User } from '../../models'
import { UserType } from '../types'

export default mutationWithClientMutationId({

  name: 'ActivateViewer',

  inputFields: {

  },

  outputFields: {
    viewer: {
      type: UserType
    }
  },

  mutateAndGetPayload: (_, { rootValue: { viewer } }) => {
    return viewer.update({ is_active: true }).then(() => ({
      viewer: viewer
    }))
  }

})
