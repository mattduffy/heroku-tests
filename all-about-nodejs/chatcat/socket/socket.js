module.exports = (io, rooms)=>{
  var chatrooms = io.of('/roomlist').on('connection', function(socket){
    console.log("Connection established on the server!");
  });

};
