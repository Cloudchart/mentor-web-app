import BaseStorage from './BaseStorage'

const tableName = models.Answer.tableName

const QuestionQuery = `
  select
    at.id as id,
    @row := @row + 1 as row
  from
    (select @row := 0) rt,
    ${tableName} at
  where
    at.question_id = :questionID
  order by
    at.position
`


export default BaseStorage('Answer', {
  idsQueries: {
    'forQuestion': QuestionQuery
  }
})
