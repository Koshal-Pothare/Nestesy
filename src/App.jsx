import { useState } from 'react'

import './App.css'
import Home from './pages/Home'
import Footer from './components/Footer'
import Navbar from './components/Navbar'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
    <Navbar/>
      <Home/>
      <Footer/>
    </>
  )
}

export default App
