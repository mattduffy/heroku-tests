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


};
