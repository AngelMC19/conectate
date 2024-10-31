// Search.jsx
import React, { useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebaseConfig";
import './Search.css';

const Search = ({ user, onSelectUser }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  const searchFriends = async (term) => {
    if (term.trim() === "") {
      setSearchResults([]);
      return;
    }

    const lowerCaseTerm = term.toLowerCase();
    const querySnapshot = await getDocs(collection(db, "usuarios"));

    const results = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      if (data.nombre && data.nombre.toLowerCase().startsWith(lowerCaseTerm) && doc.id !== user.uid) {
        results.push({ uid: doc.id, nombre: data.nombre, email: data.email });
      }
    });

    setSearchResults(results);
  };

  const handleChange = (e) => {
    const term = e.target.value;
    setSearchTerm(term);
    searchFriends(term);
  };

  const handleUserSelect = (selectedUser) => {
    onSelectUser(selectedUser);
    setSearchTerm("");
    setSearchResults([]);
  };

  return (
    <div className={`search-container ${searchResults.length > 0 ? "active" : ""}`}>
      <input
        type="text"
        placeholder="Buscar amigos..."
        value={searchTerm}
        onChange={handleChange}
      />
      <div className="search-results">
        {searchResults.map((result) => (
          <div key={result.uid} onClick={() => handleUserSelect(result)}>
            <strong>{result.nombre}</strong> - {result.email}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Search;
