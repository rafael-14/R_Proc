//npm instal express pg bcrypt pg-hstore sequelize nodemon routes path cors cookie-parser concurrently mongoose jsonwebtoken
//npm install -g create-react-app
//rodar no powershell: Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
const express = require('express');
const cookieParser = require('cookie-parser');
const app = express();
const routes = require('./routes');
const port = 5000 //|| process.env.PORT  
const cors = require('cors');
//const mongoose = require('mongoose');

app.use(cors())
app.use(cookieParser())

/*mongoose.connect('mongodb://localhost:27017/R_Proc', {
    useUnifiedTopology:true,
    useNewUrlParser:true
}, function (err){
    if (err) {
        console.log(err)
    }
})*/

require('./database');

app.use(express.json()); //serve para receber e enviar json do front para o back
app.use(routes);

app.listen(port, function(){
    console.log(`Servidor rodando na porta ${port}`)
});

