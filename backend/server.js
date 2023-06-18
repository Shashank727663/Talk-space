const express = require("express");
const chat = require("./data/data");
const app = express();
const dotenv = require("dotenv");
const connectdb = require("./db")
const userRoutes = require('./Routes/userRoutes');
const chatRoutes = require('./Routes/chatRoutes')
const {notFound , errorHandler} = require('./middlewares/errorMiddleware')
dotenv.config();
connectdb()
app.use(express.json());
app.get("/", (req, res) => {
  res.send("API running");
});

const port =  5000;

app.use('/api/user',userRoutes);
app.use('/api/chat',chatRoutes);
// Error Handling middlewares
app.use(notFound);
app.use(errorHandler);



app.listen(port, () => {
  console.log(`Server is listening on port ${port}!`);
});
