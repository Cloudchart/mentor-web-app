import { connectionDefinitions } from 'graphql-relay'

import ThemeType from '../types/theme_type'


let { edgeType, connectionType } = connectionDefinitions({

  name: 'UsersThemes',

  nodeType: ThemeType

})

export { edgeType, connectionType }
