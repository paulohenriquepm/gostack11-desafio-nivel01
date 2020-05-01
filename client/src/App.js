import React, { useState, useEffect, useMemo } from "react";

import api from './services/api';

import "./styles.css";

function App() {
  const [repositories, setRepositories] = useState(['']);
  const [sortConfig, setSortConfig] = useState(null);

  useEffect(() => {
    async function loadRepositories() {
      const response = await api.get('/repositories');

      setRepositories(response.data);
    }

    loadRepositories();
  }, []);

  async function handleAddRepository() {
    const response = await api.post('/repositories', {
      title: `Novo projeto 3`,
      url: `https://github.com/paulohenriquepm/${Date.now()}`,
      techs: ["ReactJS", "Node.js", "React Native"]
    });

    const repository = response.data;

    setRepositories([...repositories, repository]);
  }

  async function handleRemoveRepository(id) {
    await api.delete(`/repositories/${id}`);

    setRepositories(repositories.filter(
      repository => repository.id !== id
    ));
  }
  
  useMemo(() => {
    let sortableRepositories = [...repositories];
    if (sortConfig !== null) {
      sortableRepositories.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }
    setRepositories(sortableRepositories);
  }, [sortConfig]);
  
  const requestSort = (key) => {
    let direction = 'asc';
    if (
      sortConfig &&
      sortConfig.key === key &&
      sortConfig.direction === 'asc'
    ) {
      direction = 'desc';
    }
      setSortConfig({ key, direction });
    };

  return (
    <div>
      <ul data-testid="repository-list">
        <table>
          <thead>
            <button onClick={() => requestSort("title")} >Titulo</button>
            <th>Apagar</th>
          </thead>
          <tbody>
            {
              repositories.map(repository => (
                <tr key={repository.id} >
                  <td>{repository.title}</td>
                  <button onClick={() => handleRemoveRepository(repository.id)}>
                   Remover
                  </button>
                </tr>
              ))
            }
          </tbody>
        </table>
      </ul>

      <button onClick={handleAddRepository}>Adicionar</button>
    </div>
  );
}

export default App;
