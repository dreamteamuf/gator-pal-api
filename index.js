const admin = require('firebase-admin');
const uuidv4 = require('uuid/v4')
const cors = require('cors');
const express = require('express');
const app = require('express')()
const server = require('http').Server(app)
let serviceAccount = require('./config.json')

const bodyParser = require('body-parser')
app.use(bodyParser.json())
app.use(cors())
app.use(bodyParser.urlencoded({ extended: false }))

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

let db = admin.firestore();

app.post('/', async (req, res) => {
  console.log(req.body);
  let timestamp = Date.now();
  let name = req.body.name
  let guardian = req.body.guardian
  let phoneNumber = req.body.phoneNumber
  let address = req.body.address
  let reason = req.body.reason
  let month = req.body.dob.month
  let day = req.body.dob.day
  let year = req.body.dob.year
  let DOB = new Date(year, month, day)
  let monthAdmitted = req.body.admitted.month
  let dayAdmitted = req.body.admitted.day
  let yearAdmitted = req.body.admitted.year
  let hour = req.body.admitted.hour
  let minutes = req.body.admitted.minutes
  let dateAdmitted = new Date(yearAdmitted, monthAdmitted, dayAdmitted, hour, minutes)
  let uuid = uuidv4()

  await db.collection('patients').doc().collection('general').add(
    {
      "Name": name,
      "Timestamp": timestamp,
      "Guardian": guardian,
      "Phone Number": phoneNumber,
      "Address": address,
      "Reason for admittance": reason,
      "Date of Birth": DOB,
      "Date Admitted": dateAdmitted,
      "UUID": uuid
    }
    // {
    //   "name": "", 
    //   "guardian": "",
    //   "phoneNumber": "", 
    //   "address": "", 
    //   "reason": "",
    //   "dob":{
    //     "month": "", 
    //     "day": "", 
    //     "year": ""
    //   }, 
    //   "admitted":{
    //     "month": "", 
    //     "day": "", 
    //     "year" : "", 
    //     "hour": "", 
    //     "minutes": ""
    //   }
    // }
  ).then(ref => {
    console.log("Document ID " + ref.parent.parent.id)
    console.log("General ID " + ref.id)
  }).catch((error) => {
    console.log(error)
    res.status(500).send(error)
  })
  res.status(200).send("Added patient" + req.body)
})

app.put('/', async (req, res) => {
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
  } catch (error) { //catches error
    console.log(`${error}`)
    res.status(500).send(error)
  }
})

server.listen(8080, () => {
  const host = server.address().address
  const port = server.address().port
  console.log(`Example app listening at http://${host}:${port}`);
})
