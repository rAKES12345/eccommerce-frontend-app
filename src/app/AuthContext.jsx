import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const name = localStorage.getItem("userName");
    const isLoggedIn = localStorage.getItem("isLoggedIn");
    const role = localStorage.getItem("role");
    if (isLoggedIn === "true" && name && role) {
      setUser({ name, role });
    }
  }, []);

  const login = ({ name, role }) => {
    localStorage.setItem("userName", name);
    localStorage.setItem("isLoggedIn", "true");
    localStorage.setItem("role", role);
    setUser({ name, role });
  };

  const logout = () => {
    localStorage.removeItem("userName");
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("role");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
