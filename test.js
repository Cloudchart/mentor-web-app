import DeviceStorage from './storage/DeviceStorage'

DeviceStorage.create({ device_id: 'abcdefg' }).then(record => {
  console.log(record)
  DeviceStorage.update(record.id, { user_id: 'ajhskahsdkajhdkj' }).then(record => {
    console.log(record)
    DeviceStorage.destroy(record.id).then(() => {
      console.log('done')
      process.exit(0)
    })
  })
})
