import React, { useState } from "react";
import { auth } from "./firebaseConfig"; // Importa la configuración de Firebase
import { signInWithEmailAndPassword } from "firebase/auth"; // Importa la función de login

const Login = ({ onSwitchToSignUp }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      // Usa Firebase Authentication para iniciar sesión
      await signInWithEmailAndPassword(auth, email, password);
      alert("Inicio de sesión exitoso");
      // Aquí puedes redirigir al usuario a otra parte de la aplicación si es necesario
    } catch (error) {
      setError("Correo o contraseña incorrectos. Inténtalo de nuevo.");
    }
  };

  return (
    <div className="logsign-container">
      <h2>Login</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
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
