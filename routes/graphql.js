import {
  Router
} from 'express'

import {
  UserStorage,
  DeviceStorage,
  RoleStorage,
  SlackChannelStorage,
} from '../storage'

import path from 'path'
import bunyan from 'bunyan'

import cors from 'cors'
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

let checkCorsOrigins = (origin, callback) => {
  callback(null, process.env.CORS_ALLOW_ORIGINS.split(',').includes(origin))
}

let channelAuthorizer = async (req, res, next) => {
  let channelID = req.get('X-Slack-Channel-Id')
  if (req.user || !channelID) return next()

  SlackChannelStorage.load(channelID)
  .then(async channel => {
    let user = await UserStorage.load(channel.user_id)
    req.user = user
    next()
  })
  .catch(async error => {
    let user = await UserStorage.create()
    let channel = await SlackChannelStorage.create({ id: channelID, user_id: user.id })
    req.user = user
    next()
  })
}

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

let rolesInjector = async (req, res, next) => {
  if (req.user) {
    req.user.isAdmin = await RoleStorage
      .loadAll('adminByUser', { user_id: req.user.id })
      .then(r => r.length > 0)
      .catch(() => false)
  }
  next()
}

router.use('/',
  deviceAuthorizer,
  deviceLogger,
  channelAuthorizer,
  rolesInjector,
  cors({ origin: checkCorsOrigins, credentials: true },
), graphqlHTTP(req => ({
  schema: GraphQLSchema,
  context: {
    viewer: req.user,
    rootValue: {
      viewer: req.user
    }
  },
  rootValue: {
    viewer: req.user
  },
  graphiql: true
})))


export default router
