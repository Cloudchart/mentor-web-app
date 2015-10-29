import {
  connectionDefinitions
} from 'graphql-relay'


export default connectionDefinitions({

  name: 'Themes',

  nodeType: ThemeType

})


import ThemeType from '../types/ThemeType'
