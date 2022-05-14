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
app.get('/usuarios', async (req, res) => {
  const snapshot = await usuarios.get();
  const allUsers = snapshot.docs.map(doc => ({
    nome: doc.data().nome,
    idade: doc.data().idade,
    imagem: doc.data().imagem,
    ...doc.data()
  }));
  res.send(allUsers);
});

// Rota de post para cadastro de usuário
app.post('/cadastro', async (req, res) => {
  const data = req.body;

  await usuarios.add({ level: "admin", ...data })
    .then(() => {
      res.status(201).send({
        message: 'Usuário cadastrado com sucesso'
      });
      console.log('Usuário cadastrado com sucesso' + '' + data.nome + '' + data.idade);
    }).catch(() => {
      res.status(400).send({
        message: 'Erro ao cadastrar usuário'
      });
    });
});
