import React, { useState } from "react";
import { auth } from "../firebaseConfig"; // Importa la configuración de Firebase
import { signInWithEmailAndPassword, sendPasswordResetEmail } from "firebase/auth"; // Importa las funciones de login y reset password
import './Login.css';

const Login = ({ onSwitchToSignUp }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [verificationMessage, setVerificationMessage] = useState(""); // Estado para el mensaje de verificación
  const [resetMessage, setResetMessage] = useState(""); // Estado para el mensaje de restablecimiento de contraseña

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(""); // Limpia cualquier error anterior
    setVerificationMessage(""); // Limpia el mensaje de verificación
    setResetMessage(""); // Limpia el mensaje de restablecimiento

    try {
      // Autenticar al usuario con Firebase
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Verifica si el correo del usuario está confirmado
      if (!user.emailVerified) {
        setVerificationMessage("Por favor, verifica tu correo electrónico antes de iniciar sesión.");
        auth.signOut(); // Cierra la sesión inmediatamente
      } else {
        setVerificationMessage(""); // Limpia el mensaje si está verificado
        // Puedes redirigir al usuario a otra parte de la aplicación aquí si es necesario
      }
    } catch (error) {
      setError("Correo o contraseña incorrectos. Inténtalo de nuevo.");
    }
  };

  const handleResetPassword = async () => {
    if (!email) {
      setResetMessage("Por favor, ingresa tu correo para restablecer la contraseña.");
      return;
    }

    try {
      await sendPasswordResetEmail(auth, email);
      setResetMessage("Se ha enviado un correo para restablecer tu contraseña.");
    } catch (error) {
      setResetMessage("Error al enviar el correo de restablecimiento. Verifica el correo ingresado.");
    }
  };

  return (
    <div className="logsign-container">
      <h2>Login</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {verificationMessage && <p style={{ color: "orange" }}>{verificationMessage}</p>}
      {resetMessage && <p style={{ color: "blue" }}>{resetMessage}</p>}
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
        <button type="submit">Login</button>
      </form>
      <p>
        <span 
          onClick={handleResetPassword}
          style={{ color: "blue", cursor: "pointer" }}
        >
          ¿Olvidaste tu contraseña?
        </span>
      </p>
      <p>
        ¿No tienes una cuenta?{" "}
        <span 
          onClick={onSwitchToSignUp}
          style={{ color: "blue", cursor: "pointer" }}
        >
          Regístrate aquí
        </span>
      </p>
    </div>
  );
};

export default Login;
