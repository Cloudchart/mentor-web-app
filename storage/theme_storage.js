import models from '../models'


let prepareUserTheme = (theme) => {
  let status = theme.Users && theme.Users[0] ? theme.Users[0].UserTheme.status : {}
  return Object.assign(theme.get({ plain: true }), {
    status:         status,
    is_visible:     status === 'visible',
    is_subscribed:  status === 'subscribed',
    is_rejected:    status === 'rejected',
    Users:          undefined
  })
}

export default {

  findOneForUser: async (userId, themeId) => {
    let userTheme = await models.Theme.findById(themeId, {
      include: [{
        model:      models.User,
        where:      { id: userId },
        required:   false
      }]
    })

    return prepareUserTheme(userTheme)
  },

  findAllForUser: async (userId) => {
    let defaultThemes   = await models.Theme.findAll({
      where: { is_default: true }
    })

    let userThemes      = await models.Theme.findAll({
      include: [{
        model: models.User,
        where: { id: userId }
      }]
    }).then(themes => themes.map(prepareUserTheme))

    let themesIds = userThemes.map(theme => theme.id)

    let filteredDefaultThemes = defaultThemes.filter(theme => themesIds.indexOf(theme.id) == -1)

    return userThemes
      .filter(theme => !theme.is_rejected)
      .concat(filteredDefaultThemes)
      .sort((a, b) => a.name == b.name ? 0 : a.name > b.name ? 1 : -1)
  }

}
