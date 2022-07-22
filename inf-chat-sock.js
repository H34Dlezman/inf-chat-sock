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
function saveMessages(msg) {

  var message = msg

  var author = ""
  var authorInd = -1
  if ( (authorInd=message.indexOf("@aka")) >= 0 ) {
    author = message.slice(Math.min(message.length-1, authorInd+4))
    message = message.slice(0, authorInd)
  }

  messages = [{message, author}, ...messages]


  if (msg == "/del-allLOLOLOL") {
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
	
  socket.on("msg", message => {
		saveMessages(message)
		io.emit("msgs", messages);
  });
});

io.listen(8765);

