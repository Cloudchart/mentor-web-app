import passport from 'passport'
import { Router } from 'express'
import { DevicePushTokenStorage } from '../storage'

let router = Router()

router.get('/', (req, res, next) => {
  if (!req.user) return res.redirect('/login')
  res.render('index', { title: 'Express', user: req.user })
})

router.get('/favorites', (req, res, next) => {
  if (!req.user) return res.redirect('/login')
  if (!req.user.is_active) return res.redirect('/')
  res.render('favorites', { title: 'Favorites' })
})

router.get('/login', (req, res, next) => {
  res.render('login')
})

router.get('/logout', (req, res, next) => {
  req.logout()
  res.redirect('/')
})

router.post('/device_tokens', async (req, res, next) => {
  let value = req.body.value
  if (!value) { res.status(400).json('bad request') }

  let devicePushToken = await DevicePushTokenStorage.loadOne('byValue', { value: value })

  if (devicePushToken) {
    res.json('ok')
  } else {
    DevicePushTokenStorage.create({ value: value, user_id: req.user.id }).then((devicePushToken) => {
      res.status(201).json('ok')
    }).catch((error) => {
      res.status(412).json({ error: error.message })
    })
  }
})

export default router
