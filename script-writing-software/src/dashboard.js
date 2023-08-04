import React, { useState, useEffect } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from "axios";
import { Link } from "react-router-dom";
import './dashboard.css';

function Dashboard() {
  const [data, setData] = useState([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const response = await axios.get("http://localhost:8000/GET");
    setData(response.data)

  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure want to delete?")) {
      axios.delete(`http://localhost:8000/DELETE/${id}`);
      setTimeout(() => loadData(), 500);
    }
  }

  return (
    <div className="App">
      <nav class="navbar navbar-expand-lg navbar-light bg-light">
        <div class="container">
          <a class="navbar-brand" href="#">ScriptWriter</a>
          <div class="collapse navbar-collapse justify-content-end" id="navbarNav">
            <ul class="navbar-nav">
              <li class="nav-item">
                <a class="nav-link" href="/">Home</a>
              </li>
              <li class="nav-item">
                <a class="nav-link" href="/dashboard">Dashoard</a>
              </li>
              <li class="nav-item">
                <a class="nav-link" href="#">Pricing</a>
              </li>
              <li class="nav-item">
                <a class="nav-link" href="#">Login</a>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      <h2 class="text-center mb-4" style={{ margin: "50px auto", color: "#0dcaf0" }}>My Scripts</h2>

      <div className="container1" style={{ maxWidth: "700px", margin: "10px auto" }}>{
        data.map((item, index) => {
          return (
            <div className="row my-3 border rounded" style={{ backgroundColor: "#fff" }} key={item.id}>
              <div className="col-8 d-flex justify-content-start">
                <div>
                  <h2 className="mb-3">{item.title}</h2>
                  <p>Synopsis: {item.plot}</p>
                  <p>Genre: {item.genre}</p>
                </div>
              </div>
              <div className="col-4 d-flex align-items-center justify-content-end">
                <div className="d-flex flex-column">
                  <Link to={`/update/${item.id}`}>
                    <button className="btn btn-light mb-2">Edit</button>
                  </Link>
                  <button className="btn btn-light" onClick={() => handleDelete(item.id)}>
                    Delete
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Dashboard;