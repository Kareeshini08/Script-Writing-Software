import { BrowserRouter, Routes , Route } from "react-router-dom";
import './App.css';
import Home from "./home";
import Editor from "./editor";
import Dashboard from "./dashboard";

function App() {
  return (
    <BrowserRouter>
    <div className="App">
      <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/editor" element={<Editor />} />
          <Route path="/update/:id" element={<Editor />} />
          <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </div>
    </BrowserRouter>
  );
}

export default App;
