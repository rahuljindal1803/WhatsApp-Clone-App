import React, { useState, useEffect } from "react";

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
import { db } from "../../firebase";
import "./sidebar.css";
import SidebarChat from "../SidebarChat/SidebarChat";
import SettingsIcon from "@mui/icons-material/Settings";
import { Avatar, Button } from "@mui/material";
import DonutLargeIcon from "@mui/icons-material/DonutLarge";
import ChatIcon from "@mui/icons-material/Chat";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import IconButton from "@mui/material/IconButton";
import SearchIcon from "@mui/icons-material/Search";
import LogoutIcon from "@mui/icons-material/Logout";

const SideBar = ({ onLogout, user }) => {
  const collectionRef = collection(db, "rooms");
  const [rooms, setRooms] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  const updateRooms = (newRoom) => {
    setRooms((prev) => [...prev, newRoom]);
  };
  const logOut = () => {
    onLogout(null);
  };
  useEffect(() => {
    const getRoom = () => {
      const q = query(collectionRef);
      getDocs(q)
        .then((rooms) => {
          let roomData = rooms.docs.map((doc) => ({
            ...doc.data(),
            id: doc.id,
          }));
          setRooms(roomData);
        })
        .catch((err) => {
          console.log(err);
        });
    };
    getRoom();
  }, []);

  const filteredRooms = rooms.filter((room) =>
    room.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  return (
    <div className="sidebar">
      <div className="sidebar_header">
        <Avatar src={user ? user.photoURL : ""} />
        <div className="sidebar_headerRight">
          <IconButton>
            <DonutLargeIcon />
          </IconButton>

          <IconButton>
            <ChatIcon />
          </IconButton>
          <IconButton>
            <MoreVertIcon />
          </IconButton>
          <IconButton onClick={logOut}>
            <LogoutIcon />
          </IconButton>
        </div>
      </div>
      <div className="sidebar_search">
        <div className="sidebar_searchContainer">
          <SearchIcon />
          <input
            placeholder="search or start new chat"
            type="text"
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>
      <div className="sidebar_chats">
        <SidebarChat addNewChat updateRooms={updateRooms} />

        {filteredRooms.map((room) => (
          <SidebarChat key={room.id} id={room.id} name={room.name} />
        ))}
      </div>
    </div>
  );
};

export default SideBar;
