import UserStorage from '../storage/UserStorage'
import AuthTokenStorage from '../storage/AuthTokenStorage'

export default async (providerName, accessToken, _, profile, done) => {
    let authToken = await AuthTokenStorage
      .forProvider(providerName)
      .load(profile.id)
      .catch(error => null)

    if (!authToken) {
      let user  = await UserStorage.create({ name: profile.displayName })
      authToken = await AuthTokenStorage
        .create({ provider_name: providerName, provider_id: profile.id, user_id: user.id })
    }

    UserStorage
      .load(authToken.user_id)
      .then(user => done(null, user))
}
