import ThemeStorage from './storage/NewThemeStorage'

ThemeStorage.loadAvailableThemesForUser('62906a29-719e-46f6-8bdd-1836a3811e12')
  .then(console.log)
  .catch(console.error)
