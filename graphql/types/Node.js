import {
  fromGlobalId,
  nodeDefinitions
} from 'graphql-relay'


import UserStorage from '../../storage/UserStorage'
import ThemeStorage from '../../storage/ThemeStorage'
import UserThemeStorage from '../../storage/UserThemeStorage'


export default nodeDefinitions(

  (globalId) => {
    let { type, id } = fromGlobalId(globalId)
    switch(type) {
      case 'User':
        return UserStorage.load(id)
      case 'Theme':
        return ThemeStorage.load(id)
      case 'UserTheme':
        return UserThemeStorage.load(id)
    }
  },

  (object) => {
    switch(object.__type) {
      case 'User':
        return require('./UserType')
      case 'Theme':
        return require('./ThemeType')
      case 'UserTheme':
        return require('./UserThemeType')
    }
  }

)
