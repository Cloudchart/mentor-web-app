import { should } from 'chai'

describe('Follow Ups Storage', function() {

  let FollowUpStorage = require('../FollowUpStorage')

  it('ratedForUser', () =>
    FollowUpStorage
      .loadAll('ratedForUser', { userID: 'abc' })
      .should.eventually.have.length(0)
  )

  it('unratedForUser', () =>
    FollowUpStorage
      .loadAll('unratedForUser', { userID: 'abc' })
      .should.eventually.have.length(0)
  )

  it('positiveForUser', () =>
    FollowUpStorage
      .loadAll('positiveForUser', { userID: 'abc' })
      .should.eventually.have.length(0)
  )

  it('negativeForUser', () =>
    FollowUpStorage
      .loadAll('negativeForUser', { userID: 'abc' })
      .should.eventually.have.length(0)
  )

  it('skippedForUser', () =>
    FollowUpStorage
      .loadAll('skippedForUser', { userID: 'abc' })
      .should.eventually.have.length(0)
  )

  it('lastRatedForUser', () =>
    FollowUpStorage
      .loadOne('lastRatedForUser', { userID: 'abc' })
      .should.eventually.become(undefined)
  )

})
