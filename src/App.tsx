import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Web3Provider } from './providers/Web3Provider'
import Navigation from './components/Navigation'
import Home from './pages/Home'
import Wallet from './pages/Wallet'
import Social from './pages/Social'
import Email from './pages/Email'
import './App.css'

function App() {
  return (
    <Web3Provider>
      <Router>
        <div className="App">
          <Navigation />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/wallet" element={<Wallet />} />
            <Route path="/social" element={<Social />} />
            <Route path="/email" element={<Email />} />
          </Routes>
        </div>
      </Router>
    </Web3Provider>
  )
}

export default App
