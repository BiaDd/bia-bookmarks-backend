const express = require('express');
const cors = require('cors');
const router = require('./src/router');
const app = express();
const port = process.env.PORT || 8000;


app.use(cors());

app.listen(port, () => {
    console.log(`app listening on port ${port}`);
});

app.use("/", router);
