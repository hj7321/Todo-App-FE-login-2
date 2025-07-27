import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import { Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import TodoPage from "./pages/TodoPage";
import RegisterPage from "./pages/RegisterPage";
import { useEffect, useState } from "react";
import PrivateRoute from "./route/PrivateRoute";
import api from "./utils/api";
import { Notify } from "notiflix";

function App() {
  const [user, setUser] = useState(null);

  Notify.init({
    fontFamily: "SUIT-Medium",
    fontSize: "15px",
    timeout: 4000,
    cssAnimationDuration: 600,
  });

  const getUser = async () => {
    try {
      const token = sessionStorage.getItem("token");
      if (token) {
        const response = await api.get("/user/me");
        setUser(response.data.user);
      }
    } catch (error) {
      setUser(null);
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem("token");
    setUser(null);
  };

  useEffect(() => {
    getUser();
  }, []);

  return (
    <Routes>
      <Route
        path="/"
        element={
          <PrivateRoute user={user}>
            <TodoPage handleLogout={handleLogout} />
          </PrivateRoute>
        }
      />
      <Route path="/register" element={<RegisterPage />} />

      <Route
        path="/login"
        element={<LoginPage user={user} setUser={setUser} />}
      />
    </Routes>
  );
}

export default App;
