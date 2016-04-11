import {
  fromGlobalId,
  nodeDefinitions
} from 'graphql-relay'


import {
  UserStorage,
  ThemeStorage,
  TopicStorage,
  TopicLinkStorage,
  InsightStorage,
  UserCollectionStorage,
  UserThemeStorage,
  ThemeInsightStorage,
  UserThemeInsightStorage,
  RoleStorage,
  AdminStorage,
  QuestionStorage,
  AnswerStorage,
} from '../../storage'


export default nodeDefinitions(

  (globalId) => {
    let { type, id } = fromGlobalId(globalId)
    switch(type) {
      case 'User':
        return UserStorage.load(id)
      case 'Theme':
        return ThemeStorage.load(id)
      case 'Topic':
        return TopicStorage.load(id)
      case 'TopicLink':
        return TopicLinkStorage.load(id)
      case 'Insight':
        return InsightStorage.load(id)
      case 'UserCollection':
        return UserCollectionStorage.load(id)
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
      case 'Question':
        return QuestionStorage.load(id)
      case 'Answer':
        return AnswerStorage.load(id)
    }
  },

  (object) => {
    switch(object.__type) {
      case 'User':
        return require('./UserType')
      case 'Theme':
        return require('./ThemeType')
      case 'Topic':
        return require('./TopicType')
      case 'TopicLink':
        return require('./TopicLinkType')
      case 'Insight':
        return require('./InsightType')
      case 'UserCollection':
        return require('./UserCollectionType')
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
      case 'Question':
        return require('./QuestionType')
      case 'Answer':
        return require('./AnswerType')
    }
  }

)
