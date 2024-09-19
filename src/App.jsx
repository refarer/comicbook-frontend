import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom'
import CharacterExplore from './components/CharacterExplore'
import CharacterDetails from './components/CharacterDetails'
import ReadingList from './components/ReadingList'
import ComicDetails from './components/ComicDetails'
import ReadingListPreview from './components/ReadingListPreview'
import './App.css'
import { BsBook } from 'react-icons/bs'

function App() {
  const [readingList, setReadingList] = useState(() => {
    const saved = localStorage.getItem('readingList')
    const initial = JSON.parse(saved)
    return initial || []
  })
  const [showPreview, setShowPreview] = useState(false)

  const handleAddToReadingList = (comic) => {
    setReadingList(readingList => {
      if (readingList.some(item => item.id === comic.id)) {
        return readingList
      }
      return [...readingList, comic]
    })
  }

  const handleRemoveFromReadingList = (comic) => {
    setReadingList(readingList => readingList.filter(item => item.id !== comic.id))
  }

  useEffect(() => {
    localStorage.setItem('readingList', JSON.stringify(readingList))
  }, [readingList])

  return (
    <Router>
      <div className="app-container">
        <nav className="navbar">
          <div className="navbar-content">
            <ul className="nav-links">
              <li><Link to="/">Explore Characters</Link></li>
              <li><Link to="/reading-list">Reading List</Link></li>
            </ul>
            <div className="reading-list-badge-container">
              <span
                className="reading-list-badge"
                onClick={(e) => {
                  e.preventDefault()
                  setShowPreview(!showPreview)
                }}
              >
                <BsBook className="book-icon" />
                {readingList.length}
              </span>
            </div>
          </div>
        </nav>

        {showPreview && <ReadingListPreview readingList={readingList} onClose={() => setShowPreview(false)} />}

        <main className="main-content">
          <Routes>
            <Route path="/" element={<CharacterExplore />} />
            <Route path="/character/:id" element={<CharacterDetails />} />
            <Route path="/reading-list" element={<ReadingList readingList={readingList} handleRemoveFromReadingList={handleRemoveFromReadingList} />} />
            <Route path="/comics/:id" element={<ComicDetails readingList={readingList} handleAddToReadingList={handleAddToReadingList} />} />
          </Routes>
        </main>
      </div>
    </Router>
  )
}

export default App
