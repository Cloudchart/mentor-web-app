"use strict"

var path = require('path')

module.exports = function(shipit) {
  require('shipit-deploy')(shipit)
  require('shipit-shared')(shipit)

  const HOME_PATH = '/home/app/mentor-web-app'

  shipit.initConfig({

    default: {
      shared: {
        overwrite: true,
        dirs: [
          'node_modules'
        ],
        files: [
          '.env'
        ],
        triggerEvent: 'npmUpdated'
      },

      web: {
        uuid: 'mentor-web-app'
      }

    },

    staging: {
      servers: 'app@mentor1.cochart.net',
      workspace: '/tmp/mentor-web-app-deploy',
      deployTo: HOME_PATH,
      repositoryUrl: 'git@github.com:Cloudchart/mentor-web-app.git',
      shallowClone: 'true',
    }

  })


  shipit.blTask('npm:update', function() {
    return removePackageJsonInShared()
      .then(linkPackageJsonFromReleaseToShared)
      .then(updateSharedNodeModules)
      .then(removePackageJsonInShared)
      .then(function() {
        shipit.emit('npmUpdated')
      })
  })


  shipit.blTask('web:start', function() {
    return shipit.remote(`forever list | grep ${shipit.config.web.uuid} && forever restart ${shipit.config.web.uuid} || ${path.join(shipit.config.deployTo, 'shared', 'start')}`)
  })


  shipit.blTask('web:stop', function() {
    return shipit.remote(`forever list | grep ${shipit.config.web.uuid} && forever stop ${shipit.config.web.uuid} || echo "Not running"`)
  })

  shipit.on('updated', function() {
    shipit.start('npm:update')
  })

  shipit.on('sharedEnd', function() {
    shipit.start('web:stop')
  })

  shipit.on('deployed', function() {
    shipit.start('web:start')
  })

  function removePackageJsonInShared() {
    let sharedPackageJson = path.join(shipit.config.deployTo, 'shared', 'package.json')
    return shipit.remote(`if [ -e ${sharedPackageJson} ]; then rm ${sharedPackageJson}; fi`)
  }

  function linkPackageJsonFromReleaseToShared() {
    return shipit.remote(`ln -s ${path.join(shipit.releasePath, 'package.json')} ${path.join(shipit.config.deployTo, 'shared')}`)
  }

  function updateSharedNodeModules() {
    return shipit.remote(`cd ${path.join(shipit.config.deployTo, 'shared')} && npm update && npm prune`)
  }
}
