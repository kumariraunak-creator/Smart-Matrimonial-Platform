import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { io } from "socket.io-client";
import { MessageCircle, Send } from "lucide-react";
import "./Chat.css";

const API_URL = "http://localhost:5000/api";
const SOCKET_URL = "http://localhost:5000";

function Chat() {
  const [matches, setMatches] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [message, setMessage] = useState("");

  const socketRef = useRef(null);
  const messagesEndRef = useRef(null);

  const token = localStorage.getItem("token");

  const currentUser = JSON.parse(
    localStorage.getItem("user") || "{}"
  );

  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  // ---------------- SOCKET CONNECTION ----------------

  useEffect(() => {
    if (!token) return;

    socketRef.current = io(SOCKET_URL, {
      auth: {
        token,
      },
    });

    socketRef.current.on("connect", () => {
      console.log("Socket Connected");
    });

    socketRef.current.on("receiveMessage", (incomingMessage) => {
      if (
        selectedUser &&
        (
          incomingMessage.sender?._id === selectedUser._id ||
          incomingMessage.sender === selectedUser._id ||
          incomingMessage.receiver?._id === selectedUser._id ||
          incomingMessage.receiver === selectedUser._id
        )
      ) {
        setMessages((prev) => [...prev, incomingMessage]);
      }
    });

    return () => {
      socketRef.current.disconnect();
    };
  }, [selectedUser]);

  // ---------------- AUTO SCROLL ----------------

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages]);

  // ---------------- LOAD MATCHES ----------------

  useEffect(() => {
    fetchMatches();
  }, []);

  const fetchMatches = async () => {
    try {
      const response = await axios.get(
        `${API_URL}/interests/matches`,
        config
      );

      setMatches(response.data.matches || []);
    } catch (error) {
      setMessage(
        error.response?.data?.message ||
          "Failed to load matches"
      );
    }
  };

  // ---------------- MATCH USER ----------------

  const getMatchUser = (match) => {
    return (
      match.matchedUser ||
      match.user ||
      match.sender ||
      match.receiver
    );
  };

  // ---------------- OPEN CHAT ----------------

  const openConversation = async (match) => {
    const user = getMatchUser(match);

    if (!user?._id) {
      setMessage("Unable to open conversation");
      return;
    }

    setSelectedUser(user);

    try {
      const response = await axios.get(
        `${API_URL}/chat/${user._id}`,
        config
      );

      setMessages(response.data.messages || []);

      await axios.put(
        `${API_URL}/chat/read/${user._id}`,
        {},
        config
      );
    } catch (error) {
      setMessage(
        error.response?.data?.message ||
          "Failed to load conversation"
      );
    }
  };

  // ---------------- SEND MESSAGE ----------------

  const sendMessage = async (e) => {
    e.preventDefault();

    if (!selectedUser) return;

    if (!newMessage.trim()) return;

    try {
      const response = await axios.post(
        `${API_URL}/chat/send/${selectedUser._id}`,
        {
          message: newMessage.trim(),
        },
        config
      );

      if (response.data.data) {
        setMessages((prev) => [
          ...prev,
          response.data.data,
        ]);
      }

      setNewMessage("");
    } catch (error) {
      setMessage(
        error.response?.data?.message ||
          "Failed to send message"
      );
    }
  };

    return (
    <div className="chat-page">
      <header className="chat-header">
        <div>
          <span>YOUR CONVERSATIONS</span>
          <h1>Connect With Your Matches.</h1>
          <p>
            Continue meaningful conversations with your accepted
            matrimonial connections.
          </p>
        </div>

        <a href="/dashboard">← Dashboard</a>
      </header>

      {message && (
        <div className="chat-message">{message}</div>
      )}

      <section className="chat-layout">

        {/* ---------- LEFT SIDEBAR ---------- */}

        <aside className="chat-sidebar">
          <h2>Your Matches</h2>

          <div className="chat-match-list">
            {matches.length === 0 ? (
              <p className="chat-empty">
                No accepted matches yet.
              </p>
            ) : (
              matches.map((match) => {
                const user = getMatchUser(match);

                return (
                  <button
                    key={match.interestId}
                    className={`chat-match-item ${
                      selectedUser?._id === user?._id
                        ? "chat-match-active"
                        : ""
                    }`}
                    onClick={() =>
                      openConversation(match)
                    }
                  >
                    <div className="chat-avatar">
                      {user?.name
                        ?.charAt(0)
                        .toUpperCase() || "M"}
                    </div>

                    <div>
                      <strong>
                        {user?.name || "Your Match"}
                      </strong>

                      <span>
                        {user?.email ||
                          "Accepted Match"}
                      </span>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </aside>

        {/* ---------- CHAT PANEL ---------- */}

        <main className="conversation-panel">

          {!selectedUser ? (

            <div className="conversation-placeholder">

              <MessageCircle size={60} />

              <h2>Select a Match</h2>

              <p>
                Start chatting with your accepted
                matrimonial match.
              </p>

            </div>

          ) : (

            <>

              {/* HEADER */}

              <div className="conversation-heading">

                <div className="chat-avatar">
                  {selectedUser.name
                    ?.charAt(0)
                    .toUpperCase()}
                </div>

                <div>
                  <h2>{selectedUser.name}</h2>
                  <p>{selectedUser.email}</p>
                </div>

              </div>

              {/* MESSAGES */}

              <div className="messages-container">

                {messages.length === 0 ? (

                  <p className="chat-empty">
                    No messages yet.
                    Say Hello 👋
                  </p>

                ) : (

                  messages.map((chatMessage) => {

                    const senderId =
                      chatMessage.sender?._id ||
                      chatMessage.sender;

                    const mine =
                      senderId === currentUser._id;

                    return (

                      <div
                        key={chatMessage._id}
                        className={`message-bubble ${
                          mine
                            ? "sent-message"
                            : "received-message"
                        }`}
                      >

                        <p>
                          {chatMessage.message}
                        </p>

                        <small>
                          {new Date(
                            chatMessage.createdAt
                          ).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </small>

                      </div>

                    );
                  })

                )}

                <div ref={messagesEndRef}></div>

              </div>

              {/* INPUT */}

              <form
                className="message-form"
                onSubmit={sendMessage}
              >

                <input
                  type="text"
                  placeholder="Type your message..."
                  value={newMessage}
                  onChange={(e) =>
                    setNewMessage(e.target.value)
                  }
                />

                <button type="submit">

                  <Send size={20} />

                </button>

              </form>

            </>

          )}

        </main>

      </section>

    </div>
  );
}

export default Chat;