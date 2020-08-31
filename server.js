const db = require('./db/connection');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const express = require('express');
const app = express();
const Clarifai = require('clarifai');

const clarifaiApp = new Clarifai.App({
  apiKey: 'e17fc639c24446d6a08a848de5fc0e54',
});

const { PORT = 3001 } = process.env;

app.use(express.json());
app.use(cors());

app.get('/', (req, res) => {
  db.select('*')
    .from('users')
    .then((users) => res.send(users));
});

app.post('/signin', (req, res) => {
  const { email, password } = req.body;
  db('login')
    .select('*')
    .where('login_email', '=', email)
    .then((user) => {
      if (user.length) {
        const isValid = bcrypt.compareSync(password, user[0].login_hash);
        if (isValid) {
          return db('users')
            .select('*')
            .where('user_email', '=', email)
            .then((user) => {
              if (user.length) {
                res.json(user[0]);
              } else {
                console.log('no user with this email');
                res.status(404).json('unable to get user');
              }
            });
        } else {
          console.log('invalid password');
          res.status(404).json('invalid credentials');
        }
      } else {
        console.log('no login_email');
        res.status(400).json('invalid credentials');
      }
    });
});

app.post('/register', (req, res) => {
  const { email, name, password } = req.body;
  const hashPass = bcrypt.hashSync(password);

  db.transaction((trx) => {
    trx('users')
      .insert({
        user_name: name,
        user_email: email,
      })
      .then(() => {
        trx('login')
          .insert({
            login_hash: hashPass,
            login_email: email,
          })
          .then(() => {
            db('users')
              .select('*')
              .where('user_email', '=', email)
              .then((user) => res.json(user[0]));
          })

          .then(trx.commit)
          .catch(trx.rollback);
      })
      .catch((err) => res.status(400).json('unable to register'));
  });
});

app.get('/profile/:user_id', (req, res) => {
  const { user_id } = req.params;
  db('users')
    .select('*')
    .where({ user_id })
    .then((user) => {
      if (user.length) {
        res.json(user[0]);
      } else {
        res.status(404).json('user not found');
      }
    })
    .catch((err) => res.status(404).json(`unable to register`));
});

app.post('/image', (req, res) => {
  const { user_id } = req.body;
  db('users')
    .where({ user_id })
    .increment('entries', 1)
    .returning('entries')
    .then((entries) => {
      res.json(entries[0]);
    })
    .catch((err) => {
      res.status(400).json('unable to get entries');
    });
});

app.post('/imageUrl', (req, res) => {
  clarifaiApp.models
    .predict(Clarifai.FACE_DETECT_MODEL, req.body.input)
    .then((data) => res.json(data))
    .catch((err) => res.status(400).json('unable to work with API'));
});
app.listen(PORT, () => {
  console.log(`listening on port ${PORT}...`);
});
