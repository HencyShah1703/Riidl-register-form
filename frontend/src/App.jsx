import { useState, useEffect } from 'react';
import Navbar from './pages/Navbar/index.jsx';
import Register from './pages/Register/index.jsx';
import Records from './pages/Records/index.jsx';

function App() {
  const [currentPage, setCurrentPage] = useState('main'); // 'main', 'new-user', 'registered-user', 'records', 'analytics'
  const [prefilledUser, setPrefilledUser] = useState(null);

  // Sync state with browser URL path
  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname;
      if (path === '/analytics') {
        setCurrentPage('analytics');
      } else if (path === '/records') {
        setCurrentPage('records');
      } else {
        setCurrentPage('main');
      }
    };
    window.addEventListener('popstate', handlePopState);
    handlePopState(); // Initial routing on load
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const handleSetPage = (page) => {
    setCurrentPage(page);
    if (page === 'analytics') {
      window.history.pushState(null, '', '/analytics');
    } else if (page === 'records') {
      window.history.pushState(null, '', '/records');
    } else if (page === 'main') {
      window.history.pushState(null, '', '/');
    }
  };

  return (
    <div className="app-container">
      <Navbar currentPage={currentPage} setCurrentPage={handleSetPage} />
      
      <main className="page-content">
        {['main', 'new-user', 'registered-user'].includes(currentPage) && (
          <Register 
            currentPage={currentPage} 
            setCurrentPage={handleSetPage} 
            prefilledUser={prefilledUser}
            setPrefilledUser={setPrefilledUser}
          />
        )}
        
        {currentPage === 'records' && (
          <Records subPage="log" />
        )}

        {currentPage === 'analytics' && (
          <Records subPage="analytics" />
        )}
      </main>
    </div>
  );
}

export default App;
