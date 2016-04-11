import BaseStorage from './BaseStorage'
import { Question as Model } from '../models'


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

const Storage = BaseStorage('Question', {
  idsQueries: {
    'all': GenericQuery({ order: 'created_at desc' })
  },

  afterDestroy: async (record) => {
    // remove reaction
    let reaction = await BotReactionStorage.loadOne('forOwner', { owner_id: record.id, owner_type: 'Question' }).catch(() => null)
    if (reaction)
      await BotReactionStorage.destroy(reaction.id)

    // remove answers
    let answers = await AnswerStorage.loadAll('allForQuestion', { question_id: record.id })
    answers.forEach(async (answer) => await AnswerStorage.destroy(answer.id) )
  }
})


export default {
  ...Storage,
}

import AnswerStorage from './AnswerStorage'
import BotReactionStorage from './BotReaction'
