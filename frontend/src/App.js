import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './styles.css';

const App = () => {
    const [users, setUsers] = useState([]);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');

    useEffect(() => {
        fetchUsers();
    }, []);

    // Fonction pour récupérer les utilisateurs
    const fetchUsers = async () => {
        const response = await axios.get('http://localhost:5000/users');
        setUsers(response.data.users);
    };

    // Fonction pour ajouter un utilisateur
    const addUser = async () => {
        await axios.post('http://localhost:5000/users', { name, email });
        fetchUsers(); // Recharger la liste des utilisateurs après ajout
        setName('');
        setEmail('');
    };

    // Fonction pour mettre à jour un utilisateur
    const updateUser = async (id) => {
        const response = await axios.put(`http://localhost:5000/users/${id}`, { name, email });
        setUsers(users.map(user => user.id === id ? response.data : user));
    };

    // Fonction pour supprimer un utilisateur
    const deleteUser = async (id) => {
        await axios.delete(`http://localhost:5000/users/${id}`);
        setUsers(users.filter(user => user.id !== id));
    };

    return (
        <div>
            <h1>Gestion des utilisateurs</h1>
            <div>
                <input
                    type="text"
                    placeholder="Nom"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <button onClick={addUser}>Ajouter</button>
            </div>
            <ul>
                {users.map(user => (
                    <li key={user.id}>
                        {user.name} - {user.email}
                        <button onClick={() => updateUser(user.id)}>Modifier</button>
                        <button onClick={() => deleteUser(user.id)}>Supprimer</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default App;
