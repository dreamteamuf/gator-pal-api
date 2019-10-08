const admin = require('firebase-admin')
const cors = require('cors')
const uuidv4 = require('uuid/v4')
let serviceAccount = require('./config.json')

admin.initializeApp(
    {credential: admin.credential.cert(serviceAccount)}
)
let db = admin.firestore();

const app = require('express')()
const server = require('http').Server(app)

server.listen(8080, () => {
    const host = server.address().address
    const port = server.address().port
    console.log(`Example app listening at http://${host}:${port}`);
})