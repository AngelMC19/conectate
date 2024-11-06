import React, { useEffect, useState } from "react";
import { auth } from "../firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";
import Login from "../Login/Login";
import SignUp from "../SingUp/SignUp";
import Chat from "../Chat/Chat";
import './App.css';


function App() {
  const [user, setUser] = useState(null); // Para almacenar al usuario autenticado
  const [currentView, setCurrentView] = useState("login"); // Estado para controlar la vista actual
  const [isVerified, setIsVerified] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user); // Almacena el usuario autenticado
        if (user.emailVerified) {
          setIsVerified(true); // Confirma que el usuario ha verificado su correo
          setCurrentView("chat"); // Redirige al chat si el correo está verificado
        } else {
          setIsVerified(false);
          setCurrentView("login"); // Redirige al login si no está verificado
        }
      } else {
        setUser(null); // Limpia el usuario si no está autenticado
        setIsVerified(false);
        setCurrentView("login");
      }
    });

    return () => unsubscribe(); // Limpia la suscripción al desmontar el componente
  }, []);

  const handleLogout = () => {
    auth.signOut();
    setCurrentView("login"); // Redirige a login cuando el usuario cierra sesión
  };

  return (
    <div className="App">
      {currentView === "login" && (
        <Login onSwitchToSignUp={() => setCurrentView("signup")} />
      )}

      {currentView === "signup" && (
        <SignUp onSwitchToLogin={() => setCurrentView("login")} />
      )}

      {currentView === "chat" && isVerified &&(
        <Chat user={user} onLogout={handleLogout} />
      )}
    </div>
  );
}

export default App;
