
// external imports
const http = require("http");
const path = require("path");
const express = require('express');
const morgan = require('morgan');
const dotenv = require('dotenv');
const mongoose = require('mongoose');


// Internal imports
const { errorHandler, notFound } = require('./middlewares/errorMiddleware');
const connectDB = require('./config/db');


// Load env vars
// dotenv.config({ path: './config/config.env' });
// dotenv.config()
dotenv.config({ path: './backend/.env' });

// Connect to database
mongoose.set('strictQuery', false);
connectDB();

// Route files
const usersRoute = require("./routes/usersRoute");
const blogsRoute = require("./routes/blogsRoute");
const blogActionsRoute = require("./routes/blogActionsRoute");




const app = express();

// Body parser
app.use(express.json());

// Dev logging middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}


// routes mount
app.use("/api/users", usersRoute);
app.use("/api/blogs", blogsRoute);
app.use("/api/blog-actions", blogActionsRoute);


// config server
const server = http.createServer(app);


// socket io
const io = require("socket.io")(server, {
  cors: {
    origin: "*",
  },
});

io.on("connection", (socket) => {
    // join room
    socket.on("join", (userId) => {
        socket.join(userId);
    });

    // listen for new notification
    socket.on("newNotification", (notification) => {
        socket.to(notification.userId).emit("newNotification", notification);
    });
});




// render deployment
__dirname = path.resolve();
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "/client/build")));
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "client", "build", "index.html"));
  });
} else {
  app.get('/', (req, res) => {
    res.send('API is running....')
  })
}


app.use(notFound);
app.use(errorHandler);


// listen server
const port = process.env.PORT || 5000;

server.listen(port, ()=> {
  console.log(`Server is running on port: ${port}`);
})