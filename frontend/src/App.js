import { useState, useEffect, createContext } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import jwtDecode from 'jwt-decode';
import { ThemeProvider, createTheme } from '@material-ui/core/styles';
import LocalStorageServices from './services/localStorage';
import PrivateRoutes from './components/private-routes/PrivateRoutes';
import Header from './components/Header';
import Footer from './components/Footer';

const darkTheme = createTheme({
  palette: {
    type: 'dark'
  }
});

export const authContext = createContext(null);

function App() {

  const [loggedIn, setLoggedIn] = useState(null);
  const [username, setUsername] = useState('');
  const [role, setRole] = useState(LocalStorageServices.getRole());

  useEffect(() => {
    const token = LocalStorageServices.getToken();
    if (token) {
      const payload = jwtDecode(token);
      setUsername(payload.username);
      console.log(`User ${username} logged in successfully`)
    }
  }, [username, loggedIn]);

  return (
    <ThemeProvider theme={darkTheme}>
      <Router>
        <authContext.Provider value={{ username, role, setRole, setLoggedIn }}>
          <Header />
          <PrivateRoutes />
          <Footer />
        </authContext.Provider>
      </Router>
    </ThemeProvider>
  );
};

export default App;
