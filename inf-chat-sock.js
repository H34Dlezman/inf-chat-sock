const fs = require("fs");
const { Server } = require("socket.io");
const io = new Server({
        cors: {
          origin: "*"
                //origin: "http://localhost:5678"
                //origin:"http://107.189.13.101:5678"
        }
});

messages = []
function saveMessages(message, author) {

  messages = [{message, author}, ...messages]
  if (message == "/del-allLOLOLOL") {
    messages = []
  }

  fs.writeFile('./messages.infc', JSON.stringify(messages), ()=>{})
}
try {
  messages = JSON.parse(fs.readFileSync('./messages.infc', 'utf8'))
} catch (err) {
  saveMessages()
  console.error(err);
}

io.on("connection", socket => {
  console.log("client connected")
	
	socket.emit("msgs", messages)
	
  socket.on("msg", {message, author} => {
		saveMessages(message, author)
		io.emit("msgs", messages);
  });
});

io.listen(8765);

