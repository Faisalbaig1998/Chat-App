const WebSocket = require("ws");
const { v4: uuidv4 } = require("uuid");

const wss = new WebSocket.Server({ port: 8080 });
const clients = new Map();

wss.on("connection", (ws) => {
  const clientId = uuidv4(); // Generate a unique ID for the client
  clients.set(clientId, { ws, username: null }); // Store client and their username

  console.log(`New client connected: ${clientId}`);

  // Handle incoming messages
  ws.on("message", (message) => {
    const clientData = clients.get(clientId);

    if (!clientData.username) {
      // If the username is not set, treat the first message as the username
      clientData.username = message.toString();
      console.log(`Username set for client ${clientId}: ${clientData.username}`);
      return;
    }

    const broadcastMessage = {
      sender: clientData.username,
      text: message.toString(),
    };

    // Broadcast the message to all connected clients
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(broadcastMessage)); // Send as JSON
      }
    });
  });

  ws.on("close", () => {
    const clientData = clients.get(clientId);
    console.log(`Client disconnected: ${clientId} (${clientData.username})`);

    // Notify all other clients about the disconnection
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify({ sender: "Server", text: `${clientData.username} has left the chat.` }));
      }
    });

    // Remove the client from the map
    clients.delete(clientId);
  });
});

console.log("WebSocket server started on localhost at port 8080");
