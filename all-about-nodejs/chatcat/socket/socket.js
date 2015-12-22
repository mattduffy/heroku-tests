module.exports = (io, rooms)=>{
  var chatrooms = io.of('/roomlist')
  .on('connection', function(socket){
    console.log("Connection established on the server!");
    socket.emit('roomupdate', JSON.stringify(rooms));

    socket.on('new_room', function(data){
      rooms.push(data);
      console.log(rooms);
      socket.broadcast.emit('roomupdate', JSON.stringify(rooms));
      socket.emit('roomupdate', JSON.stringify(rooms));
    });
  });

  var messages = io.of('/messages')
    .on('connection', function(socket){
      console.log('connected to the chatroom!');
      socket.on('joinroom', function(data){
        socket.username = data.user;
        socket.userPic = data.userPic;
        socket.join(data.room);
        updateUserList(data.room,true);
      });

    socket.on('newMessage', function(data){
      socket.broadcast.to(data.room_number).emit('meesagefeed', JSON.stringify(data));
    });

    function updateUserList(room,updateAll){
      var getUsers = io.of('/messages').clients(room);
      var userList = [];
      for(var i in getUsers){
        userList.push({
          user:     getUsers[i].username,
          userPic:  getUsers[i].userPic
        });
      }
      userList = JSON.stringify(userList);
      socket.to(room).emit('updateUserList', userList);
      if(updateAll){
        socket.broadcast.to(room).emit('updateUserList', userList);
      }
    }

    socket.on('updateList', function(data){
      console.log("debug updatList: ", data);
      updateUserList(data.room, true);
    });
  });



};
