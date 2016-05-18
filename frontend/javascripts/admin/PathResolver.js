import Dashboard from 'admin/components/Dashboard'
import Insights from 'admin/components/Insights'

import AdminRoute from 'admin-routes/Admin'


const DefaultItem = {
  Component: Dashboard,
  title: 'Dashboard',
  path: ''
}


const Data = [
  DefaultItem,
  { Component: Insights, title: 'Insights', path: 'insights', Route: AdminRoute },
]


let resolvePath = (pathParts, data, defaultItem) => {
  let pathPart = pathParts[0]
  let dataItem = data.find(({path}) => path === pathPart)
  if (dataItem && dataItem.children)
    return resolvePathAt(pathParts.slice(1), dataItem.children, dataItem)
  else
    return dataItem || defaultItem
}


let resolve = (path) => {
  let pathParts = path || path === ''
    ? [].concat(path)
    : window.location.pathname.split('/').filter(part => !!part).slice(1)
  return resolvePath(pathParts, Data, DefaultItem)
}


let replace = (path) => {
  let pathPrefix = window.location.pathname.split('/').filter(part => !!part)[0]
  let pathname = [pathPrefix].concat(path).filter(part => !!part).join('/')
  history.pushState({}, null, '/' + pathname)
}


let callbacks = []

let onHistory = (callback) => {
  if (callbacks.indexOf(callback) === -1)
    callbacks.push(callback)
}

window.addEventListener('popstate', () => {
  callbacks.forEach(callback => callback())
})

export default {
  resolve:    resolve,
  replace:    replace,
  Data:       Data,
  onHistory:  onHistory,
}
