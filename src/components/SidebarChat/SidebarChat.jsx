import React, { useEffect, useState } from "react";
import "./SidebarChat.css";
import { Avatar } from "@mui/material";
import { Link } from "react-router-dom";
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
  collectionGroup,
} from "firebase/firestore";
import { db } from "../../firebase";

const SidebarChat = ({ id, name, addNewChat, updateRooms }) => {
  const [seed, setSeed] = useState("");
  const collectionRef = collection(db, "rooms");
  const [messages, setMessages] = useState("");
  useEffect(() => {
    if (id) {
      const fetchTodo = async () => {
        try {
          const messagesCollection = collection(db, "rooms", id, "messages");
          const messagesQuery = query(
            messagesCollection,
            orderBy("timestamp", "desc")
          );

          const messagesSnapshot = await getDocs(messagesQuery);
          const messagesData = messagesSnapshot.docs.map((doc) => doc.data());
          setMessages(messagesData);
        } catch (error) {
          console.error("Error fetching messages", error);
        }
      };
      fetchTodo();
    }
  }, [id, messages]);

  const createChat = async () => {
    const roomName = prompt("please enter name for Chat");
    const newName = {
      name: roomName,
    };
    if (roomName) {
      try {
        // Add the new todo to the Firestore collection
        const docRef = await addDoc(collectionRef, newName);
        updateRooms({ ...newName, id: docRef.id });
      } catch (error) {
        console.error("Error adding name: ", error);
      }
    }
  };
  useEffect(() => {
    setSeed(Math.floor(Math.random() * 5000));
  }, []);
  return !addNewChat ? (
    <Link to={`/rooms/${id}`}>
      <div className="sidebarChat">
        <Avatar
          src={`https://api.dicebear.com/7.x/adventurer/svg?seed=${seed}`}
        />
        <div className="sidebarChat_info">
          <h2>{name}</h2>
          <p>{messages[0]?.message}</p>
        </div>
      </div>
    </Link>
  ) : (
    <div onClick={createChat} className="sidebarChat">
      <h2>Add New Chat</h2>
    </div>
  );
};

export default SidebarChat;
