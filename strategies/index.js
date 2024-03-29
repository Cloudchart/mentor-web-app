import fs from 'fs'
import path from 'path'
import passport from 'passport'

import './facebook'
import './twitter'

import UserStorage from '../storage/UserStorage'

passport.serializeUser((user, done) => done(null, user.id))

passport.deserializeUser((id, done) => {
  UserStorage
    .load(id)
    .then(user => done(null, user))
    .catch(error => done(null, null))
})
