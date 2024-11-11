import React, { useState } from 'react'
import { useQuery, useMutation } from '@tanstack/react-query';
import { getActiveClubs } from '../api/Clubs';
import { getPositions } from '../api/Position';
import { getCountries } from '../api/Country';
import { savePlayerData } from '../api/Player';

const AddPlayer = () => {

    const { isLoading: clubsDataLoading, error: clubsDataError, data: clubsData } = useQuery({
        queryKey: ['clubs'],
        queryFn: () => getActiveClubs(),
    });

    const { isLoading: positionsDataLoading, error: positionsDataError, data: positionsData } = useQuery({
        queryKey: ['positions'],
        queryFn: () => getPositions()
    });

    const { isLoading: countriesDataLoading, error: countriesDataError, data: countriesData } = useQuery({
        queryKey: ['countries'],
        queryFn: () => getCountries(),
    });

    const savePlayerDataMutation = useMutation({
        mutationFn: savePlayerData,
        onSuccess: () => {
            console.log('Player saved successfully');
        }
    })

    // Initial player state
    const [player, setPlayer] = useState({
        name: '',
        dateOfBirth: '',
        position: '',
        currentClub: { club: '', from: '' },
        country: '',
        nationalTeams: [{ name: '', from: '', type: '' }],
        previousClubs: [{ name: '', from: '', to: '' }],
        rating: ''
    });

    const handleAddPreviousClub = () => {
        setPlayer(prevState => ({
            ...prevState,
            previousClubs: [...prevState.previousClubs, { name: '', from: '', to: '' }]
        }));
    };

    const handleAddNationalTeam = () => {
        setPlayer(prevState => ({
            ...prevState,
            nationalTeams: [...prevState.nationalTeams, { name: '', from: '', type: '' }]
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
        console.log(player);
    };
    const handleClubInputChange = (e, field, subfield) => {
        setPlayer({ ...player, [field]: { ...player[field], [subfield]: e.target.value } });
        console.log(player);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        savePlayerDataMutation.mutate(player);
    };

    if(clubsDataLoading || positionsDataLoading || countriesDataLoading) {
        return <div>Loading...</div>
    }

    return (
        <form onSubmit={handleSubmit} className="max-w-2xl mx-auto p-6 bg-white shadow-md rounded-lg space-y-4">
            <div className="flex flex-col">
                <label className="font-semibold text-gray-700">Name:</label>
                <input
                    type="text"
                    value={player.name}
                    onChange={(e) => handleInputChange(e, 'name')}
                    className="border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                    required
                />
            </div>
            <div className="flex flex-col">
                <label className="font-semibold text-gray-700">Date of Birth:</label>
                <input
                    type="date"
                    value={player.dateOfBirth}
                    onChange={(e) => handleInputChange(e, 'dateOfBirth')}
                    className="border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                    required
                />
            </div>
            <div className="flex flex-col">
                <label className="font-semibold text-gray-700">Position:</label>
                <select
                    value={player.position}
                    onChange={(e) => handleInputChange(e, 'position')}
                    className="border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                    required
                >
                    <option value="">Select Position</option>
                    {positionsData.map(position => (
                        <option key={position._id} value={position._id}>{position.position}</option>
                    ))}
                </select>
            </div>
            <div className="flex flex-col">
                <label className="font-semibold text-gray-700">Current Club:</label>
                <select
                    value={player.currentClub.club}
                    onChange={(e) => handleClubInputChange(e, 'currentClub', 'club')}
                    className="border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                    required
                >
                    <option value="">Select Club</option>
                    {clubsData.map(club => (
                        <option key={club._id} value={club._id}>{club.name}</option>
                    ))}
                </select>
                <label className="font-semibold text-gray-700 mt-2">From:</label>
                <input
                    type="date"
                    value={player.currentClub.from}
                    onChange={(e) => handleClubInputChange(e, 'currentClub', 'from')}
                    className="border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                    required
                />
            </div>
            <div className="flex flex-col">
                <label className="font-semibold text-gray-700">Country:</label>
                <select
                    value={player.country}
                    onChange={(e) => handleInputChange(e, 'country')}
                    className="border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                    required
                >
                    <option value="">Select Country</option>
                    {countriesData.map(country => (
                        <option key={country._id} value={country._id}>{country.country}</option>
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
                            required
                        >
                            <option value="">Select National Team</option>
                            {countriesData.map(country => (
                                <option key={country._id} value={country.name}>{country.country}</option>
                            ))}
                        </select>
                        <select
                            value={team.type}
                            onChange={(e) => handleInputChange(e, 'nationalTeams', index, 'type')}
                            className="border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                            required
                        >
                            <option value="">Select National Team Type</option>
                            {
                                ['U-17', 'U-19', 'U-21', 'A'].map(type => (
                                    <option key={type} value={type}>{type}</option>
                                ))
                            }
                        </select>
                        <label className="font-semibold text-gray-700">From:</label>
                        <input
                            type="date"
                            value={team.from}
                            onChange={(e) => handleInputChange(e, 'nationalTeams', index, 'from')}
                            className="border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                            required
                        />
                    </div>
                ))}
                <button
                    type="button"
                    onClick={handleAddNationalTeam}
                    className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
                >
                    Add Previous National Team
                </button>
            </div>
            <div>
                <label className="font-semibold text-gray-700">Previous Clubs:</label>
                {player.previousClubs.map((club, index) => (
                    <div key={index} className="flex items-center space-x-2 mb-2">
                        <select
                            value={club.club}
                            onChange={(e) => handleInputChange(e, 'previousClubs', index, 'name')}
                            className="border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                            required
                        >
                            <option value="">Select Club</option>
                            {clubsData.map(c => (
                                <option key={c._id} value={c._id}>{c.name}</option>
                            ))}
                        </select>
                        <label className="font-semibold text-gray-700">From:</label>
                        <input
                            type="date"
                            value={club.from}
                            onChange={(e) => handleInputChange(e, 'previousClubs', index, 'from')}
                            className="border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                            required
                        />
                        <label className="font-semibold text-gray-700">To:</label>
                        <input
                            type="date"
                            value={club.to}
                            onChange={(e) => handleInputChange(e, 'previousClubs', index, 'to')}
                            className="border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                            required
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
                    required
                />
            </div>
            <button
                type="submit"
                className="w-full px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400"
            >
                Save Player
            </button>
            {savePlayerDataMutation.isError && <div>Error saving player</div>}
            {savePlayerDataMutation.isPending && <div>Saving player...</div>}
            {savePlayerDataMutation.isSuccess && <div>Player saved successfully</div>}
        </form>
    );
}

export default AddPlayer