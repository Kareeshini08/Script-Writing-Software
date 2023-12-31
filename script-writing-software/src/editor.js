import React, { useEffect, useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import './editor.css';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import html2pdf from 'html2pdf.js';
import { Modal } from 'react-bootstrap';

function Editor() {
  const navigate = useNavigate();
  const [content, setContent] = useState('');
  const { id } = useParams();
  const [showModal, setShowModal] = useState(false);
  const [sceneModal, setSceneModal] = useState(false);
  const [c_id, setId] = React.useState('');
  const [name, setName] = React.useState('');
  const [description, setDescription] = React.useState('');
  const [sheet, setSheet] = React.useState('');
  const [scene, setScene] = React.useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [sceneGenerating, setSceneGenerating] = useState(false);
  const [info, setInfo] = React.useState('');
  const [dataArray, setDataArray] = useState([]);
  const [save, setSave] = useState(true);
  const [edit, setEdit] = useState(true);
  const [sceneArray, setSceneArray] = useState([]);

  useEffect(() => {
    // setSceneModal(true);
    loadData();
    loadScene();

  }, []);

  const loadData = async () => {
    const response = await axios.get("http://localhost:8000/charGet");
    setDataArray(response.data);

  };

  const loadScene = async () => {
    const response = await axios.get("http://localhost:8000/sceneGet");
    setSceneArray(response.data);

  };

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

  const handleCharacter = (id) => {
    if (id) {
      setChar(id);
      setEdit(false);
      setSave(true);
    } else {
      setName('');
      setDescription('');
      setInfo('');
      setEdit(true);
      setSave(false);
    }
    setShowModal(true);
  };

  const handleScene = (id) => {
    setSceneModal(true);
  };

  const setChar = async (id) => {
    const response = await axios.get(`http://localhost:8000/charGet/${id}`);
    setId(response.data[0].id)
    setName(response.data[0].name);
    setDescription(response.data[0].individuality);
    setInfo(response.data[0].info);
  };

  const handleCloseModal = () => {
    setName('');
    setDescription('');
    setInfo('');
    setShowModal(false);
  };

  const CloseSceneModal = () => {
    setSheet('');
    setScene('');
    setSceneModal(false);
  };

  const handleSaveOrEditCharacter = (c_id) => {
    const apiUrl = c_id ? `http://localhost:8000/charPut/${c_id}` : 'http://localhost:8000/charPost';
    axios
      .request({
        method: c_id ? 'PUT' : 'POST',
        url: apiUrl,
        data: {
          name,
          description,
          info
        }
      })
      .then(() => { })
      .catch((err) => console.log(err));
    setShowModal(false);
    setTimeout(() => loadData(), 500);
  };

  const handleDelete = (c_id) => {
    if (window.confirm("Are you sure want to delete?")) {
      axios.delete(`http://localhost:8000/charDelete/${c_id}`);
      setTimeout(() => loadData(), 500);
    }
    setShowModal(false);
  }

  const handleGenerate = async (e) => {
    e.preventDefault();
    const options = {
      method: "POST",
      body: JSON.stringify({
        name: name,
        description: description,
      }),
      headers: {
        "Content-Type": "application/json"
      }
    }
    try {
      setIsGenerating(true);
      const response = await fetch('http://localhost:8000/character', options);
      const data = await response.json();
      setInfo(data.choices[0].message.content)
      setIsGenerating(false);
    } catch (error) {
      setIsGenerating(false);
      console.log(error);
    }
  };

  const sceneGenerate = async (e) => {
    e.preventDefault();
    const options = {
      method: "POST",
      body: JSON.stringify({
        sheet: sheet,
      }),
      headers: {
        "Content-Type": "application/json"
      }
    }
    try {
      setSceneGenerating(true);
      const response = await fetch('http://localhost:8000/scene', options);
      const data = await response.json();
      setContent(data.choices[0].message.content)
      setSceneGenerating(false);
      setSceneModal(false);
      const apiUrl = 'http://localhost:8000/scenePost';
      axios
        .request({
          method: 'POST',
          url: apiUrl,
          data: {
            sheet,
            content
          }
        })
        .then(() => { })
        .catch((err) => console.log(err));
      setTimeout(() => loadScene(), 500);
    } catch (error) {
      setSceneGenerating(false);
      console.log(error);
    }
  };

  const getScene = async (s_id) => {
    console.log(s_id)
      const response = await axios.get(`http://localhost:8000/sceneGet/${s_id}`);
      setContent(response.data);
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
              <li class="nav-item">
                <a class="nav-link" href="#">Pricing</a>
              </li>
              <li className="nav-item">
                <a className="nav-link" onClick={handleDownload}>
                  Download
                </a>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      <div style={{ display: 'flex', flex: 1 }}>
        <aside
          className="col-md-2 px-4 d-flex flex-column bg-light"
          style={{ height: '100%', paddingTop: '50px', borderRight: '1px solid #ccc' }}
        >
          <button className="btn btn-light mb-3">Characters</button>
          <p className="hover-border" onClick={() => handleCharacter()} style={{ textAlign: 'left' }}>
            + Create Character
          </p>
          <div style={{textTransform: 'uppercase'}}>
            {dataArray.map((item) => (
              <div key={item.id} className="hover-border">
                <p onClick={() => handleCharacter(item.id)} style={{ textAlign: 'left' }}>
                  {item.name}
                </p>
              </div>
            ))}
          </div>
          <button className="btn btn-light mb-3">Scenes</button>
          <p className="hover-border" onClick={() => handleScene()} style={{ textAlign: 'left' }}>
            + Create Scene
          </p>
          <div style={{textTransform: 'uppercase'}}>
            {sceneArray.map((item) => (
              <div key={item.id} className="hover-border">
                <p onClick={() => getScene(item.id)} style={{ textAlign: 'left' }}>
                  {item.beat_sheet}
                </p>
              </div>
            ))}
          </div>
        </aside>
        
        <main
          className="col-md-10 ml-sm-auto px-4 d-flex align-items-center justify-content-center"
          style={{ height: '100%', paddingTop: '50px' }}>
          <ReactQuill
            id="editor-content"
            value={content}
            onChange={handleEditorChange}
            style={{ height: '100%', width: '80%' }} />
        </main>

        <Modal
          show={showModal}
          onHide={handleCloseModal} centered
        >
          <Modal.Header closeButton>
            {!save && (
              <button
                className='btn btn-light me-2'
                onClick={() => handleSaveOrEditCharacter()}
                disabled={save}
              >
                Save Character
              </button>
            )}
            {!edit && (
              <button className='btn btn-light me-2' onClick={() => handleSaveOrEditCharacter(c_id)} disabled={edit}>Save Character</button>
            )}
            <button className='btn btn-light me-2' onClick={() => handleDelete(c_id)}>Delete Character</button>
            <button className='btn btn-light' onClick={handleCloseModal}>Cancel</button>
          </Modal.Header>
          <Modal.Body>
            <form>
              <div className="form-group">
                <label htmlFor="name">Character Name</label>
                <input
                  type="text"
                  id="name"
                  className="form-control"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label htmlFor="description">Character Individuality (Describe a character's individuality)</label>
                <textarea
                  id="description"
                  className="form-control"
                  rows="4"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                ></textarea>
              </div>
              <button type="submit" className="btn btn-light" disabled={isGenerating} onClick={handleGenerate}>
                {isGenerating ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true" />
                    Generating...
                  </>
                ) : (
                  'Generate Character'
                )}
              </button>
            </form>
          </Modal.Body>
          <Modal.Footer>
          <h6 style={{ marginRight: '37%' }}>CHARACTER INFO</h6>
            <main
              className="col-md-10 ml-sm-auto px-4"
              style={{ height: '100%', paddingTop: '20px', width: '100%' }}>
              <ReactQuill
                id="char-content"
                value={info}
                style={{ height: '100%', width: '100%' }} />
            </main>
          </Modal.Footer>
        </Modal>

        <Modal
          show={sceneModal}
          onHide={CloseSceneModal}
        >
          <Modal.Header closeButton>
          </Modal.Header>
          <Modal.Body>
            <h6 className="bold-text">Create Scene</h6>
            <p>Import your scene's beat sheet to generate the initial draft of your scene.</p>
            <form>
              <div className="form-group">
                <label htmlFor="sheet"><span style={{ color: 'red' }}>*</span>Scene beat Sheet</label>
                <textarea
                  id="sheet"
                  className="form-control"
                  rows="4"
                  value={sheet}
                  onChange={(e) => setSheet(e.target.value)}
                  required
                ></textarea>
              </div>
              <Modal.Footer>
                <button className='btn btn-light' onClick={CloseSceneModal}>Cancel</button>
                <button type="submit" className="btn btn-light" disabled={sceneGenerating} onClick={sceneGenerate}>
                  {sceneGenerating ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true" />
                      Generating...
                    </>
                  ) : (
                    'Save'
                  )}
                </button>
              </Modal.Footer>
            </form>
          </Modal.Body>
        </Modal>
      </div>
    </div>
  );
}

export default Editor;
