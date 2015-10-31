import {
  fromGlobalId,
  nodeDefinitions
} from 'graphql-relay'


import {
  UserStorage,
  ThemeStorage,
  InsightStorage,
  UserThemeStorage,
  UserThemeInsightStorage
} from '../../storage'


export default nodeDefinitions(

  (globalId) => {
    let { type, id } = fromGlobalId(globalId)
    switch(type) {
      case 'User':
        return UserStorage.load(id)
      case 'Theme':
        return ThemeStorage.load(id)
      case 'Insight':
        return InsightStorage.load(id)
      case 'UserTheme':
        return UserThemeStorage.load(id)
      case 'UserThemeInsight':
        return UserThemeInsightStorage.load(id)
    }
  },

  (object) => {
    switch(object.__type) {
      case 'User':
        return require('./UserType')
      case 'Theme':
        return require('./ThemeType')
      case 'Insight':
        return require('./InsightType')
      case 'UserTheme':
        return require('./UserThemeType')
      case 'UserThemeInsight':
        return require('./UserThemeInsightType')
    }
  }

)
