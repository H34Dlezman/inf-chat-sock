const fs = require("fs");
const { Server } = require("socket.io");
const io = new Server({
        cors: {
                origin: "http://localhost:5678"
        }
});

messages = []
function saveMessages() {
  fs.writeFile('./messages.infc', JSON.stringify(messages), ()=>{})
}
try {
  messages = JSON.parse(fs.readFileSync('./messages.infc', 'utf8'))
} catch (err) {
  saveMessages()
  console.error(err);
}

io.on("connection", socket => {
  //console.log("client connected")
	
	socket.emit("msgs", messages)
	
  socket.on("msg", message => {
		messages = messages.concat(message)
		saveMessages()
		io.emit("msgs", messages);
  });
});

io.listen(8765);

