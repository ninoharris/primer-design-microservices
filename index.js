import server from './server'

const works = server({
  port: 7890,
}).then(() => console.log('running...'))