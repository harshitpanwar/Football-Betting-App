import React from 'react'

const Header = () => {

  return (
    <div className="flex-1 p-1 bg-gray-800">
    <header className="flex flex-row justify-between items-center m-2">
      <div className="flex items-center">
        <span className="mr-4 text-white text-sm sm:text-md cursor-pointer" onClick={() => window.location.href = '/'}>Clubs</span>
        <span className="mr-4 text-white text-sm sm:text-md cursor-pointer" onClick={() => window.location.href = '/addplayer'}>Add Player</span>
      </div>
    </header>
  </div>

  )
}

export default Header