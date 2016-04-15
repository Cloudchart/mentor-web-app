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

const AnsweredQuestionsQuery = `
  select
    id
  from
    ${ TableName }
  where id in (
    select
  	 a.question_id
    from
    	users_answers ua
    inner join
    	answers a
    on
    	a.id = ua.answer_id
    where
      ua.user_id = :user_id
  )
  order by severity, created_at
`

const UnansweredQuestionsQuery = `
  select
    id
  from
    ${ TableName }
  where id not in (
    select
     a.question_id
    from
      users_answers ua
    inner join
      answers a
    on
      a.id = ua.answer_id
    where
      ua.user_id = :user_id
  )
  and
  is_published = true
  order by severity, created_at
`

const Storage = BaseStorage('Question', {
  idsQueries: {
    'all': GenericQuery({ order: 'created_at desc' }),
    'answeredForUser': AnsweredQuestionsQuery,
    'unansweredForUser': UnansweredQuestionsQuery,
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
