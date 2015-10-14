import passport from 'passport'
import { Strategy } from 'passport-twitter'
import { twitter as configuration } from '../config/auth'
import finder from './finder'

passport.use(new Strategy(configuration, finder.bind(null, 'twitter')))
