import express from "express"; 
const app = express();
import http from "http";
const server = http.createServer(app);
import { Server } from "socket.io";
const io = new Server(server);
import path from "path";

app.get("/", (req, res) => {
	const htmlPath = path.join(__dirname, "..", "public", "index.html");
	res.sendFile(htmlPath);
});

io.on("connection", (socket) => {
	console.log("a user connected");
	socket.on("disconnect", () => {
		console.log("user disconnected");
	});
	socket.on("chat message", (msg) => {
		console.log("message: " + msg);
		io.emit("chat message", msg);
	});
});

server.listen(3000, () => {
	console.log("listening on *:3000");
});