"use strict"

var path = require('path')

module.exports = function(shipit) {
  require('shipit-deploy')(shipit)

  const HOME_PATH = '/home/app/mentor-web-app'

  const LINK_FILES = [
    '.env',
  ]

  const LINK_DIRS = [
    'node_modules',
  ]

  shipit.initConfig({

    staging: {
      servers: 'app@mentor1.cochart.net',
      workspace: '/tmp/mentor-web-app-deploy',
      deployTo: HOME_PATH,
      repositoryUrl: 'git@github.com:Cloudchart/mentor-web-app.git',
      shallowClone: 'true',
    },

  })

  shipit.task('update-links', function() {
  })

  shipit.task('update-link-files', function() {
  })

  shipit.task('update-link-dirs', () => {
    LINK_DIRS.map(dir => {
      let command = `cp -r ${path.join(HOME_PATH, 'shared', dir)} ${shipit.currentPath}`
    })
  })

  shipit.task('update-node-modules', function() {
    return shipit.remote(`cd ${shipit.currentPath} && npm update`)
  })


  shipit.on('deployed', function() {
    return shipit.start(['update-links', 'update-node-modules'])
  })


}
