const express=require("express");
const app=express();
const http=require("http").createServer(app);
const io=require("socket.io")(http);
app.use(express.static(__dirname));

const players={};

io.on("connection",socket=>{
    players[socket.id]={x:0,y:1,z:0};
    io.emit("updatePlayers",players);

    socket.on("move",pos=>{players[socket.id]=pos;io.emit("updatePlayers",players);});

    socket.on("disconnect",()=>{delete players[socket.id]; io.emit("updatePlayers",players);});
});

http.listen(3000,()=>console.log("Server: http://localhost:3000"));
