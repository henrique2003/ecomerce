import 'dotenv'
import path from 'path'

import app from './app'

app.get('/', (req, res) => {
  res.sendFile('index.html', { root: path.join(__dirname, 'public') })
})

app.listen(process.env.PORT || 3333, () => {
  console.log('server running')
})
