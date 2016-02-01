import faker from 'faker'
import { User } from '../models'

const usersSize = 50

// users
if (process.argv.indexOf('--users') >= 0) {
  for (let i = 1; i <= usersSize; i++) {
    User.create({
      name: faker.name.findName(),
      email: faker.internet.email(),
      is_active: faker.random.boolean(),
    }).then((user) => {
      console.log(user.name, 'created')
      if (i === usersSize) { process.exit(0) }
    }).catch((error) => {
      console.error(error)
    })
  }
} else {
  console.log('pass table name option (e.g. --users)')
}
