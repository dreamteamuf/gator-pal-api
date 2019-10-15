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

const bodyParser = require('body-parser');
app.use(bodyParser.json())
app.use(cors())
app.use(bodyParser.urlencoded({extended: false}))


app.delete('/id', async (req, res) => {
    
    let deleteDoc = db.collection('patients').doc.delete()
        .then(console.log(doc.id + " deleted"))
        .catch(err => {
            console.log('Error getting documents', err);
        });
    res.status(400).send("error")
    res.status(200).send(deleteDoc)
});


server.listen(9000, () => {
    const host = server.address().address
    const port = server.address().port
    console.log(`listening at ${host}:${port}`);
})