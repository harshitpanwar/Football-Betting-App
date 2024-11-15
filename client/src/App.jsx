import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './Components/Header';
import Home from './Components/Home';
import AddPlayer from './Components/AddPlayer';

function App() {

  return (
    <div className='flex flex-col'>
      <Header/>
      <Router>
        <Routes>
          <Route path='/' element={<Home/>} />
          <Route path='/addplayer' element={<AddPlayer/>} />
        </Routes>
      </Router>
    </div>
  )
}

export default App
