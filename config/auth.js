export default {
  "facebook": {
    "clientID":       process.env.FACEBOOK_CLIENT_ID,
    "clientSecret":   process.env.FACEBOOK_CLIENT_SECRET,
    "callbackURL":    `${process.env.HOST}/auth/facebook/callback`,
    "enableProof":    true
  },
  "twitter": {
    "consumerKey":    process.env.TWITTER_CLIENT_ID,
    "consumerSecret": process.env.TWITTER_CLIENT_SECRET,
    "callbackURL":    `${process.env.HOST}/auth/twitter/callback`
  }
}
