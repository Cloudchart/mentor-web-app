import {
  fromGlobalId,
  nodeDefinitions
} from 'graphql-relay'


import Storages from '../../storage'


export default nodeDefinitions(

  (globalId) => {
    let { type, id } = fromGlobalId(globalId)

    let Storage = Storages[type + 'Storage']
    if (!Storage)
      return new Error(`${type} storage not found.`)

    return Storage.load(id)
  },

)
