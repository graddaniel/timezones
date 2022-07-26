import { useState, useEffect } from 'react';

import './App.css';

function App() {
  const [message, setMessage] = useState('');
  useEffect(() => {
    async function loadMessage() {
      const response = await fetch('http://0.0.0.0:8080');
      const data = await response.text();
      setMessage(data);
    }
    loadMessage();
  }, []);
  

  return (
    <div className="App">
      <header className="App-header">
        <p>
          Fetched: {message}.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
