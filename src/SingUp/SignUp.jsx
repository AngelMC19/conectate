import React, { useState } from "react";
import { auth } from "../firebaseConfig"; // Importa Firebase Authentication
import { createUserWithEmailAndPassword, sendEmailVerification } from "firebase/auth"; // Agrega sendEmailVerification
import { db } from "../firebaseConfig"; // Importa Firestore
import { setDoc, doc } from "firebase/firestore"; // Para guardar los datos en Firestore
import './SignUp.css';

const SignUp = ({ onSwitchToLogin }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState(""); // Campo para el nombre
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(""); // Limpiamos los errores previos

    // Verifica si las contraseñas coinciden
    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden");
      return;
    }

    try {
      // Crea el usuario en Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Guarda los datos del usuario en Firestore usando el UID como ID del documento
      await setDoc(doc(db, "usuarios", user.uid), {
        nombre: name,
        email: user.email,
        creadoEn: new Date().toISOString(), // Fecha de creación del usuario
      });

      // Envía el correo de verificación
      await sendEmailVerification(user);

      // Mensaje de éxito
      setMessage("Usuario registrado con éxito. Por favor, verifica tu correo.");

      // Opción: Redirigir al login después de un tiempo o esperar confirmación manual
      setTimeout(() => {
        onSwitchToLogin(); // Redirigir a la página de inicio de sesión
      }, 3000); // Redirige después de 3 segundos

    } catch (error) {
      setError("Error al registrar el usuario: " + error.message);
    }
  };

  return (
    <div className="signup-container">
      <h2>Sign Up</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {message && <p style={{ color: "green" }}>{message}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Nombre:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Confirm Password:</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Sign Up</button>
      </form>
      <p>
        ¿Ya tienes una cuenta?{" "}
        <span 
          onClick={onSwitchToLogin}
          style={{ color: "blue", cursor: "pointer" }}
        >
          Inicia sesión aquí
        </span>
      </p>
    </div>
  );
};

export default SignUp;
