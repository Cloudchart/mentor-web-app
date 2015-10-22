import Job from './workers/jobs/ActualizeUserThemeInsights'

Job.performAsync({ userID: '62906a29-719e-46f6-8bdd-1836a3811e12', themeID: 'd0fef4fc-ca94-4073-9736-d718dea72096' })
  .then((result) => console.log(result))
  .catch((error) => console.log(error))
  .then(() => { console.log('done') ; process.exit(0) })
