import BaseStorage from './BaseStorage'
import { Answer as Model } from '../models'


const TableName = Model.tableName


const GenericQuery = (options = {}) => `
  select
    id
  from
  ${ options.table ? options.table : TableName }
  ${ options.where ? ' where ' + options.where : '' }
  ${ options.order ? ' order by ' + options.order : '' }
  ${ options.limit ? ' limit ' + options.limit : '' }
`

const Storage = BaseStorage('Answer', {
  idsQueries: {
    'allForQuestion': GenericQuery({ where: 'question_id = :question_id', order: 'position' }),
    'lastForQuestion': GenericQuery({ where: 'question_id = :question_id', order: 'position desc', limit: 1 }),
  },

  afterDestroy: async (answer) => {
    let answers = await Storage.loadAll('allForQuestion', { question_id: answer.question_id })
    answers.forEach(async (answer, ii) => {
      if (answer.position !== ii)
        await Storage.update(answer.id, { position: ii })
    })
  }
})


export default {
  ...Storage,
}
