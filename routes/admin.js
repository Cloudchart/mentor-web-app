import passport from 'passport'
import { Router } from 'express'

let router = Router()

router.get('/', (req, res, next) => {
  if (!req.user) return res.redirect('/')

  res.render('admin/index', { title: 'Admin', user: req.user })
})

export default router
