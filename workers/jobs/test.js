export default {

  // schedule: '*/10 * * * * *',

  perform: (arg, done) => {
    console.log("Performing test with: ", arg)
    setTimeout(() => {
      console.log("Test done")
      done(null, null)
    }, 2500)
  }

}
