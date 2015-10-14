import passport from 'passport'
import { Strategy } from 'passport-twitter'
import { twitter as configuration } from '../config/auth.json'
import finder from './finder'

passport.use(new Strategy(configuration, finder.bind(null, 'twitter')))
