import React, { useContext, useEffect, useState, useRef } from "react";
import "./Chat.css";
import { useParams } from "react-router-dom";

import {
  QuerySnapshot,
  addDoc,
  doc,
  collection,
  getDocs,
  orderBy,
  onSnapshot,
  query,
  serverTimestamp,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import { getDoc } from "firebase/firestore";
import { db } from "../../firebase";

import { Avatar } from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import IconButton from "@mui/material/IconButton";
import SearchIcon from "@mui/icons-material/Search";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import InsertEmoticonIcon from "@mui/icons-material/InsertEmoticon";
import MicIcon from "@mui/icons-material/Mic";
import UserContext from "../features/useContext";

const Chat = () => {
  const [seed, setSeed] = useState("");
  const [input, setInput] = useState("");
  const { roomId } = useParams();
  const [roomName, setRoomName] = useState("");
  const [messages, setMessages] = useState([]);
  const user = useContext(UserContext);
  const messageContainerRef = useRef();
  useEffect(() => {
    const fetchTodo = async () => {
      try {
        const roomDocument = doc(db, "rooms", roomId);
        const roomSnapshot = await getDoc(roomDocument);

        if (roomSnapshot.exists()) {
          // Document with the specified ID exists
          setRoomName(roomSnapshot.data());
        } else {
          // Document with the specified ID does not exist
          console.log("Room not found");
        }
        const messagesCollection = collection(db, "rooms", roomId, "messages");
        const messagesQuery = query(messagesCollection, orderBy("timestamp"));

        const unsubscribe = onSnapshot(messagesQuery, (querySnapshot) => {
          const messagesData = querySnapshot.docs.map((doc) => doc.data());
          setMessages(messagesData);
        });

        // Clean up the listener when the component unmounts
        return () => unsubscribe();
      } catch (error) {
        console.error("Error fetching todo:", error.message);
      }
    };

    fetchTodo();
  }, [roomId]);

  const numAvatar = Math.floor(Math.random() * 5000);

  useEffect(() => {
    setSeed(numAvatar);
  }, []);
  useEffect(() => {
    const messageContainer = messageContainerRef.current;
    if (messageContainer) {
      messageContainer.scrollIntoView({
        behavior: "smooth",
        block: "end",
        inline: "nearest",
      });
    }
  }, [messages]);
  const sendMessage = async (e) => {
    e.preventDefault();

    if (input.trim() === "") {
      return;
    }

    try {
      const messagesCollection = collection(db, "rooms", roomId, "messages");

      await addDoc(messagesCollection, {
        message: input,
        name: user.displayName,
        timestamp: serverTimestamp(),
      });
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          message: input,
          name: user.displayName,
          timestamp: serverTimestamp(),
        },
      ]);

      setInput("");
    } catch (error) {
      console.error("Error adding message:", error.message);
    }

    setInput("");
  };
  const formatDate = (timestamp) => {
    const date = new Date(timestamp.seconds * 1000);
    const formattedDate = `${date.getDate()}/${
      date.getMonth() + 1
    }/${date.getFullYear()}, ${date.toLocaleTimeString()}`;
    return formattedDate;
  };

  return (
    <div className="chat">
      <div className="chat_header">
        <Avatar
          src={`https://api.dicebear.com/7.x/adventurer/svg?seed=${seed}`}
        />
        <div className="chat_headerInfo">
          <h3>{roomName.name}</h3>
          <p>Last Seen....</p>
        </div>
        <div className="chat_headerRight">
          <IconButton>
            <SearchIcon />
          </IconButton>
          <IconButton>
            <AttachFileIcon />
          </IconButton>
          <IconButton>
            <MoreVertIcon />
          </IconButton>
        </div>
      </div>
      <div className="chat_body">
        {messages.map((message, index) => (
          <p
            className={`chat_message ${
              message.name === user.displayName && "chat_receiver"
            }`}
            key={index}
            ref={messageContainerRef}
          >
            <span className="chat_name">{message.name}</span>
            {message.message}{" "}
            {/* Access the specific property containing the message content */}
            <span className="chat_timeStamp">
              {new Date(message.timeStamp).toString()}
            </span>
          </p>
        ))}
      </div>
      <div className="chat_footer">
        <IconButton>
          <InsertEmoticonIcon />
        </IconButton>
        <form onClick={sendMessage}>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type a message..."
            type="text"
          />
          <button type="submit">Send a message</button>
        </form>
        <IconButton>
          <MicIcon />
        </IconButton>
      </div>
    </div>
  );
};

export default Chat;
