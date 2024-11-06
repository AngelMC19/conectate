// Profile.jsx
import React, { useState } from "react";
import { db} from "../firebaseConfig";
import { updateProfile, updatePassword } from "firebase/auth";
import { doc, updateDoc } from "firebase/firestore";
import './Profile.css';

const Profile = ({ user, onBack }) => {
  const [newName, setNewName] = useState(user.displayName || "");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // Función para actualizar el nombre
  const handleUpdateName = async () => {
    try {
      await updateProfile(user, { displayName: newName });
      await updateDoc(doc(db, "usuarios", user.uid), { nombre: newName });
      setMessage("Nombre actualizado correctamente");
      setError("");
    } catch (error) {
      console.error("Error al actualizar el nombre:", error.message);
      setError("Error al actualizar el nombre");
    }
  };

  // Función para actualizar la contraseña
  const handleUpdatePassword = async () => {
    try {
      await updatePassword(user, newPassword);
      setMessage("Contraseña actualizada correctamente");
      setError("");
      setNewPassword("");
    } catch (error) {
      console.error("Error al actualizar la contraseña:", error.message);
      setError("Error al actualizar la contraseña. Asegúrate de haber iniciado sesión recientemente.");
    }
  };

  return (
    <div className="profile-container">
      <h2>Editar Perfil</h2>
      {message && <p className="success-message">{message}</p>}
      {error && <p className="error-message">{error}</p>}
      <div className="profile-field">
        <label>Nombre:</label>
        <input
          type="text"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
        />
        <button onClick={handleUpdateName}>Actualizar Nombre</button>
      </div>
      <div className="profile-field">
        <label>Nueva Contraseña:</label>
        <input
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />
        <button onClick={handleUpdatePassword}>Actualizar Contraseña</button>
      </div>
      <button onClick={onBack} className="back-button">Volver</button>
    </div>
  );
};

export default Profile;
