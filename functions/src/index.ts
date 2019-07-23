import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import * as express from 'express';
import * as bodyParser from "body-parser";

admin.initializeApp(functions.config().firebase);
// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
// export const helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });

const db = admin.firestore();
const app = express();
const main = express();

main.use('/api/v1', app);
main.use(bodyParser.json());
main.use(bodyParser.urlencoded({ extended: false }));

export const gatorpalapi = functions.https.onRequest(main);

app.get('/users', (request, response) => {
    const the_data = {
        worked: 'Yay'
    }
    response.send('Hello world')
    // try {
    //     const userID = request.body.userID
    //     console.log(userID)
    //     const query =  db.collection('users').doc(userID).get();
    //     console.log(query)
    //     const the_data = {
    //         worked: 'Yay'
    //     }
    //     response.json(the_data);
    // } catch (error){
    //     response.status(500).send(error);
    // }
});

app.post('/users', async (request, response) => {
    
    const {address, fearfactor, age, race} = request.body
    try {
        const data = {
            address,
            fearfactor,
            age,
            race
        }
        const ref = await db.collection('users').add(data);
        const res = await ref.get()
        response.json({
            id: ref.id,
            data: res.data()
        })
    } catch (error) {
        response.status(500).send(error);
    }
});

app.get('/users/:id', async (request, response) => {
    try {
      const userId = request.params.id;
  
      if (!userId) throw new Error('user ID is required');
  
      const ref = await db.collection('users').doc(userId).get();
  
      if (!ref.exists){
          throw new Error('Fight doesnt exist.')
      }
  
      response.json({
        id: ref.id,
        data: ref.data()
      });
  
    } catch(error){
  
      response.status(500).send(error);
  
    }
  });