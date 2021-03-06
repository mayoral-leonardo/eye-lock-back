const express = require('express');
const cors = require('cors');
const firebase = require('firebase');

const app = express();

const firebaseConfig = {
  apiKey: "AIzaSyAfERv7uYBO5nCS_zNy9NdJy4vdcIBW6Ss",
  authDomain: "eye-lock-database.firebaseapp.com",
  projectId: "eye-lock-database",
  storageBucket: "eye-lock-database.appspot.com",
  messagingSenderId: "176501973151",
  appId: "1:176501973151:web:a2cce711d2e7892aeb42aa"
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

const db = firebase.firestore();
const usuarios = db.collection('users');

app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));

app.listen(4000, () => {
  console.log('Servidor iniciado na porta 4000');
});

// Rota de get para usuários
app.get('/usuarios/all', async (req, res) => {
  const snapshot = await usuarios.get();
  const allUsers = snapshot.docs.map(doc => ({
    id: doc.id,
    name: doc.data().name,
    level: doc.data().level,
    email: doc.data().email,
    ...doc.data()
  }));
  res.send(allUsers.filter(user => user.level !== 'admin'));
});

// Rota de get para usuário específico
app.get('/usuarios/:id', async (req, res) => {
  const id = req.params.id;
  const snapshot = await usuarios.get();
  const allUsers = snapshot.docs.map(doc => ({
    id: doc.id,
    name: doc.data().name,
    level: doc.data().level,
    email: doc.data().email,
    ...doc.data()
  }));

  const user = allUsers.find(user => user.id === id);
  if (user) {
    res.send(user);
  } else {
    res.status(404).send({ message: 'Usuário não encontrado' });
  }
});

// Rota de put para atualização de usuário
app.put('/usuarios/update/:id', async (req, res) => {
  const id = req.params.id;
  const data = req.body;

  await usuarios.doc(id).update(data)
    .then(() => {
      res.status(201).send({
        message: 'Usuário atualizado com sucesso'
      });
      console.log('Usuário atualizado com sucesso');
    }).catch((error) => {
      res.status(400).send({
        message: error
      });
    });
});

// Rota de delete para exclusão de usuário
app.delete('/usuarios/delete/:id', async (req, res) => {
  const id = req.params.id;

  await usuarios.doc(id).delete()
    .then(() => {
      res.status(201).send({
        message: 'Usuário excluído com sucesso'
      });
      console.log('Usuário excluído com sucesso');
    }).catch((error) => {
      res.status(400).send({
        message: error
      });
    });
});

// Rota de post para criação de usuário com autenticação
app.post('/register/', async (req, res) => {
  const data = req.body;

  const user = {
    name: data.name,
    level: data.level,
    email: data.email,
    password: data.password,
  }

  try {
    await firebase.auth().createUserWithEmailAndPassword(user.email, user.password)
      .then(async (value) => {
        let uid = value.user.uid;

        await usuarios
          .doc(uid).set({
            name: user.name,
            level: user.level,
            email: user.email,
          })
          .then(() => {
            console.log(`Usuário ${user.name} cadastrado com sucesso`);
          })
        res.status(201).send({ message: 'Usuário cadastrado com sucesso' });

      })
  } catch (error) {
    res.status(400).send({
      error: error
    });
  }
});

// Rota de post para autenticação e login de usuário
app.post('/login', async (req, res) => {
  const data = req.body;

  const user = {
    email: data.email,
    password: data.password,
  }

  try {
    await firebase.auth().signInWithEmailAndPassword(user.email, user.password)
      .then(async (value) => {
        let uid = value.user.uid;

        const userProfile = await usuarios.doc(uid).get();

        if (userProfile.exists) {

          let data = {
            user: {
              id: uid,
              name: userProfile.data().name,
              level: userProfile.data().level,
              email: userProfile.data().email,
              ...userProfile.data(),
            }
          };

          res.send(data);
          console.log(`Usuário ${data.user.name} logado com sucesso`);
        } else {
          res.status(404).send({ error: 'Usuário não encontrado' });
        }
      })
  } catch (error) {
    res.status(400).send({
      error: error
    });
  }
});

// Rota de post para logout de usuário
app.post('/logout', async (req, res) => {

  try {
    await firebase.auth().signOut()
      .then(() => {
        res.send({ message: 'Usuário deslogado com sucesso' });
        console.log('Usuário deslogado com sucesso');
      })
  } catch (error) {
    res.status(400).send({
      message: error
    });
  }
});