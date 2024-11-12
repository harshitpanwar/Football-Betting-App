import React, { useState } from 'react'
import { useQuery, useMutation } from '@tanstack/react-query';
import { getActiveClubs } from '../api/Clubs';
import { getPositions } from '../api/Position';
import { getCountries, getNationalTeams } from '../api/Country';
import { savePlayerData } from '../api/Player';
import Loader from './Loader/Loader';
import { Button } from './ui/button';
import { Input } from './ui/input';

const AddPlayer = () => {

        const [player, setPlayer] = useState({
            name: '',
            dateOfBirth: '',
            position: '',
            currentClub: { club: '', from: '' },
            country: '',
            nationalTeams: [{ name: '', from: '', type: '', teams: [], disabled: true }],
            previousClubs: [{ name: '', from: '', to: '' }],
            rating: ''
        });


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
        mutationFn: savePlayerData
    })

    const fetchAllNationalTeams = async (country, index) => {
        const teams = await getNationalTeams(country);
        const teamsArray = teams.map(team => team.type);
        const updatedArray = [...player.nationalTeams];
        updatedArray[index].teams = teamsArray;
        updatedArray[index].disabled = false;
        setPlayer({ ...player, nationalTeams: updatedArray });
    }

    const handleAddPreviousClub = () => {
        setPlayer(prevState => ({
            ...prevState,
            previousClubs: [...prevState.previousClubs, { name: '', from: '', to: '' }]
        }));
    };

    const handleAddNationalTeam = () => {
        setPlayer(prevState => ({
            ...prevState,
            nationalTeams: [...prevState.nationalTeams, { name: '', from: '', type: '', teams: [], disabled: true }]
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
    const handleClubInputChange = (e, field, subfield) => {
        setPlayer({ ...player, [field]: { ...player[field], [subfield]: e.target.value } });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        savePlayerDataMutation.mutate(player);
    };

    if(clubsDataLoading || positionsDataLoading || countriesDataLoading) {
        return <Loader />
    }

    return (
        <form onSubmit={handleSubmit} className="max-w-2xl mx-auto p-6 bg-white shadow-md rounded-lg space-y-4">
            <div className="flex flex-col">
                <label className="font-semibold text-gray-700">Name:</label>
                <Input
                    type="text"
                    value={player.name}
                    onChange={(e) => handleInputChange(e, 'name')}
                    className="border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                    required
                />
            </div>
            <div className="flex flex-col">
                <label className="font-semibold text-gray-700">Date of Birth:</label>
                <Input
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
                <Input
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
                            onChange={(e) => {
                                handleInputChange(e, 'nationalTeams', index, 'name')
                                fetchAllNationalTeams(team.name, index);
                            }}
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
                            <option value="" disabled={team.disabled}>Select National Team Type</option>
                            {
                                team.teams.map(type => (
                                    <option key={type} value={type}>{type}</option>
                                ))
                            }
                        </select>
                        <label className="font-semibold text-gray-700">From:</label>
                        <Input
                            type="date"
                            value={team.from}
                            onChange={(e) => handleInputChange(e, 'nationalTeams', index, 'from')}
                            className="border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                            required
                        />
                    </div>
                ))}
                <Button
                    type="button"
                    onClick={handleAddNationalTeam}
                    className="mt-2 px-4 py-2 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                >
                    Add Previous National Team
                </Button>
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
                        <Input
                            type="date"
                            value={club.from}
                            onChange={(e) => handleInputChange(e, 'previousClubs', index, 'from')}
                            className="border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                            required
                        />
                        <label className="font-semibold text-gray-700">To:</label>
                        <Input
                            type="date"
                            value={club.to}
                            onChange={(e) => handleInputChange(e, 'previousClubs', index, 'to')}
                            className="border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                            required
                        />
                    </div>
                ))}
                <Button
                    type="button"
                    onClick={handleAddPreviousClub}
                    className="mt-2 px-4 py-2 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                >
                    Add Previous Club
                </Button>
            </div>
            <div className="flex flex-col">
                <label className="font-semibold text-gray-700">Rating:</label>
                <Input
                    type="number"
                    min="1"
                    max="5"
                    value={player.rating}
                    onChange={(e) => handleInputChange(e, 'rating')}
                    className="border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                    required
                />
            </div>
            <Button
                type="submit"
                className="w-full px-4 py-2 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
            >
                Save Player
            </Button>
            {savePlayerDataMutation.isError && <div>Error saving player</div>}
            {savePlayerDataMutation.isPending && <div>Saving player...</div>}
            {savePlayerDataMutation.isSuccess && <div>Player saved successfully</div>}
        </form>
    );
}

export default AddPlayer