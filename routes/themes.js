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


router.get('/today', function(req, res, next) {
  if (!req.user) return res.redirect('/login')
  if (!req.user.is_active) return res.redirect('/')
  res.render('themes/today', { title: 'Today for you' })
})


router.get('/:id', authenticationCheck, activityCheck, async (req, res, next) => {
  try {
    // Load Theme
    let theme     = await ThemeStorage.load(req.params.id)

    // Load User Theme
    let userTheme = await UserThemeStorage.loadOne('unique', { themeID: theme.id, userID: req.user.id })

    // Render Page
    res.render('themes/show', { title: `#${theme.name}`, themeID: toGlobalId('UserTheme', userTheme.id) })
  } catch(e) {
    // Return Not Found Error
    res.status(404)
    next()
  }
})

router.get('/new', (req, res, next) => {
  res.render('themes/new', { title: 'Find' })
})

export default router
