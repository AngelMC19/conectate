import React, { useState } from "react";
import { auth } from "../firebaseConfig"; 
import { createUserWithEmailAndPassword, sendEmailVerification } from "firebase/auth"; 
import { db } from "../firebaseConfig"; 
import { setDoc, doc } from "firebase/firestore"; 
import './SignUp.css';

const SignUp = ({ onSwitchToLogin }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState(""); // Campo para el nombre
  const [error, setError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(""); // Limpiamos los errores previos

    // Verifica si las contraseñas coinciden
    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden");
      return;
    }

    if (password.length <8) {
      setError("La contraseña debe tener minimo 8 caracteres");
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
      alert("Por favor, verifica tu correo.");

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
          <label>Confirmar Password:</label>
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