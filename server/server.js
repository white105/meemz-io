var express       = require('express'),
    http          = require("http"),
    session       = require('express-session'),
    path          = require('path'),
    fs            = require('fs'),
    cors          = require('cors'),
    bodyParser    = require('body-parser'),
    socketIo      = require("socket.io"),
    indexRoutes   = require('./routes/index'),
    axios         = require('axios');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.set('view engine', 'html');
app.engine('html', function (path, options, callbacks) {
  fs.readFile(path, 'utf-8', callback);
});


//this.setState({ nickname : String(cookie_parts[1]) }, () => { console.log(this.state.nickname) })
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

var memes = undefined

axios.get('https://api.imgflip.com/get_memes')
  .then((response) => {
    memes = response.data.data.memes;
})
.catch(function (error) {
  console.log(error);
});


io.on('connection', socket => {
  var addedUser = false;

  socket.on("room", connection => {

    console.log("connection to room", connection)

    socket.join(connection.room_id);
    socket.room = connection.room_id;
    socket.nickname = connection.nickname;
    connection.id = socket.id;

    io.to(`${String(connection.id)}`).emit('client_id', connection.id);

    console.log("client id", socket.id)

    //list of clients in specific game room
    var clients = io.sockets.adapter.rooms[socket.room].sockets;
    let numPeople = clients.length;

    if (numPeople >= 9) {
      socket.leave(connection.room_id)
    }

    socket.on("winner", winner_client_id => {

      console.log("this is the winner", winner_client_id)

      var winner = winner_client_id

      for (var client in clients) {
        if (clients.hasOwnProperty(client)) {
          io.to(`${String(client)}`).emit('win', winner);
        }
      }
    });



    /* might wanna leave room
    if(socket.room)
        socket.leave(socket.room);

    socket.room = room;
    socket.join(room);
    */


    socket.in(connection.room_id).emit("new_joiner", connection.nickname);

    //TODO: logic to pick dealer / players (needs work)
    var dealer = String(Object.keys(clients)[0]);
    console.log("This is the dealer!", dealer)
    io.to(`${dealer}`).emit('dealer', true);

    console.log("deal event happened")

    socket.on('meme_submission', meme_submission => {

      /*
      var meme_submission = {
        captioned_meme : captioned_image_url,
        nickname: this.state.nickname
      }
      */

      console.log("server submit", meme_submission)
      console.log("dealer", dealer)

      io.to(`${dealer}`).emit('meme_submission', meme_submission);
    });

    let collection = memes

    num_memes = collection.length;

    var numPlayers = Object.keys(clients).length;

    memes_per_user = (numPlayers > 0) ? (num_memes / numPlayers-1) : 8

    var random_nums = []
    var random_int = Math.floor(Math.random() * memes.length);

    //loops through everyone in room
    for (var client in clients) {
      var player_cards = []
      if (clients.hasOwnProperty(client)) {

        //if client is player send them cards
        if (client != dealer) {
          for (var i=0; i<memes_per_user; i++) {
            random_int = Math.floor(Math.random() * collection.length);
            //makes sure random int isn't a duplicate
            while (random_nums.includes(random_int)) { random_int = Math.floor(Math.random() * collection.length) }
            random_nums.push(random_int)
            player_cards.push(collection[random_int])
          }
          io.to(`${String(client)}`).emit('cards', player_cards);
        }
      }
    }

  });

  socket.on("captions", captions => {
    socket.in(socket.room).emit("captions", captions);
  });

  socket.on("message", msg => {

    console.log("msg", msg)

    console.log('socket.nickname', socket.nickname)
    console.log('msg.body', msg.body)
    socket.in(socket.room).emit("message", {
      from: socket.nickname,
      body: msg.body
    });
  });


  socket.on("new_round", round => {

    let players = round.players;
    let dealer = players[0]

    socket.in(socket.room).emit("message", {
      from: socket.nickname,
      body: msg.body
    });
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

//server.listen(3000)

server.listen(process.env.PORT || 5000)
