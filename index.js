const express = require('express');
const cors = require('cors');
const firebase = require('firebase');
const crypto = require("crypto");

const app = express();

const firebaseConfig = {
  apiKey: "AIzaSyAfERv7uYBO5nCS_zNy9NdJy4vdcIBW6Ss",
  authDomain: "eye-lock-database.firebaseapp.com",
  projectId: "eye-lock-database",
  storageBucket: "eye-lock-database.appspot.com",
  messagingSenderId: "176501973151",
  appId: "1:176501973151:web:a2cce711d2e7892aeb42aa"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const usuarios = db.collection('usuarios');

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
    id: doc.data().id,
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
    id: doc.data().id,
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
    id: doc.data().id,
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
    id: doc.data().id,
    nome: doc.data().nome,
    email: doc.data().email,
    ...doc.data()
  }));

  const user = allUsers.find(user => user.id === id);
  res.send(user);
});

// Rota de post para cadastro de usuário residente
app.post('/cadastro/resident', async (req, res) => {
  const data = req.body;
  const id = crypto.randomBytes(16).toString("hex");

  const user = {
    id,
    level: 'resident',
    nome: data.nome,
    email: data.email,
    senha: data.senha,
  }

  await usuarios.add(user)
    .then(() => {
      res.status(201).send({
        message: 'Usuário cadastrado com sucesso'
      });
      console.log(`Usuário ${user.nome} cadastrado com sucesso`);
    }).catch((error) => {
      res.status(400).send({
        message: error
      });
    });
});

// Rota de post para cadastro de usuário visitante
app.post('/cadastro/visitor', async (req, res) => {
  const data = req.body;
  const id = crypto.randomBytes(16).toString("hex");

  const user = {
    id,
    level: 'visitor',
    nome: data.nome,
    email: data.email,
    senha: data.senha,
  }

  await usuarios.add(user)
    .then(() => {
      res.status(201).send({
        message: 'Usuário cadastrado com sucesso'
      });
      console.log(`Usuário ${user.nome} cadastrado com sucesso`);
    }).catch((error) => {
      res.status(400).send({
        message: error
      });
    });
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
