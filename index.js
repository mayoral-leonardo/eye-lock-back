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
const usuarios = db.collection('usersTesteBack');

app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));

app.listen(3000, () => {
  console.log('Servidor iniciado na porta 3000');
});

// Rota de get para usuários
app.get('/usuarios/all', async (req, res) => {
  const snapshot = await usuarios.get();
  const allUsers = snapshot.docs.map(doc => ({
    id: doc.id,
    nome: doc.data().nome,
    email: doc.data().email,
    ...doc.data()
  }));
  res.send(allUsers);
});

// Rota de get para usuários residentes
app.get('/usuarios/residents', async (req, res) => {
  const snapshot = await usuarios.get();
  const allUsers = snapshot.docs.map(doc => ({
    id: doc.id,
    nome: doc.data().nome,
    email: doc.data().email,
    ...doc.data()
  }));

  const residents = allUsers.filter(user => user.level === 'resident');
  res.send(residents);
});

// Rota de get para usuários visitantes
app.get('/usuarios/visitors', async (req, res) => {
  const snapshot = await usuarios.get();
  const allUsers = snapshot.docs.map(doc => ({
    id: doc.id,
    nome: doc.data().nome,
    email: doc.data().email,
    ...doc.data()
  }));

  const visitors = allUsers.filter(user => user.level === 'visitor');
  res.send(visitors);
});

// Rota de get para usuário específico
app.get('/usuarios/:id', async (req, res) => {
  const id = req.params.id;
  const snapshot = await usuarios.get();
  const allUsers = snapshot.docs.map(doc => ({
    id: doc.id,
    nome: doc.data().nome,
    email: doc.data().email,
    ...doc.data()
  }));

  const user = allUsers.find(user => user.id === id);
  if (user) {
    res.send(user);
  } else {
    res.status(404).send({message: 'Usuário não encontrado'});
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

//////////////////////////////////////////////////////////////
// Teste de autenticação

// Rota de post para criação de usuário residente com autenticação
app.post('/cadastro/resident', async (req, res) => {
  const data = req.body;

  const user = {
    name: data.name,
    email: data.email,
    password: data.password,
  }

  try {
    await firebase.auth().createUserWithEmailAndPassword(user.email, user.password)
      .then(async (value) => {
        let uid = value.user.uid;

        await firebase.firestore().collection('usersTesteBack')
          .doc(uid).set({
            name: user.name,
            level: 'resident',
            email: user.email,
            avatarUrl: null,
          })
          .then(() => {
            console.log(`Usuário ${user.name} cadastrado com sucesso`);
          })
          res.status(201).send({ message: 'Usuário cadastrado com sucesso' });

      })
  } catch (error) {
    res.status(400).send({
      message: error
    });
  }
});

// Rota de post para criação de usuário visitante com autenticação
app.post('/cadastro/visitor', async (req, res) => {
  const data = req.body;

  const user = {
    name: data.name,
    email: data.email,
    password: data.password,
  }

  try {
    await firebase.auth().createUserWithEmailAndPassword(user.email, user.password)
      .then(async (value) => {
        let uid = value.user.uid;

        await firebase.firestore().collection('usersTesteBack')
          .doc(uid).set({
            name: user.name,
            level: 'visitor',
            email: user.email,
            avatarUrl: null,
          })
          .then(() => {
            console.log(`Usuário ${user.name} cadastrado com sucesso`);
          })
          res.status(201).send({ message: 'Usuário cadastrado com sucesso' });

      })
  } catch (error) {
    res.status(400).send({
      message: error
    });
  }
});