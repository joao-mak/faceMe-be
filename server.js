const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const express = require('express');
const app = express();

app.use(express.json());
app.use(cors());

const database = {
  users: [
    {
      id: '1',
      name: 'john',
      email: 'john@gmail.com',
      password: 'cookies',
      entries: 1,
      joined: new Date(),
    },
    {
      id: '2',
      name: 'sally',
      email: 'sally@gmail.com',
      password: 'bananas',
      entries: 0,
      joined: new Date(),
    },
  ],
};

app.get('/', (req, res) => {
  res.send(database.users);
});

app.post('/signin', (req, res) => {
  if (
    req.body.email === database.users[0].email &&
    req.body.password === database.users[0].password
  ) {
    res.json(database.users[0]);
  } else {
    res.status(400).json('error logging in');
  }
});

app.post('/register', (req, res) => {
  const { email, name, password } = req.body;
  bcrypt.hash(password, null, null, function (err, hash) {
    console.log(hash);
  });
  database.users.push({
    id: (database.users.length + 1).toString(),
    name,
    email,
    password,
    entries: 0,
    joined: new Date(),
  });
  res.json(database.users[database.users.length - 1]);
});

app.get('/profile/:id', (req, res) => {
  const { id } = req.params;
  const user = database.users.find((user) => user.id === id);
  user ? res.json(user) : res.status(404).json(`no such user`);
});

app.post('/image', (req, res) => {
  const { id } = req.body;
  const user = database.users.find((user) => user.id === id);
  if (user) {
    user.entries++;
    return res.json(user.entries);
  } else {
    res.status(404).json(`no such user`);
  }
});

app.listen(3001, () => {
  console.log('listening on port 3001...');
});

// bcrypt.hash("bacon", null, null, function(err, hash) {
//   // Store hash in your password DB.
// });

// // Load hash from your password DB.
// bcrypt.compare("bacon", hash, function(err, res) {
//   // res == true
// });
// bcrypt.compare("veggies", hash, function(err, res) {
//   // res = false
// });
