import React, { useEffect, useState } from "react";
import axios from "axios";
import './LandingPage.css'
import { useNavigate } from "react-router-dom";
export default function LandingPage() {
  const [tasks, setTasks] = useState([]);
  const user = JSON.parse(localStorage.getItem("user")); 
  const navigate = useNavigate();
  useEffect(() => {
    if (user) {
      axios
        .get(`http://localhost:3000/todos?userId=${user.id}`)
        .then((response) => {
          setTasks(response.data);
        })
        .catch((error) => {
          console.error("Error fetching tasks:", error);
        });
    }
  }, [user]);

  const handleLogout = () => {
    localStorage.removeItem("user"); 
    navigate("/"); 
  };

  return (
    <div className="landing_page">
      <div className="text">
        <h2>Hello, {user?.username}</h2>
        <h3>You have {tasks.length} tasks</h3>
        <div className="btn">
          <button className="btn-landing" onClick={() => navigate("/tasks")}>
            Go to Tasks
          </button>
          <button className="btn-logout" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}
