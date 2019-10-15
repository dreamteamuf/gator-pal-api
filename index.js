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


app.get('/', async (req, res) => {
    // let docRef = db.doc("patients")
    // try {
    //     const patientId = req.body.id;
    //     console.log(req.body.id);
        
    //     if(!patientId){
    //         let patients = await db.collection("patients").get();
    //     }else{
    //         let patients = await db.collection("patients").doc(patientId).get();
    //     }

    //     if(!patients.exists){
    //         throw new Error("Patient does not exist")
    //     }
    //     console.log(patients);
    //     res.json({
    //         id: patients.id,
    //         data: patients.data()
    //     });
    //     // querySnapshot.forEach((doc) => {
    //     //     console.log(doc.id, " => ", doc.data());
    //     // })

 
    // } catch (error){
    //     res.status(500).send(error);
    // }   

    let patientsReference = db.collection('patients');
    let allPatients = patientsReference.get()
        .then(snapshot => {
            snapshot.forEach(doc => {
                console.log(doc.id, '=>', doc.data());
             });
        })
        .catch(err => {
            console.log('Error getting documents', err);
        });
});


server.listen(8080, () => {
    const host = server.address().address
    const port = server.address().port
    console.log(`Example app listening at http://${host}:${port}`);
})