import {
  Router
} from 'express'

import {
  UserStorage,
  DeviceStorage,
  RoleStorage,
} from '../storage'

import path from 'path'
import bunyan from 'bunyan'

import graphqlHTTP from 'express-graphql'
import GraphQLSchema from '../graphql/schema'

let logger = bunyan.createLogger({
  name: 'graphql',
  streams: [
    {
      path: path.join(__dirname, '../logs/graphql.log')
    }
  ]
})

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
      req.user = user
      next()
    })
}

let deviceLogger = async (req, res, next) => {
  let deviceID = req.get('X-Device-Id')
  if (!deviceID) return next()
  logger.info({ deviceID, query: req.body.query, variables: req.body.variables })
  next()
}

router.use('/', deviceAuthorizer, deviceLogger, graphqlHTTP(req => ({
  schema: GraphQLSchema,
  rootValue: {
    viewer: req.user
  },
  graphiql: true
})))


export default router
