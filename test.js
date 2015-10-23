import Job from './workers/jobs/ActualizeThemeInsights'

Job.performAsync({ themeID: 'd0fef4fc-ca94-4073-9736-d718dea72096' })
  .then((result) => console.log(result))
  .catch((error) => console.log(error))
  .then(() => { console.log('done') ; process.exit(0) })
