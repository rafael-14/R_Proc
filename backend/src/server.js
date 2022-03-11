//npm instal express pg bcrypt pg-hstore sequelize nodemon routes path cors cookie-parser concurrently
//npm install -g create-react-app
//rodar no powershell: Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
const express = require('express');
const cookieParser = require('cookie-parser');
const app = express();
const routes = require('./routes');
const port = 5000 //|| process.env.PORT  
const cors = require('cors');

app.use(cors())
app.use(cookieParser())


require('./database');

app.use(express.json()); //serve para receber e enviar json do front para o back
app.use(routes);

app.listen(port, function(){
    console.log(`Servidor rodando na porta ${port}`)
});

