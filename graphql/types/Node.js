import {
  fromGlobalId,
  nodeDefinitions
} from 'graphql-relay'


import {
  UserStorage,
  ThemeStorage,
  InsightStorage,
  UserThemeStorage,
  ThemeInsightStorage,
  UserThemeInsightStorage,
  RoleStorage,
  AdminStorage,
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
      case 'ThemeInsight':
        return ThemeInsightStorage.load(id)
      case 'UserThemeInsight':
        return UserThemeInsightStorage.load(id)
      case 'Role':
        return RoleStorage.load(id)
      case 'Admin':
        return AdminStorage.load(id)
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
      case 'ThemeInsight':
        return require('./ThemeInsightType')
      case 'UserThemeInsight':
        return require('./UserThemeInsightType')
      case 'Role':
        return require('./RoleType')
      case 'Admin':
        return require('./admin/AdminType')
    }
  }

)
