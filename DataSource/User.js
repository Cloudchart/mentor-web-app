import DataSource from './DataSource'

export default DataSource.createDataSource('User', {

  queries: {
    all: {
      query: {
        order:  `{self.created_at}`,
      },
      depends: {
        'User': {
          create: true,
          update: false,
          delete: true,
        }
      }
    }
  }

})
