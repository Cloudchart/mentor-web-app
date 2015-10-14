import fs from 'fs'
import path from 'path'
import passport from 'passport'

import './facebook'
import './twitter'

import { User } from '../models'

passport.serializeUser((user, done) => done(null, user.id))
passport.deserializeUser((id, done) => User.findById(id).then(user => done(null, user)))
