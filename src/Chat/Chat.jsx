import React, { useState, useEffect, useRef } from "react";
import { collection, setDoc, doc, query, orderBy, onSnapshot, updateDoc, arrayUnion, getDoc } from "firebase/firestore";
import { db } from "../firebaseConfig";
import Search from "../Search/Search";
import './Chat.css';
import palabrasProhibidas from '../Data/palabras_traducidas.json';

const Chat = ({ user, onLogout }) => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [userNames, setUserNames] = useState({});
  const [conversationId, setConversationId] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [conversations, setConversations] = useState([]);
  const [newMessages, setNewMessages] = useState({});
  const [errorMessage, setErrorMessage] = useState(""); // Estado para mensajes de error

  const endOfMessagesRef = useRef(null); // Referencia para el último mensaje

  // Función para obtener el nombre del usuario por UID
  const fetchUserName = async (uid) => {
    if (userNames[uid]) return userNames[uid];
    
    const userDoc = await getDoc(doc(db, "usuarios", uid));
    if (userDoc.exists()) {
      const name = userDoc.data().nombre;
      setUserNames((prevState) => ({ ...prevState, [uid]: name }));
      return name;
    } else {
      return "Desconocido";
    }
  };

  useEffect(() => {
    const unsubscribe = onSnapshot(doc(db, "usuarios", user.uid), (docSnap) => {
      if (docSnap.exists() && docSnap.data().conversaciones) {
        const conversationIds = docSnap.data().conversaciones;
        
        const fetchConversations = async () => {
          const convData = await Promise.all(conversationIds.map(async (convId) => {
            const [user1, user2] = convId.split("_");
            const otherUserId = user1 === user.uid ? user2 : user1;
            const otherUserName = await fetchUserName(otherUserId);

            onSnapshot(query(collection(db, `conversaciones/${convId}/mensajes`), orderBy("hora_envio", "asc")), (snapshot) => {
              if (snapshot.size > 0) {
                const lastMessage = snapshot.docs[snapshot.size - 1].data();
                if (lastMessage.de !== user.uid && convId !== conversationId) {
                  setNewMessages((prev) => ({ ...prev, [convId]: true }));
                }
              }
            });

            return { convId, otherUserId, otherUserName };
          }));
          setConversations(convData);
        };

        fetchConversations();
      }
    });

    return () => unsubscribe();
  }, [user, conversationId]);

  useEffect(() => {
    if (selectedUser) {
      const convId = generateConversationId(user.uid, selectedUser.uid);
      setConversationId(convId);

      const q = query(
        collection(db, `conversaciones/${convId}/mensajes`),
        orderBy("hora_envio", "asc")
      );
      
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const messagesData = querySnapshot.docs.map((doc) => doc.data());
        setMessages(messagesData);
        
        setNewMessages((prev) => ({ ...prev, [convId]: false }));
      });

      return () => unsubscribe();
    }
  }, [selectedUser, user]);

  // Efecto para desplazarse automáticamente al último mensaje
  useEffect(() => {
    if (endOfMessagesRef.current) {
      endOfMessagesRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handleSelectConversation = (conv) => {
    setSelectedUser({ uid: conv.otherUserId, nombre: conv.otherUserName });
    setNewMessages((prev) => ({ ...prev, [conv.convId]: false }));
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!message.trim() || !selectedUser || !conversationId) return;

    // Verificación de palabras prohibidas en ambos idiomas
    const mensajeEnMinusculas = message.toLowerCase();
    const palabraProhibida = Object.entries(palabrasProhibidas).find(
      ([ingles, espanol]) => 
        mensajeEnMinusculas.includes(ingles) || mensajeEnMinusculas.includes(espanol)
    );

    if (palabraProhibida) {
      const [ingles, espanol] = palabraProhibida;
      setErrorMessage(`El mensaje contiene una palabra prohibida y no puede ser enviado.`);
      return;
    }

    try {
      const conversationRef = doc(db, "conversaciones", conversationId);
      const messageId = `${new Date().getTime()}`;

      await setDoc(conversationRef, {
        usuarios: [user.uid, selectedUser.uid],
      }, { merge: true });

      await updateDoc(doc(db, "usuarios", user.uid), {
        conversaciones: arrayUnion(conversationId)
      });
      await updateDoc(doc(db, "usuarios", selectedUser.uid), {
        conversaciones: arrayUnion(conversationId)
      });

      const messageRef = doc(collection(conversationRef, "mensajes"), messageId);
      await setDoc(messageRef, {
        de: user.uid,
        contenido: message,
        hora_envio: new Date().toISOString(),
        estado: "entregado"
      });

      setMessage("");
      setErrorMessage(""); // Limpiar el mensaje de error tras un envío exitoso
    } catch (error) {
      console.error("Error al enviar el mensaje:", error.message);
    }
  };

  return (
    <div className="chat-container">
      <h2>Busca a tus amigos</h2>

      {/* Barra de búsqueda de amigos */}
      <Search user={user} onSelectUser={setSelectedUser} />

      {/* Lista de conversaciones del usuario */}
      <div className="conversations-list">
        <h3>Tus conversaciones</h3>
        {conversations.map((conv) => (
          <div
            key={conv.convId}
            className={`conversation-item ${newMessages[conv.convId] ? "new-message" : ""}`}
            onClick={() => handleSelectConversation(conv)}
          >
            <h2>{conv.otherUserName}</h2>
          </div>
        ))}
      </div>

      {/* Mensajes del chat */}
      {selectedUser && (
        <>
          <h3>Chat con {selectedUser.nombre}</h3>
          <div className="messages-container">
            {messages.map((msg, index) => (
              <div key={index} className={`message ${msg.de === user.uid ? "sent" : "received"}`}>
                <p><strong>{msg.nombre}</strong> {msg.contenido}</p>
                <small>{new Date(msg.hora_envio).toLocaleTimeString()}</small>
              </div>
            ))}
            <div ref={endOfMessagesRef} /> {/* Referencia al último mensaje */}
          </div>

          <form onSubmit={handleSendMessage}>
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Escribe un mensaje..."
            />
            <button type="submit">Enviar</button>
          </form>

          {errorMessage && <p className="error-message">{errorMessage}</p>} {/* Mostrar mensaje de error */}
        </>
      )}

      <button onClick={onLogout}>Cerrar sesión</button>
    </div>
  );
};

// Función para generar el ID único de la conversación
const generateConversationId = (user1Uid, user2Uid) => {
  return [user1Uid, user2Uid].sort().join("_");
};

export default Chat;
