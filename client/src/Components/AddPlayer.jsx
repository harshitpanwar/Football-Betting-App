import React, { useState } from 'react'

const AddPlayer = () => {
  // Hardcoded data for dropdown options
  const positions = [
      { _id: '1', name: 'Centre-Forward' },
      { _id: '2', name: 'Midfielder' },
      { _id: '3', name: 'Defender' },
  ];

  const clubs = [
      { _id: '1', name: 'Manchester City' },
      { _id: '2', name: 'Borussia Dortmund' },
      { _id: '3', name: 'Red Bull Salzburg' },
      { _id: '4', name: 'Molde' },
      { _id: '5', name: 'Bryne' },
  ];

  const countries = [
      { _id: '1', name: 'Norway' },
      { _id: '2', name: 'England' },
      { _id: '3', name: 'Germany' },
  ];

  // Initial player state
  const [player, setPlayer] = useState({
      name: '',
      dateOfBirth: '',
      position: '',
      currentClub: { club: '', from: '' },
      country: '',
      nationalTeams: [{ name: '', from: '' }],
      previousClubs: [{ club: '', from: '', to: '' }],
      rating: ''
  });

  const handleAddPreviousClub = () => {
      setPlayer(prevState => ({
          ...prevState,
          previousClubs: [...prevState.previousClubs, { club: '', from: '', to: '' }]
      }));
  };

  const handleInputChange = (e, field, index = null, subfield = null) => {
      if (index !== null && subfield) {
          const updatedArray = [...player[field]];
          updatedArray[index][subfield] = e.target.value;
          setPlayer({ ...player, [field]: updatedArray });
      } else {
          setPlayer({ ...player, [field]: e.target.value });
      }
  };

  const handleSubmit = (e) => {
      e.preventDefault();
      console.log('Player Data:', player);
      // Here you would make the API call to save the player data
  };

  return (
      <form onSubmit={handleSubmit} className="max-w-2xl mx-auto p-6 bg-white shadow-md rounded-lg space-y-4">
          <div className="flex flex-col">
              <label className="font-semibold text-gray-700">Name:</label>
              <input
                  type="text"
                  value={player.name}
                  onChange={(e) => handleInputChange(e, 'name')}
                  className="border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
          </div>
          <div className="flex flex-col">
              <label className="font-semibold text-gray-700">Date of Birth:</label>
              <input
                  type="date"
                  value={player.dateOfBirth}
                  onChange={(e) => handleInputChange(e, 'dateOfBirth')}
                  className="border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
          </div>
          <div className="flex flex-col">
              <label className="font-semibold text-gray-700">Position:</label>
              <select
                  value={player.position}
                  onChange={(e) => handleInputChange(e, 'position')}
                  className="border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              >
                  <option value="">Select Position</option>
                  {positions.map(position => (
                      <option key={position._id} value={position._id}>{position.name}</option>
                  ))}
              </select>
          </div>
          <div className="flex flex-col">
              <label className="font-semibold text-gray-700">Current Club:</label>
              <select
                  value={player.currentClub.club}
                  onChange={(e) => handleInputChange(e, 'currentClub', null, 'club')}
                  className="border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              >
                  <option value="">Select Club</option>
                  {clubs.map(club => (
                      <option key={club._id} value={club._id}>{club.name}</option>
                  ))}
              </select>
              <label className="font-semibold text-gray-700 mt-2">From:</label>
              <input
                  type="date"
                  value={player.currentClub.from}
                  onChange={(e) => handleInputChange(e, 'currentClub', null, 'from')}
                  className="border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
          </div>
          <div className="flex flex-col">
              <label className="font-semibold text-gray-700">Country:</label>
              <select
                  value={player.country}
                  onChange={(e) => handleInputChange(e, 'country')}
                  className="border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              >
                  <option value="">Select Country</option>
                  {countries.map(country => (
                      <option key={country._id} value={country._id}>{country.name}</option>
                  ))}
              </select>
          </div>
          <div>
              <label className="font-semibold text-gray-700">National Teams:</label>
              {player.nationalTeams.map((team, index) => (
                  <div key={index} className="flex items-center space-x-2 mb-2">
                      <select
                          value={team.name}
                          onChange={(e) => handleInputChange(e, 'nationalTeams', index, 'name')}
                          className="border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                      >
                          <option value="">Select National Team</option>
                          {countries.map(country => (
                              <option key={country._id} value={country.name}>{country.name}</option>
                          ))}
                      </select>
                      <label className="font-semibold text-gray-700">From:</label>
                      <input
                          type="date"
                          value={team.from}
                          onChange={(e) => handleInputChange(e, 'nationalTeams', index, 'from')}
                          className="border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                      />
                  </div>
              ))}
          </div>
          <div>
              <label className="font-semibold text-gray-700">Previous Clubs:</label>
              {player.previousClubs.map((club, index) => (
                  <div key={index} className="flex items-center space-x-2 mb-2">
                      <select
                          value={club.club}
                          onChange={(e) => handleInputChange(e, 'previousClubs', index, 'club')}
                          className="border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                      >
                          <option value="">Select Club</option>
                          {clubs.map(c => (
                              <option key={c._id} value={c._id}>{c.name}</option>
                          ))}
                      </select>
                      <label className="font-semibold text-gray-700">From:</label>
                      <input
                          type="date"
                          value={club.from}
                          onChange={(e) => handleInputChange(e, 'previousClubs', index, 'from')}
                          className="border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                      />
                      <label className="font-semibold text-gray-700">To:</label>
                      <input
                          type="date"
                          value={club.to}
                          onChange={(e) => handleInputChange(e, 'previousClubs', index, 'to')}
                          className="border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                      />
                  </div>
              ))}
              <button
                  type="button"
                  onClick={handleAddPreviousClub}
                  className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
              >
                  Add Previous Club
              </button>
          </div>
          <div className="flex flex-col">
              <label className="font-semibold text-gray-700">Rating:</label>
              <input
                  type="number"
                  min="1"
                  max="5"
                  value={player.rating}
                  onChange={(e) => handleInputChange(e, 'rating')}
                  className="border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
          </div>
          <button
              type="submit"
              className="w-full px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400"
          >
              Save Player
          </button>
      </form>
  );
}

export default AddPlayer