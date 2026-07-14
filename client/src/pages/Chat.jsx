import { useEffect, useState } from "react";
import axios from "axios";
import { MessageCircle, Send } from "lucide-react";
import "./Chat.css";

const API_URL =
  "https://smart-matrimonial-platform.onrender.com/api";

function Chat() {
  const [matches, setMatches] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [message, setMessage] = useState("");

  const token = localStorage.getItem("token");

  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  useEffect(() => {
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

    fetchMatches();
  }, []);

  const getMatchUser = (match) => {
    return (
      match.user ||
      match.matchedUser ||
      match.sender ||
      match.receiver
    );
  };

  const openConversation = async (match) => {
    const user = getMatchUser(match);

    if (!user?._id) {
      setMessage("Unable to open this conversation");
      return;
    }

    setSelectedUser(user);
    setMessage("");

    try {
      const response = await axios.get(
        `${API_URL}/chat/${user._id}`,
        config
      );

      setMessages(response.data.messages || []);
    } catch (error) {
      setMessage(
        error.response?.data?.message ||
          "Failed to load conversation"
      );
    }
  };

  const sendMessage = async (event) => {
    event.preventDefault();

    if (!selectedUser || !newMessage.trim()) {
      return;
    }

    try {
      const response = await axios.post(
        `${API_URL}/chat/send`,
        {
          receiverId: selectedUser._id,
          content: newMessage.trim(),
        },
        config
      );

      const sentMessage =
        response.data.messageData ||
        response.data.chatMessage ||
        response.data.data;

      if (sentMessage) {
        setMessages((currentMessages) => [
          ...currentMessages,
          sentMessage,
        ]);
      } else {
        const refreshedConversation = await axios.get(
          `${API_URL}/chat/${selectedUser._id}`,
          config
        );

        setMessages(
          refreshedConversation.data.messages || []
        );
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
            Continue meaningful conversations with accepted
            matrimonial connections.
          </p>
        </div>

        <a href="/dashboard">← Dashboard</a>
      </header>

      {message && (
        <div className="chat-message">{message}</div>
      )}

      <section className="chat-layout">
        <aside className="chat-sidebar">
          <h2>Your Matches</h2>

          <div className="chat-match-list">
            {matches.length === 0 ? (
              <p className="chat-empty">
                No accepted matches available.
              </p>
            ) : (
              matches.map((match) => {
                const user = getMatchUser(match);

                return (
                  <button
                    className={`chat-match-item ${
                      selectedUser?._id === user?._id
                        ? "chat-match-active"
                        : ""
                    }`}
                    key={match._id}
                    onClick={() => openConversation(match)}
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
                          "Accepted connection"}
                      </span>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </aside>

        <main className="conversation-panel">
          {!selectedUser ? (
            <div className="conversation-placeholder">
              <MessageCircle size={55} />

              <h2>Select a Match</h2>

              <p>
                Choose an accepted connection to start chatting.
              </p>
            </div>
          ) : (
            <>
              <div className="conversation-heading">
                <div className="chat-avatar">
                  {selectedUser.name
                    ?.charAt(0)
                    .toUpperCase() || "M"}
                </div>

                <div>
                  <h2>{selectedUser.name}</h2>
                  <p>Accepted matrimonial connection</p>
                </div>
              </div>

              <div className="messages-container">
                {messages.length === 0 ? (
                  <p className="chat-empty">
                    No messages yet. Start the conversation.
                  </p>
                ) : (
                  messages.map((chatMessage) => (
                    <div
                      className={`message-bubble ${
                        chatMessage.sender?._id ===
                          selectedUser._id ||
                        chatMessage.sender ===
                          selectedUser._id
                          ? "received-message"
                          : "sent-message"
                      }`}
                      key={chatMessage._id}
                    >
                      {chatMessage.content ||
                        chatMessage.message}
                    </div>
                  ))
                )}
              </div>

              <form
                className="message-form"
                onSubmit={sendMessage}
              >
                <input
                  type="text"
                  placeholder="Write a message..."
                  value={newMessage}
                  onChange={(event) =>
                    setNewMessage(event.target.value)
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