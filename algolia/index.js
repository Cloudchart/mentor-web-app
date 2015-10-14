import algoliasearch from 'algoliasearch'
import configuration from '../config/algolia'

export default algoliasearch(configuration.clientId, configuration.clientSecret)
  .initIndex(configuration.indexName)
