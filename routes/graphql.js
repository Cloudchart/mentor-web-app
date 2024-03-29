import {
  Router
} from 'express'

import {
  UserStorage,
  DeviceStorage,
  RoleStorage,
  SlackChannelStorage,
  TelegramUserStorage,
  MessengerUserStorage,
} from '../storage'

import path from 'path'

import cors from 'cors'
import graphqlHTTP from 'express-graphql'
import GraphQLSchema from '../graphql/schema'

let router = Router()

let checkCorsOrigins = (origin, callback) => {
  callback(null, process.env.CORS_ALLOW_ORIGINS.split(',').includes(origin))
}

let telegramAuthorizer = async (req, res, next) => {
  let telegramUserId = req.get('X-Telegram-User-Id')
  if (req.user || !telegramUserId) next()

  let telegramUser = await TelegramUserStorage.load(telegramUserId).catch(error => null)

  if (telegramUser)
    req.user = await UserStorage.load(telegramUser.user_id)

  next()
}

let messengerAuthorizer = async (req, res, next) => {
  let messengerUserId = req.get('X-Messenger-User-Id')
  if (req.user || !messengerUserId) next()

  let messengerUser = await MessengerUserStorage.load(messengerUserId).catch(error => null)

  if (messengerUser)
    req.user = await UserStorage.load(messengerUser.user_id)

  next()
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
  telegramAuthorizer,
  messengerAuthorizer,
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
