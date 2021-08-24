const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const errorHandler = require('./middlewares/error');
const cookieParser = require('cookie-parser');
const connectDB = require('./config/db');


// ルートの読み込み
const user = require('./routes/users')
const auth = require('./routes/auth')
const LorB = require('./routes/lendOrBorrow')
//コンフィグファイルの読み込み
dotenv.config({ path:'./config/config.env' });

//データベースと繋がる
connectDB();

const app = express();

//CORSの設定
app.use(cors({
    credentials:true,
    origin:"http://localhost:3000"
}))

//jsonを取得できるようにパースする
app.use(express.json())

//cookieをパースする
app.use(cookieParser())

//routerをマウント
app.use('/user',user);
app.use('/auth',auth);
app.use('/LorB',LorB);

app.use(errorHandler)


const PORT = process.env.PORT || 5000;

const server = app.listen( 
    PORT, console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`) 
);

//サーバーで何らかのエラーがあった場合
process.on('unhandledRejection', (err, promise) => {
    console.log(`Error: ${err.message}`);
    //エラーがあった場合サーバーを閉じる
    server.close(() => process.exit(1));
});



