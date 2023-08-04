import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Modal, Dropdown } from 'react-bootstrap';
import './home.css';
import axios from 'axios';

function Home() {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState('');
  const [plot, setPlot] = useState('');
  const [genre, setGenre] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [suggestedTitles, setSuggestedTitles] = useState([]);
  const [pdfFile, setPdfFile] = useState(null);
  const [fdxFile, setFdxFile] = useState(null);

  const handlePdfFileChange = (event) => {
    setPdfFile(event.target.files[0]);
  };

  const handleFdxFileChange = (event) => {
    setFdxFile(event.target.files[0]);
  };

  const handleContactClick = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleSubmit = () => {
    const apiUrl = 'http://localhost:8000/Post';
    axios
      .request({
        method: 'POST',
        url: apiUrl,
        data: {
          title,
          plot,
          genre
        }
      })
      .then(() => { })
      .catch((err) => console.log(err));
    navigate('/editor')
  };

  const handleSuggestTitles = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      const response = await fetch('http://localhost:8000/suggest-titles', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ plot: plot }),
      });

      if (!response.ok) {
        throw new Error('Failed to get title suggestions');
      }
      const data = await response.json();
      setIsLoading(false);
      setSuggestedTitles(data.titles);
    } catch (error) {
      setIsLoading(false);
      console.error(error);
    }
  };

  const handleSelectTitle = (selectedTitle) => {
    const cleanedTitle = selectedTitle.replace(/[0-9".]/g, '').trim();
    setTitle(cleanedTitle);
  };

  const handleGenreSelection = (selectedGenre) => {
    if (genre.includes(selectedGenre)) {
      setGenre(genre.filter((item) => item !== selectedGenre));
    } else {
      setGenre([...genre, selectedGenre]);
    }
  };


  return (
    <div className="App">
      <nav class="navbar navbar-expand-lg navbar-light bg-light">
        <div class="container">
          <a class="navbar-brand" href="#">ScriptWriter</a>
          <div class="collapse navbar-collapse justify-content-end" id="navbarNav">
            <ul class="navbar-nav">
              <li class="nav-item">
                <a class="nav-link" onClick={handleContactClick}>Create Script</a>
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

      <section class="hero text-white text-center py-5">
        <div class="container">
          <div class="row align-items-center">
            <div class="col-md-6">
              <h1 class="display-4">Write Your Best Script Now</h1>
              <p class="lead">Our script writing software with ChatGPT integration will take your writing to the next level.</p>
              <a href="#" class="btn btn-light btn-lg">Get Started</a>
            </div>
            <div class="col-md-6">
              <img src="https://img.freepik.com/free-vector/hand-drawn-essay-illustration_23-2150268421.jpg?w=740&t=st=1690107492~exp=1690108092~hmac=2af2b842b19a081834bbfd362572e4d5779d3c7e6c412c5a4a81dbd4015121b2" alt="Script Writing Software" class="img-fluid" />
            </div>
          </div>
        </div>
      </section>

      <section class="features py-5">
        <div class="container">
          <h2 class="text-center mb-4">Key Features</h2>
          <div class="row">
            <div class="col-md-4">
              <div class="card mb-4">
                <div class="card-body">
                  <h3 class="card-title">Intuitive Interface</h3>
                  <p class="card-text">Our user-friendly interface makes script writing a breeze.</p>
                </div>
              </div>
            </div>
            <div class="col-md-4">
              <div class="card mb-4">
                <div class="card-body">
                  <h3 class="card-title">ChatGPT Integration</h3>
                  <p class="card-text">Get AI-powered suggestions and ideas to enhance your script.</p>
                </div>
              </div>
            </div>
            <div class="col-md-4">
              <div class="card mb-4">
                <div class="card-body">
                  <h3 class="card-title">Real-time Collaboration</h3>
                  <p class="card-text">Work with your team in real-time, no matter where they are.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section class="cta bg-fff text-white py-5">
        <div class="container text-center">
          <h2 class="mb-4">Ready to Write Your Script?</h2>
          <a href="#" class="btn btn-light btn-lg">Get Started</a>
        </div>
      </section>

      <footer class="footer bg-dark text-white py-4">
        <div class="container text-center">
          <p>&copy; 2023 ScriptWriter. All rights reserved.</p>
        </div>
      </footer>

      <Modal show={showModal} onHide={handleCloseModal} centered>
        <Modal.Header>
          <Modal.Title>Create Script</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form>
            <div className="form-group">
              <label htmlFor="title"><span style={{ color: 'red' }}>*</span>Title</label>
              <input
                type="text"
                id="title"
                className="form-control"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>
            {suggestedTitles.length > 0 && (
              <div className="form-group">
                <p>Suggested Titles:</p>
                <div className="title-boxes">
                  {suggestedTitles.map((title, index) => (
                    <div
                      key={index}
                      className="title-box"
                      onClick={() => handleSelectTitle(title)}
                    >
                      {title}
                    </div>
                  ))}
                </div>
              </div>
            )}
            <div className="form-group">
              <label htmlFor="plot">Plot</label>
              <textarea
                id="plot"
                className="form-control"
                rows="4"
                value={plot}
                onChange={(e) => setPlot(e.target.value)}
              ></textarea>
            </div>
            <div className="form-group d-flex align-items-center justify-content-between" style={{ backgroundColor: 'lightblue', padding: '10px', borderRadius: '5px' }}>
              <p style={{ margin: '0' }}>Suggest screenplay titles based on plot</p>
              <button className="btn btn-light" disabled={plot.length < 12 || isLoading} onClick={handleSuggestTitles} style={{ backgroundColor: '#fff' }}>
                {isLoading ? 'Loading...' : 'Suggest Titles'}
              </button>    </div>
            <div className="form-group">
              <label htmlFor="genre"><span style={{ color: 'red' }}>*</span>Genre</label>
              <Dropdown drop="up">
                <Dropdown.Toggle variant="transparent" id="dropdown-genre" className="custom-dropdown-toggle">
                  <div className="selected-genres">
                    {genre.map((selectedGenre, index) => (
                      <div key={index} className="selected-genre-box light-blue-bg">
                        {selectedGenre}
                      </div>
                    ))}
                  </div>
                </Dropdown.Toggle>
                <Dropdown.Menu style={{ width: '100%' }}>
                  <Dropdown.Item
                    onClick={() => handleGenreSelection('Action')}
                    active={genre.includes('Action')}
                  >
                    Action {genre.includes('Action') && <span className="tick-mark">✔</span>}
                  </Dropdown.Item>
                  <Dropdown.Item
                    onClick={() => handleGenreSelection('Adventure')}
                    active={genre.includes('Adventure')}
                  >Adventure {genre.includes('Adventure') && <span className="tick-mark">✔</span>}</Dropdown.Item>
                  <Dropdown.Item
                    onClick={() => handleGenreSelection('Comedy')}
                    active={genre.includes('Comedy')}
                  >Comedy {genre.includes('Comedy') && <span className="tick-mark">✔</span>}</Dropdown.Item>
                  <Dropdown.Item
                    onClick={() => handleGenreSelection('Drama')}
                    active={genre.includes('Drama')}
                  >Drama {genre.includes('Drama') && <span className="tick-mark">✔</span>}</Dropdown.Item>
                  <Dropdown.Item
                    onClick={() => handleGenreSelection('Fantasy')}
                    active={genre.includes('Fantasy')}
                  >Fantasy {genre.includes('Fantasy') && <span className="tick-mark">✔</span>}</Dropdown.Item>
                  <Dropdown.Item
                    onClick={() => handleGenreSelection('Horror')}
                    active={genre.includes('Horror')}
                  >Horror {genre.includes('Horror') && <span className="tick-mark">✔</span>}</Dropdown.Item>
                  <Dropdown.Item
                    onClick={() => handleGenreSelection('Mystery')}
                    active={genre.includes('Mystery')}
                  >Mystery {genre.includes('Mystery') && <span className="tick-mark">✔</span>}</Dropdown.Item>
                  <Dropdown.Item
                    onClick={() => handleGenreSelection('Romance')}
                    active={genre.includes('Romance')}
                  >Romance {genre.includes('Romance') && <span className="tick-mark">✔</span>}</Dropdown.Item>
                  <Dropdown.Item
                    onClick={() => handleGenreSelection('Sci-Fi')}
                    active={genre.includes('Sci-Fi')}
                  >Sci-Fi {genre.includes('Sci-Fi') && <span className="tick-mark">✔</span>}</Dropdown.Item>
                  <Dropdown.Item
                    onClick={() => handleGenreSelection('Thriller')}
                    active={genre.includes('Thriller')}
                  >Thriller {genre.includes('Thriller') && <span className="tick-mark">✔</span>}</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </div>
            <div className="text-center">
              <div className="mb-2 or">
                <div className="line"></div>
                <h5 className="or-text">OR</h5>
                <div className="line"></div>
              </div>
              <div className="button-container mb-3">
                <label htmlFor="pdfFile" className="btn btn-light me-4">
                  Upload PDF
                </label>
                <input
                  id="pdfFile"
                  type="file"
                  accept=".pdf"
                  style={{ display: 'none' }}
                  onChange={handlePdfFileChange}
                />
                <label htmlFor="fdxFile" className="btn btn-light">
                  Upload FDX
                </label>
                <input
                  id="fdxFile"
                  type="file"
                  accept=".fdx"
                  style={{ display: 'none' }}
                  onChange={handleFdxFileChange}
                /></div></div>
            <Modal.Footer>
              <button className="btn btn-light" onClick={handleCloseModal}>
                Close
              </button>
              <button type="submit" className="btn btn-light" disabled={isSubmitting} onClick={handleSubmit}>
                {isSubmitting ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true" />
                    Submit
                  </>
                ) : (
                  'Submit'
                )}
              </button>
            </Modal.Footer>
          </form>
        </Modal.Body>
      </Modal>
    </div>
  );
}

export default Home;