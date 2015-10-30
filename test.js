import UserThemeStorage from './storage/UserThemeStorage'


UserThemeStorage
  .loadAll('all', { userID: '62906a29-719e-46f6-8bdd-1836a3811e12' })
  .then(console.log)
