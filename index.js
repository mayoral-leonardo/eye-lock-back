const express = require('express');
const cors = require('cors');
const firebase = require('firebase');

const app = express();

const firebaseConfig = {
  apiKey: "AIzaSyA0zut6Ar3H_MQNo3FSvIHy1vMA9H6744k",
  authDomain: "eye-lock-databse.firebaseapp.com",
  projectId: "eye-lock-databse",
  storageBucket: "eye-lock-databse.appspot.com",
  messagingSenderId: "179459470410",
  appId: "1:179459470410:web:17478d91ac1617c58722b3",
  measurementId: "G-X00X46NGY9"
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

// Rota de get para teste
app.get('/', (req, res) => {
  res.send([{
    message: 'Hello World',
    users: [
      {
        name: 'Leonardo',
        age: '23'
      },
      {
        name: 'Anna Beatriz',
        age: '22'
      }
    ]
  }]);
});

// Rota de post para cadastro de usuário
app.post('/cadastro', (req, res) => {
  const data = req.body;

  usuarios.add(data)
    .then(() => {
      res.status(201).send({
        message: 'Usuário cadastrado com sucesso'
      });
    }).catch(() => {
      res.status(400).send({
        message: 'Erro ao cadastrar usuário'
      });
    });
});
