module.exports = function(shipit) {
  require('shipit-deploy')(shipit)

  const HOME_PATH = '/home/app/mentor-web-app'

  shipit.initConfig({

    staging: {
      servers: 'app@mentor1.cochart.net',
      workspace: '/tmp/mentor-web-app-deploy',
      deployTo: HOME_PATH,
      repositoryUrl: 'git@github.com:Cloudchart/mentor-web-app.git',
    },

  })

  // before:
  // stop server

  // after:
  // link directories
  // update node modules
  // run scripts
  //  sequelize
  //  webpack
  //  graphql
  // start server

}
