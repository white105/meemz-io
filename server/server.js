var express       = require('express'),
    http          = require("http"),
    session       = require('express-session'),
    path          = require('path'),
    fs            = require('fs'),
    cors          = require('cors'),
    bodyParser    = require('body-parser'),
    socketIo = require("socket.io"),
    indexRoutes   = require('./routes/index');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.set('view engine', 'html');
app.engine('html', function (path, options, callbacks) {
  fs.readFile(path, 'utf-8', callback);
});

app.use(express.static(path.join(__dirname, '../app')));

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(session({
  secret : 'secret',
  resave : false,
  saveUninitialized : true,
  cookie: { path    : '/', secure: false, maxAge  : 20000 }
}));


app.use(function(req, res, next) {
  next();
});

var numUsers = 0;

io.on('connection', socket => {
  var addedUser = false;

  console.log("I am connected!", socket.id)

  socket.on("room", connection => {

    console.log("connection", connection)

    console.log("i am in da room!", connection.id)
    socket.join(connection.id);
    socket.room = connection.id;
    socket.nickname = connection.nickname;
    socket.in(connection.id).emit("new_joiner", connection.nickname);
  });


  socket.on('message', message => {
    console.log(message)
    socket.in(message.id).broadcast.emit('message', {
      body: message.body,
      from: message.from
    })
  })

  socket.on('memes_recieved_event', (memes) => {

    let collection = memes

    num_memes = collection.length;

    memes_per_user = (numUsers > 0) ? (num_memes / numUsers) : 6

    var random_nums = []
    var current_user_memes = []
    var random_int = Math.floor(Math.random() * memes.length);

    for (var i=0; i<memes_per_user; i++) {
      random_int = Math.floor(Math.random() * collection.length);

      //makes sure random int isn't a duplicate
      while (random_nums.includes(random_int)) {
        random_int = Math.floor(Math.random() * collection.length);
      }

      random_nums.push(random_int)
      current_user_memes.push(collection[random_int])
    }

    io.to(`${socket.id}`).emit('current_player_memes', current_user_memes);
  });

})

  /*
  socket.on('submitted_meme_url', meme_url => {
    console.log("server submit", meme_url)
    socket.broadcast.emit('submitted_meme_url', meme_url)
  });
  */


  /*

  socket.on("room", connection => {
    socket.join(connection.id);
    socket.room = connection.id;
    socket.nickname = connection.nickname;
    socket.in(connection.id).emit("new_joiner", connection.nickname);
  });

  */


/*
// when the client emits 'add user', this listens and executes
io.on('add user', (username) => {
  if (addedUser) return;

  // we store the username in the socket session for this client
  socket.username = username;
  ++numUsers;
  addedUser = true;
  socket.emit('login', {
    numUsers: numUsers
  });
  // echo globally (all clients) that a person has connected
  socket.broadcast.emit('user joined', {
    username: socket.username,
    numUsers: numUsers
  });
});

// when the client emits 'typing', we broadcast it to others
io.on('typing', () => {
  socket.broadcast.emit('typing', {
    username: socket.username
  });
});

// when the client emits 'stop typing', we broadcast it to others
io.on('stop typing', () => {
  socket.broadcast.emit('stop typing', {
    username: socket.username
  });
});


// when the user disconnects.. perform this
io.on('disconnect', () => {
  if (addedUser) {
    --numUsers;

    // echo globally that this client has left
    socket.broadcast.emit('user left', {
      username: socket.username,
      numUsers: numUsers
    });
  }
});
*/

/* split up the cards between number of users

socket.on('memes', (memes) => {
  num_memes = memes.length;
  memes_per_user = num_memes / numUsers
  var current_user_memes = []
  var random_int = Math.floor(Math.random() * memes.length);

  for (var i=0; i<memes_per_user; i++) {
    while (current_user_memes.indexOf(random_int) > -1) {
      random_int = Math.floor(Math.random() * memes.length);
      console.log('random_int', random_int)
    }
    current_user_memes.push(memes[i])
  }

  socket.emit('current_user_memes', {
    current_user_memes: current_user_memes
  });
});

*/

app.use('/', indexRoutes);

server.listen(3000)

//server.listen(process.env.PORT || 5000)
