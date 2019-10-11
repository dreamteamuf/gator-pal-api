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


app.put('/', async (req,res) => {
    let query_params = req.query
    let updated_data = req.body;
    let documentref = db.doc(`patients/${query_params.id}`)
    let data_keys = Object.keys(updated_data) //grabs the keys of the updated data

    if (data_keys === null || data_keys === undefined) { //empty data
        res.status(400).send('bad input')
    }
    
    try {
        let data = null
        
        await documentref.get().then((documentSnapshot) => {//gets the data
            if (!documentSnapshot.exists) {
                throw new Error('cannot find input')
            }
            console.log(`Found document at '${documentSnapshot.ref.path}'`);
            data = documentSnapshot.data()
            let data_keys = Object.keys(updated_data);

            for (let key of data_keys) { //updates the data for every update key
                if (data[key] === null || data[key] === undefined) {
                    throw new Error('input key is not in the snapshot')
                }
                data[key] = updated_data[key]
            }
        })
        await documentref.set(data).then((result) => { //sets the new data
            res.status(200).send(result)
        })
    } catch(error) { //catches error
        console.log(`${error}`)
        res.status(500).send(error)
    }
})

server.listen(8080, () => {
    const host = server.address().address
    const port = server.address().port
    console.log(`Example app listening at http://${host}:${port}`);
})
