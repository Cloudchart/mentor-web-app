import DataLoader from 'dataloader'
import Models from '../models'


const TransformQuery = (Model, query) => {
  return query.replace(/{(.+?)}/g, (_, value) => {
    let [modelName, fieldName] = value.split('.')
    let model = modelName === 'self' ? Model : Models[modelName]
    let field = fieldName === 'primaryKey' ? model.primaryKeyField : fieldName
    return [model.tableName, field].join('.')
  }).trim().replace(/\s+/g, ' ')
}


let buildQuery = (Model, queryParts) => {
  let query = `
    select
      ${
        queryParts.fields
          ? queryParts.fields
          : '{self.primaryKey}'
      }
    from
      ${Model.tableName}
    ${ queryParts.where ? 'where ' + queryParts.where : '' }
    ${ queryParts.order ? 'order by ' + queryParts.order : '' }
  `
  return TransformQuery(Model, query)
}


let createPKLoader = (Model) => {
  let query = buildQuery(Model, {
    fields: `{self.*}`,
    where:  `{self.primaryKey} in (:ids)`,
    order:  `{self.created_at}`,
  })

  return async (ids) => {
    return Models.sequelize
      .query(query, {
        replacements: { ids },
        type: Models.sequelize.QueryTypes.SELECT
      })
      .then(recordsList => {
        return recordsList.reduce((memo, record) => {
          memo[record[Model.primaryKeyField]] = record
          return memo
        }, {})
      })
      .then(recordsMap => {
        return ids.map(id => {
          return recordsMap[id] || new Error('Record not found.')
        })
      })
  }
}


let createQueryLoader = (Model, options = {}) => {
  let query = buildQuery(Model, options.query)

  return async () => {
    return await Models.sequelize
      .query(query, {
        type: Models.sequelize.QueryTypes.SELECT
      })
      .then((records) => {
        return records
          .map(record => record[Model.primaryKeyField])
          .filter((key, ii, keys) => keys.indexOf(key) === ii)
      })
  }
}


let createDataSource = (name, options = {}) => {

  const ModelName       = options.modelName || name
  const Model           = Models[ModelName]

  const PKLoader = new DataLoader(createPKLoader(Model))

  let DataSource = {}

  const PKLoaderMethods = {
    load: async (id) => {
      return await PKLoader.load(id)
    },

    loadMany: async (ids) => {
      return await PKLoader.loadMany(ids)
    },

    query: async (query, ...args) => {

    },

    queryMany: async (query, ...args) => {

    },
  }


  DataSource = {
    ...DataSource,
    ...PKLoaderMethods,
  }


  return DataSource
}

export default {
  createDataSource
}
