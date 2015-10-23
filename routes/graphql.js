import {
  Router
} from 'express'

import {
  UserStorage,
  DeviceStorage
} from '../storage'


import graphqlHTTP from 'express-graphql'
import GraphQLSchema from '../graphql/schema'


let router = Router()

let deviceAuthorizer = async (req, res, next) => {
  let deviceID = req.get('X-Device-Id')
  if (req.user || !deviceID) return next()
  DeviceStorage.load(deviceID)
    .then(async device => {
      let user = await UserStorage.load(device.user_id)
      req.user = user
      next()
    })
    .catch(async error => {
      let user    = await UserStorage.create()
      let device  = await DeviceStorage.create({ id: deviceID, user_id: user.id })
      next()
    })
}

router.use('/', deviceAuthorizer, graphqlHTTP(req => ({
  schema: GraphQLSchema,
  rootValue: {
    viewer: req.user
  },
  graphiql: true
})))


export default router
