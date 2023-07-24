import React, { useEffect, useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import './editor.css';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import html2pdf from 'html2pdf.js';

function Editor() {
  const navigate = useNavigate();

  const [content, setContent] = useState('');

  const { id } = useParams();

  useEffect(() => {
    const generatedScript = localStorage.getItem('generatedScript');
    if (generatedScript) {
      setContent(generatedScript);
    }
  }, []);

  const handleEditorChange = (value) => {
    setContent(value);
    localStorage.setItem('generatedScript', value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const title = localStorage.getItem('title');
    const plot = localStorage.getItem('plot');
    const genre = localStorage.getItem('genre');
    if (!id) {
      axios
        .post('http://localhost:8000/POST', {
          title,
          plot,
          genre,
          content,
        })
        .then(() => { })
        .catch((err) => console.log(err));
    } else {
      axios
        .put(`http://localhost:8000/PUT/${id}`, {
          title,
          plot,
          genre,
          content,
        })
        .then(() => { })
        .catch((err) => console.log(err));
    }
    navigate('/dashboard');
  };

  const handleDownload = () => {
    const element = document.getElementById('editor-content');
    if (!element) {
      return;
    }

    const opt = {
      margin: 10,
      filename: 'script.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
    };

    html2pdf().from(element).set(opt).save();
  };

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <div className="container">
          <a className="navbar-brand" href="#">
            ScriptWriter
          </a>
          <div className="collapse navbar-collapse justify-content-end" id="navbarNav">
            <ul className="navbar-nav">
              <li className="nav-item">
                <a className="nav-link" href="/">
                  Home
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="/dashboard">
                  Dashboard
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link" onClick={handleDownload}>
                  Download
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link" onClick={handleSubmit}>
                  Submit
                </a>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      <div style={{ display: 'flex', flex: 1 }}>
        <main
          className="col-md-10 ml-sm-auto px-4 d-flex align-items-center justify-content-center"
          style={{ height: '100%', paddingTop: '50px', marginLeft: '130px' }}>
          <ReactQuill
            id="editor-content"
            value={content}
            onChange={handleEditorChange}
            style={{ height: '100%', width: '80%' }}/>
        </main>
      </div>
    </div>
  );
}

export default Editor;
