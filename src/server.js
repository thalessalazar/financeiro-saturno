const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = process.env.PORT || 3333

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

require('./app/controllers/index')(app);

app.listen(port, (err) => {
    if (err) console.log('Não foi possível iniciar servidor');
    else console.log('Servidor rodando');
});