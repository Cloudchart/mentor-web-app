import passport from 'passport'
import { Router } from 'express'
import { DevicePushToken } from '../models'

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

router.post('/device_tokens', (req, res, next) => {
  let value = req.body.value

  DevicePushToken.findOrCreate({
    where: { value: value }, defaults: { user_id: req.user.id }
  }).spread((devicePushToken, created) => {
    res.json('ok')
  }).catch((error) => {
    res.status(500).json({ error: error })
  })
})

export default router
