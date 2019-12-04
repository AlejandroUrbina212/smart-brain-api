const Clairifai = require('clarifai');

/* app declaration for clairifai model usage */
const app = new Clarifai.App({
    apiKey: '6959e8b07d304cfdb32d2776b42752fe'
   });

const handleApiCall = (req, res) => {
    app.models
      .predict(Clarifai.FACE_DETECT_MODEL,req.body.input)
      .then(data => {
          console.log(data);
          res.json(data);
      }).catch(err => {
          res.status(400).json('unable to work with API');
      })
}

const handleImage = (req, res, db)=>{
    const { id } = req.body;
    db('users').where('id', '=', id)
    .increment('entries', 1)
    .returning('entries')
    .then( entries => {
        res.json(entries[0]);
    })
    .catch( err => res.status(400).json('unable to get entries'));
}

module.exports = {
    handleImage: handleImage,
    handleApiCall: handleApiCall
}