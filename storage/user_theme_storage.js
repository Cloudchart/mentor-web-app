import DataLoader from 'dataloader'
import models from '../models'

let loaders = {}


let reducer = (key) =>
  (memo, record) => {
    memo[record[key]] = record.get({ plain: true })
    return memo
  }


let reducers = {
  theme:  reducer('theme_id'),
  user:   reducer('user_id'),
  id:     reducer('id')
}

let finderForUser = (userID, ids) => {
  return models.UserTheme.findAll({
    where: {
      user_id: userID,
      theme_id: { $in: ids }
    }
  }).then(records => {
    records = records.reduce(reducers.theme, {})
    return ids.map(id => records[id])
  })
}

let finderForTheme = (themeID, ids) => {
  return models.UserTheme.findAll({
    where: {
      theme_id: themeID,
      user_id:  { $in: ids }
    }
  }).then(records => {
    records = records.reduce(reducers.user, {})
    return ids.map(id => records[id])
  })
}


let userLoader = (userID) => {
  return loaders[userID] || (loaders[userID] = new DataLoader(finderForUser.bind(null, userID), { cache: false }))
}

let themeLoader = (themeID) => {
  return loaders[themeID] || (loaders[themeID] = new DataLoader(finderForTheme.bind(null, themeID), { cache: false }))
}


export default {
  load: function(userID, themeID) {
    return userLoader(userID).load(themeID)
  },

  loadManyForUser: function(userID, themeIDs) {
    return userLoader(userID).loadMany(themeIDs)
  },

  loadManyForTheme: function(themeID, userIDs) {
    return themeLoader(themeID).loadMany(userIDs)
  },

  themeIDsForUser: function(userID) {
    return models.UserTheme
      .findAll({
        attributes: ['theme_id'],
        where: { user_id: userID }
      }).then(records => records.map(record => record.theme_id))
  },

  subscribedThemeIDsForUser: function(userID) {
    return models.UserTheme
      .findAll({
        attributes: ['theme_id'],
        where: {
          user_id:  userID,
          status:   'subscribed'
        }
      }).then(records => records.map(record => record.theme_id))
  },

  create: (userID, themeID, attributes = {}) => {
    return models.UserTheme.create(Object.assign(attributes, { user_id: userID, theme_id: themeID }))
  },

  update: (userID, themeID, attributes = {}) => {
    return models.UserTheme.update(attributes, { where: { user_id: userID, theme_id: themeID } })
  }
}

import ThemesStorage from './themes_storage'
