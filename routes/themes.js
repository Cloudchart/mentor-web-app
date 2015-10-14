import { Router } from 'express'

import { Theme, Insight } from '../models'
import algolia from '../algolia'

let router = Router()

const timeout = 24 * 60 * 60 * 1000


let findOrCreateInsight = (data) => {
  return Insight.findById(data.objectID).then(insight => {
    return insight ? insight : Insight.create({ id: data.objectID, content: data.content })
  })
}

let fetchAlgoliaSearch = theme => {
  let now = + new Date
  if ((now - theme.last_fetched_at) < timeout) return
  return algolia.search(theme.name, {
    hitsPerPage: 200,
    attributesToRetrieve: 'objectID,content',
    attributesToHighlight: 'none'
  }).then(({ hits }) => {

    console.log(hits)

    let insights = hits.map(hit => findOrCreateInsight(hit))

    return Promise.all(insights).then(insights => {
      return theme.setInsights(insights).then(() => {
        return theme.update({ last_fetched_at: now })
      })
    })
  })
}

router.get('/:id', (req, res, next) => {
  Theme.findById(req.params.id)
    .then(theme => {
      Promise.resolve(fetchAlgoliaSearch(theme)).then(() => {
        res.render('themes/show', { title: theme.name, theme: theme })
      })
    })
    .catch(error => {
      res.status(404)
      next()
    })
})

export default router
