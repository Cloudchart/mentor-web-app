import redisClient from './redis'

const Prefix = 'mentor-web-app-pub-sub:'

class PubSub {

  constructor() {
    this.publisher  = redisClient()
    this.subscriber = redisClient()
    this.channels   = {}
    this._subscribe()
  }

  subscribe(channel, handler) {
    if (Object.keys(this.channels).indexOf(channel) === -1)
      this.subscriber.psubscribe(Prefix + channel)

    channel = Prefix + channel

    this.channels[channel] || (this.channels[channel] = [])
    this.channels[channel].push(handler)
  }

  publish(channel, message) {
    this.publisher.publish(Prefix + channel, JSON.stringify(message))
  }


  _subscribe() {
    this.subscriber.on('pmessage', (pattern, channel, message) => {
      if (this.channels[pattern]) {
        try { message = JSON.parse(message) } catch(e) { }
        this.channels[pattern].forEach(callback => callback(channel.slice(Prefix.length), message))
      }
    })
  }

}

export default new PubSub
