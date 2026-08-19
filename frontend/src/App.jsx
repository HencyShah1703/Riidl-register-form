import { useState, useEffect } from 'react';
import Register from './pages/Register/index.jsx';
import Records from './pages/Records/index.jsx';

function App() {
  const [currentPage, setCurrentPage] = useState('register'); // 'register', 'new-user', 'registered-user', 'visitoranalytics', 'analytics'
  const [prefilledUser, setPrefilledUser] = useState(null);

  // Sync state with browser URL path
  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname;
      if (path === '/visitor-analytics') {
        setCurrentPage('visitoranalytics');
      } else if (path === '/detailed-analytics') {
        setCurrentPage('analytics');
      } else if (path === '/visitor-entry') {
        setCurrentPage('register');
      } else {
        // Default root redirects to /visitor-entry
        window.history.replaceState(null, '', '/visitor-entry');
        setCurrentPage('register');
      }
    };
    window.addEventListener('popstate', handlePopState);
    handlePopState(); // Initial routing on load
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const handleSetPage = (page) => {
    setCurrentPage(page);
    if (page === 'visitoranalytics') {
      window.history.pushState(null, '', '/visitor-analytics');
    } else if (page === 'analytics') {
      window.history.pushState(null, '', '/detailed-analytics');
    } else if (page === 'register' || page === 'main') {
      window.history.pushState(null, '', '/visitor-entry');
    }
  };

  return (
    <div className="app-container">
      
      <main className="page-content">
        {['register', 'main', 'new-user', 'registered-user'].includes(currentPage) && (
          <Register 
            currentPage={currentPage} 
            setCurrentPage={handleSetPage} 
            prefilledUser={prefilledUser}
            setPrefilledUser={setPrefilledUser}
          />
        )}
        
        {currentPage === 'visitoranalytics' && (
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
