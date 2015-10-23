import PubSub from './workers/PubSub'

let ps = PubSub

ps.publish('model:User:cache-clear', '62906a29-719e-46f6-8bdd-1836a3811e12')
