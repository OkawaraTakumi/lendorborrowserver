const express = require('express')
const dotenv = require('dotenv')

//コンフィグファイルの読み込み
dotenv.config({ path:'./config/config.env' });

const app = express();

const PORT = process.env.PORT || 5000;

app.listen( PORT, console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`) )