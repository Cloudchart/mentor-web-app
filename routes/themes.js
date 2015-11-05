import { Router } from 'express'

import {
  toGlobalId
} from 'graphql-relay'

import ThemeStorage from '../storage/ThemeStorage'
import UserThemeStorage from '../storage/UserThemeStorage'

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
  try {
    // Load Theme
    let theme     = await ThemeStorage.load(req.params.id)

    // Load User Theme
    let userTheme = await UserThemeStorage.loadOne('unique', { themeID: theme.id, userID: req.user.id })

    // Render Page
    res.render('themes/show', { title: `#${theme.name}`, themeID: toGlobalId('Theme', theme.id) })
  } catch(e) {
    // Return Not Found Error
    res.status(404)
  }
})

router.get('/new', (req, res, next) => {
  res.render('themes/new', { title: 'Find' })
})

export default router
