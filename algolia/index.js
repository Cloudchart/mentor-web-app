import algoliasearch from 'algoliasearch'
import configuration from '../config/algolia'

let searchIndex = algoliasearch(configuration.clientId, configuration.clientSecret).initIndex(configuration.indexName)

let searchConfiguration = {
  hitsPerPage:            configuration.hitsPerPage,
  attributesToRetrieve:   'objectID,content,pinboard_tags',
  attributesToHighlight:  'none'
}

let search = (query, options = {}) =>
  searchIndex.search(query, Object.assign({}, searchConfiguration, options)).then(({ hits }) => hits)

export default search
