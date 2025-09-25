import React, { useState, useEffect } from "react";
import "./TasksPage.css";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPencil, faXmark } from "@fortawesome/free-solid-svg-icons";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";

export default function TasksPage() {
    const [activeTab, setActiveTab] = useState("all"); // للتحكم في الكارد اللي يظهر
    const [checked, setCheckedTasks] = useState({});
    const [task, setTask] = useState("");
    const [listTasks, setListTasks] = useState([]);
    const [taskIdToEdit, setTaskIdToEdit] = useState(null);
    const navigate = useNavigate();

  // Add Task
    function handelAddTasks() {
        if (task.trim() !== "") {
            const user = JSON.parse(localStorage.getItem("user"));
            const newTask = {
                name: task.trim(),
                userId: user.id,
        };

        axios
            .post("http://localhost:3000/todos", newTask)
            .then((response) => {
                setListTasks([...listTasks, response.data]);
                setTask("");
                toast.success("Task added successfully!");
            })
            .catch((error) => {
                console.error("Error adding task:", error);
                toast.error("Something went wrong!");
            });
        } else {
            toast.error("Add Task Please!");
        }
    }

  //Delete Task
    function handelDeleteTask(id) {
        axios
            .delete(`http://localhost:3000/todos/${id}`)
            .then(() => {
                const UpdateTasks = listTasks.filter((task) => task.id !== id);
                setListTasks(UpdateTasks);
                toast.info("Task deleted");
            })
            .catch((error) => {
                console.error("Error deleting task:", error);
                toast.error("Something went wrong!");
            });
    }

  //Check Task
    function handelChecked(id) {
        setCheckedTasks((prev) => ({
            ...prev,
            [id]: !prev[id],
        }));
    }

  // Edit Task 
    function handelEditTasks(id) {
        const element = listTasks.find((i) => i.id === id);
            if (element) {
                setTask(element.name);
                setTaskIdToEdit(element.id);
            }
    }

  // Confirm Edit Task
    function handelButtonEditTasks() {
        if (task.trim() !== "" && taskIdToEdit !== null) {
            const updatedTask = {
                name: task.trim(),
            };
        
            
            axios
                .put(`http://localhost:3000/todos/${taskIdToEdit}`, updatedTask)
                .then((response) => {
                    const updatedList = listTasks.map((taskItem) =>
                        taskItem.id === taskIdToEdit ? response.data : taskItem
                    );
                    setListTasks(updatedList);
                    setTask("");
                    setTaskIdToEdit(null);
                    toast.success("Task updated!");
                })
                .catch((error) => {
                    console.error("Error editing task:", error);
                    toast.error("Something went wrong!");
                });
        } else {
            toast.error("Add Task Please!");
        }
    }

  // Fetch Tasks for Current User
useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
        axios
        .get(`http://localhost:3000/todos?userId=${user.id}`)
        .then((response) => {
            setListTasks(response.data);
        })
        .catch((error) => {
            console.error("Error fetching tasks:", error);
        });
    }
}, []);

return (
    <div className="container-tasks pt-4 p-4">
        <div className="title">
            <h3>My Tasks Board</h3>
            <button className="btn-landing" onClick={() => navigate("/login")}>
                Logout
            </button>
        </div>

      {/* Navbar */}
        <div className="nav-tasks">
            <button className="btn-tasks" onClick={() => setActiveTab("all")}>
                All Tasks
            </button>
            <button className="btn-tasks" onClick={() => setActiveTab("create")}>
                Create
            </button>
            <button className="btn-tasks" onClick={() => setActiveTab("delete")}>
                Delete
            </button>
            <button className="btn-tasks" onClick={() => setActiveTab("update")}>
                Update
            </button>
        </div>

        {/* Create Task */}
        {activeTab === "create" && (
        <div className="container-input">
            <div className="data">
                <input
                type="text"
                value={task}
                onChange={(e) => setTask(e.target.value)}
            />
            <button className="btn-tasks" onClick={handelAddTasks}>
                Add
            </button>
            </div>
        </div>
        )}

        {/* All Tasks */}
        {activeTab === "all" && (
            <div className="container-input">
                <h4 className="text-center mb-4">My Tasks</h4>
                <div className="list-of-tasks">
                    <ul>
                        {listTasks.length > 0 &&
                            listTasks.map((item, index) => (
                                <li
                                    key={index}
                                    style={{
                                        textDecoration: checked[item.id]
                                        ? "line-through"
                                        : "none",
                                    }}>
                                    <input
                                        type="checkbox"
                                        checked={checked[item.id] || false}
                                        onChange={() => handelChecked(item.id)}
                                    />
                                    {item.name}
                                </li>
                            ))}
                    </ul>
                </div>
            </div>
        )}

      {/* Delete Task */}
        {activeTab === "delete" && (
            <div className="container-input">
                <h4 className="text-center mb-4">Delete Tasks</h4>
                <div className="list-of-tasks">
                    <ul>
                        {listTasks.length > 0 &&
                            listTasks.map((item, index) => (
                                <li key={index} className="d-flex justify-content-between">
                                    {item.name}
                                    <button
                                        className="delete-btn"
                                        onClick={() => handelDeleteTask(item.id)}
                                    >
                                        <FontAwesomeIcon icon={faXmark} />
                                    </button>
                                </li>
                            ))}
                    </ul>
                </div>
            </div>
        )}

        {/* Update Task */}
        {activeTab === "update" && (
        <div className="container-input">
            <div className="data">
                <input
                    type="text"
                    value={task}
                    onChange={(e) => setTask(e.target.value)}
                />
                <button className="btn-tasks" onClick={handelButtonEditTasks}>
                    Edit
                </button>
            </div>
            <div className="list-of-tasks">
                <ul>
                    {listTasks.length > 0 &&
                        listTasks.map((item, index) => (
                            <li key={index} className="d-flex justify-content-between">
                                {item.name}
                                <button
                                    className="pencil-btn"
                                    onClick={() => handelEditTasks(item.id)}
                                >
                                    <FontAwesomeIcon icon={faPencil} />
                                </button>
                            </li>
                        ))}
                </ul>
            </div>
        </div>
        )}

        <ToastContainer />
    </div>
);
}
