import { Router } from 'express'
import {
  ThemesStorage,
  UserThemeStorage
} from '../storage'

import {
  authenticationCheck,
  activityCheck
} from './checkers'

import ActualizeUserThemeInsights from '../workers/jobs/ActualizeUserThemeInsights'

let router = Router()


router.get('/', authenticationCheck, activityCheck, (req, res, next) => {
  res.render('themes/index', { title: 'Explore' })
})


router.get('/explore', authenticationCheck, activityCheck, (req, res, next) => {
  res.render('themes/explore', { title: 'Explore themes' })
})


router.get('/:id', authenticationCheck, activityCheck, async (req, res, next) => {
  UserThemeStorage.load(req.user.id, req.params.id).then(async (userTheme) => {

    await ActualizeUserThemeInsights.performAsync({
      userID:   req.user.id,
      themeID:  req.params.id
    })

    ThemesStorage.load(userTheme.theme_id).then((theme) => {
      res.render('themes/show', { title: `#${theme.name}`, themeID: theme.id })
    })
  }).catch(error => {
    res.status(404)
    next()
  })
})

router.get('/new', (req, res, next) => {
  res.render('themes/new', { title: 'Find' })
})

export default router
