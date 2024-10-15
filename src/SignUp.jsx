import React, { useState } from "react";
import { auth } from "./firebaseConfig"; // Importa Firebase
import { createUserWithEmailAndPassword, sendEmailVerification } from "firebase/auth";

const SignUp = ({ onSwitchToLogin }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
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

      // Envía el correo de verificación
      await sendEmailVerification(user);
      setMessage(`Te hemos enviado un correo de verificación a ${email}. Por favor, revisa tu bandeja de entrada y verifica tu cuenta antes de iniciar sesión.`);

      // Opción: Redirigir al login después de un tiempo o esperar confirmación manual
      setTimeout(() => {
        onSwitchToLogin();
      }, 5000); // Redirige después de 5 segundos

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
