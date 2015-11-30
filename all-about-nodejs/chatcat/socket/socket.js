module.exports = (io)=>{
  var chatrooms = io.of('/roomlist').on('connection', function(socket){
    console.log("Connection established on the server!");
  });

};
