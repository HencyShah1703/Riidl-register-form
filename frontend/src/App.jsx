import { useState, useEffect } from 'react';
import Navbar from './components/Navbar/index.jsx';
import MainPg from './pages/MainPg/index.jsx';
import NewUser from './pages/NewUser/index.jsx';
import RegisteredUser from './pages/RegisteredUser/index.jsx';
import Records from './pages/Records/index.jsx';
import Analytics from './pages/Analytics/index.jsx';

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

  const handleSelectFlow = (flow) => {
    if (flow === 'new') {
      handleSetPage('new-user');
    }
  };

  const handleUserFound = (user) => {
    setPrefilledUser(user);
    handleSetPage('registered-user');
  };

  const handleBackToMain = () => {
    setPrefilledUser(null);
    handleSetPage('main');
  };

  return (
    <div className="app-container">
      <Navbar currentPage={currentPage} setCurrentPage={handleSetPage} />
      
      <main className="page-content">
        {currentPage === 'main' && (
          <MainPg onSelectFlow={handleSelectFlow} onUserFound={handleUserFound} />
        )}
        
        {currentPage === 'new-user' && (
          <NewUser onBack={handleBackToMain} />
        )}
        
        {currentPage === 'registered-user' && (
          <RegisteredUser onBack={handleBackToMain} prefilledUser={prefilledUser} />
        )}

        {currentPage === 'records' && (
          <Records />
        )}

        {currentPage === 'analytics' && (
          <Analytics />
        )}
      </main>
    </div>
  );
}

export default App;
