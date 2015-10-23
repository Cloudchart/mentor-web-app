export default {

  authenticationCheck: (req, res, next) =>
    req.user ? next() : res.redirect('/login')

  ,

  activityCheck: (req, res, next) =>
    req.user.is_active ? next() : res.redirect('/')

}
