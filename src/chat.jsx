import React from "react";

const Chat = ({ user, onLogout }) => {
  return (
    <div>
      <h2>Bienvenido, {user.email}</h2>
      <p>Aquí irá la funcionalidad del chat.</p>
      <button onClick={onLogout}>Cerrar sesión</button>
    </div>
  );
};

export default Chat;
