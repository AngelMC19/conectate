import React, { useEffect, useState } from "react";
import { auth } from "./firebaseConfig"; // Importa Firebase
import { onAuthStateChanged, signOut } from "firebase/auth";
import Login from "./Login";
import SignUp from "./SignUp";
import Chat from "./chat";

function App() {
  const [user, setUser] = useState(null);
  const [currentView, setCurrentView] = useState("login"); // Controla qué componente mostrarf
  const [emailVerified, setEmailVerified] = useState(false);

  useEffect(() => {
    // Escucha el estado de autenticación de Firebase
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
        setEmailVerified(user.emailVerified); // Verifica si el correo está confirmado
        if (user.emailVerified) {
          setCurrentView("chat"); // Redirigir a chat si el correo está verificado
        } else {
          setCurrentView("verify"); // Mostrar mensaje de verificación
        }
      } else {
        setUser(null);
        setCurrentView("login");
      }
    });

    return () => unsubscribe(); // Limpia el listener al desmontar el componente
  }, []);

  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        setCurrentView("login");
      })
      .catch((error) => {
        console.error("Error al cerrar sesión", error);
      });
  };

  return (
    <div className="App">
      {currentView === "login" && (
        <Login onSwitchToSignUp={() => setCurrentView("signup")} />
      )}

      {currentView === "signup" && (
        <SignUp onSwitchToLogin={() => setCurrentView("login")} />
      )}

      {currentView === "verify" && (
        <div>
          <h2>Por favor verifica tu correo</h2>
          <p>Te hemos enviado un correo a {user.email}. Verifica tu cuenta para acceder al chat.</p>
          <button onClick={handleLogout}>Cerrar sesión</button>
        </div>
      )}

      {currentView === "chat" && emailVerified && user && (
        <Chat user={user} onLogout={handleLogout} />
      )}
    </div>
  );
}

export default App;
