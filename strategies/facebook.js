import passport from 'passport'
import { Strategy } from 'passport-facebook'
import { facebook as configuration } from '../config/auth'
import finder from './finder'

passport.use(new Strategy(configuration, finder.bind(null, 'facebook')))
