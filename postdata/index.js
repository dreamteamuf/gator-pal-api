const Firestore = require('@google-cloud/firestore');
const marckeyFileName = '../gatorpal_filekey.json'
const PROJECTID = 'gatorpaldev';
const COLLECTION_NAME = 'users';
const firestore = new Firestore({
  projectId: PROJECTID,
  keyFilename: marckeyFileName
});

exports.postdata = (req, res) => {

  if (req.method === 'POST') {
    // store/insert a new document
    const data = (req.body) || {};
    const name = data.name
    console.log(req.params)
    const metadata = data.info
    const created = new Date().getTime();
    return firestore
      .doc(COLLECTION_NAME + '/' + req.body.id + '/Progress/' + created)
      .set({
        timestamp: created, 
        username: name, 
        info: metadata })
      .then(doc => {
        return res.status(200).send(doc);
      }).catch(err => {
        console.error(err);
        return res.status(404).send({ error: 'unable to store', err });
      });
  }else {
      return res.status(405).send({error: 'NOT ALLOWED'})
  }

};