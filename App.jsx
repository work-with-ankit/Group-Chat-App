import React, { useEffect, useMemo, useState, useRef } from "react";
import { io } from "socket.io-client";
import { Box, Container, Stack, TextField, Typography, Button, Paper } from "@mui/material";

function App() {
  const socket = useMemo(() => io("http://localhost:3000/", { withCredentials: true }), []);
  const [messages, SetMessages] = useState([]);
  const [message, SetMessage] = useState("");
  const [room, SetRoom] = useState("");
  const [socketId, SetSocketId] = useState("");
  const [roomName, SetRoomName] = useState("");
  const messagesEndRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    socket.emit("message", { message, room });
    SetMessage("");
  };

  const joinRoomHandler = (e) => {
    e.preventDefault();
    socket.emit("join-room", roomName);
    SetRoomName("");
  };

  useEffect(() => {
    socket.on("connect", () => {
      SetSocketId(socket.id);
      console.log("connected", socket.id);
    });

    socket.on("receive-message", (data) => {
      console.log(data);
      SetMessages((messages) => [...messages, data]);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          height: "90vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 3,
          backgroundColor: "#f5f5f5",
          borderRadius: 3,
          boxShadow: 3,
        }}
      >
        <Typography variant="h5" align="center" sx={{ fontWeight: "bold", color: "#333" }}>
          Chat Room
        </Typography>
        <Typography variant="body2" align="center" sx={{ color: "gray", mb: 1 }}>
          Your ID: {socketId}
        </Typography>

        {/* Messages Display */}
        <Paper
          sx={{
            flexGrow: 1,
            overflowY: "auto",
            padding: 2,
            borderRadius: 2,
            backgroundColor: "white",
            boxShadow: 1,
            marginBottom: 2,
            maxHeight: "50vh",
          }}
        >
          <Stack spacing={1}>
            {messages.map((m, i) => (
              <Typography
                key={i}
                variant="body1"
                sx={{
                  padding: 1,
                  borderRadius: 2,
                  bgcolor: i % 2 === 0 ? "#90caf9" : "#a5d6a7",
                  color: "black",
                  maxWidth: "80%",
                  alignSelf: i % 2 === 0 ? "flex-start" : "flex-end",
                }}
              >
                {m}
              </Typography>
            ))}
            <div ref={messagesEndRef} />
          </Stack>
        </Paper>

        {/* Join Room Form */}
        <form onSubmit={joinRoomHandler} style={{ display: "flex", gap: "10px" }}>
          <TextField
            value={roomName}
            onChange={(e) => SetRoomName(e.target.value)}
            label="Room Name"
            variant="outlined"
            fullWidth
          />
          <Button type="submit" variant="contained" color="primary">
            Join
          </Button>
        </form>

        {/* Message & Room Input Form */}
        <form onSubmit={handleSubmit} style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
          <TextField
            value={message}
            onChange={(e) => SetMessage(e.target.value)}
            label="Message"
            variant="outlined"
            fullWidth
          />
          <TextField
            value={room}
            onChange={(e) => SetRoom(e.target.value)}
            label="Room"
            variant="outlined"
            fullWidth
          />
          <Button type="submit" variant="contained" color="secondary">
            Send
          </Button>
        </form>
      </Box>
    </Container>
  );
}

export default App;
