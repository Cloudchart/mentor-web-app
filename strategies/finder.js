import { User, AuthToken } from '../models'

export default (providerName, accessToken, _, profile, done) => {
  AuthToken.find({ where: { provider_name: providerName, provider_id: profile.id } }).then(token => {

    if (token) return token.getUser().then(user => done(null, user))

    User.create({ name: profile.displayName }).then(user => {
      AuthToken.create({
        provider_name:  providerName,
        provider_id:    profile.id,
        user_id:        user.id
      }).then(token => done(null, user))
    })

  })
}
