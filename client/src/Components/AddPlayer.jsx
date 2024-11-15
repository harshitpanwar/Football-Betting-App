import React, { useState } from 'react'
import { useQuery, useMutation } from '@tanstack/react-query';
import { getActiveClubs } from '../api/Clubs';
import { getPositions } from '../api/Position';
import { getCountries, getNationalTeams } from '../api/Country';
import { savePlayerData } from '../api/Player';
import Loader from './Loader/Loader';
import { Button } from './ui/button';
import { Input } from './ui/input';
import Select from 'react-select';
import { useToast } from '../hooks/use-toast';

const AddPlayer = () => {

    const { toast } = useToast()

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
        mutationFn: savePlayerData,
        onError: (error) => {
            toast({
                variant: "destructive",
                title: "Uh oh! Something went wrong.",
                description: error.message,
              })
      
        },
        onSuccess: (data) => {
            toast({
                description: "Player saved successfully",
              })
        }
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
        console.log(player)
    };
    const handleClubInputChange = (e, field, subfield) => {
        setPlayer({ ...player, [field]: { ...player[field], [subfield]: e.target.value } });
        console.log(player)
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        savePlayerDataMutation.mutate(player);
    };

    if(clubsDataLoading || positionsDataLoading || countriesDataLoading) {
        return <Loader />
    }

    return (
        <form onSubmit={handleSubmit} className="mx-10 p-6 bg-white shadow-md rounded-lg space-y-4">
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
                <Select
                    value={{value:
                        player.position
                            ? positionsData.find(position => position._id === player.position)
                            : null,
                            label: player.position? positionsData.find(position => position._id === player.position).position : null
                    }}
                    onChange={(selectedOption) => handleInputChange(
                        { target: { value: selectedOption.value } },
                        'position'
                    )}
                    options={positionsData.map(position => ({
                        label: position.position,
                        value: position._id,
                    }))}
                    className="w-full"
                    placeholder="Select Position"
                    isSearchable
                />
            </div>
            <div className="flex flex-col">
                <label className="font-semibold text-gray-700">Current Club:</label>
                <Select
                    value={{
                        value:
                        player.currentClub.club
                            ? clubsData.find(club => club._id === player.currentClub.club)
                            : null,
                    
                        label: player.currentClub.club?
                            clubsData.find(club => club._id === player.currentClub.club).name
                            : null
                    }}
                    onChange={(selectedOption) => handleClubInputChange(
                        { target: { value: selectedOption.value } },
                        'currentClub',
                        'club'
                    )}
                    options={clubsData.map(club => ({
                        label: club.name,
                        value: club._id,
                    }))}
                    className="w-full"
                    placeholder="Select Club"
                    isSearchable
                    required
                />

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
                <Select
                    value={{
                        value: player.country
                            ? countriesData.find(country => country._id === player.country)
                            : null,
                        label: player.country
                            ? countriesData.find(country => country._id === player.country).country
                            : null
                    }}
                    onChange={(selectedOption) => handleInputChange(
                        { target: { value: selectedOption.value } },
                        'country'
                    )}
                    options={countriesData.map(country => ({
                        label: country.country,
                        value: country._id,
                    }))}
                    className="w-full"
                    placeholder="Select Country"
                    isSearchable
                    required
                />
            </div>
            <div>
                <label className="font-semibold text-gray-700">National Teams:</label>
                {player.nationalTeams.map((team, index) => (
                    <div key={index} className="flex items-center space-x-2 mb-2">
                        <Select
                            value={{ label: team.name, value: team.name }}
                            onChange={(selectedOption) => {
                                handleInputChange(
                                    { target: { value: selectedOption.value } },
                                    'nationalTeams',
                                    index,
                                    'name'
                                );
                                fetchAllNationalTeams(selectedOption.value, index);
                            }}
                            options={countriesData.map(country => ({
                                label: country.country,
                                value: country.country,
                            }))}
                            className="w-full"
                            placeholder="Select National Team"
                            isSearchable
                        />
                        
                        <select
                            value={team.type}
                            onChange={(e) => handleInputChange(e, 'nationalTeams', index, 'type')}
                            className="border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                        >
                            <option value="" disabled={team.disabled}>Select National Team Type</option>
                            {team.teams.map(type => (
                                <option key={type} value={type}>{type}</option>
                            ))}
                        </select>

                        {/* From Date Input */}
                        <label className="font-semibold text-gray-700">From:</label>
                        <Input
                            type="date"
                            value={team.from}
                            onChange={(e) => handleInputChange(e, 'nationalTeams', index, 'from')}
                            className="border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
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
                        <Select
                            value={{
                                value: player.previousClubs[index].name
                                    ? clubsData.find(club => club._id === player.previousClubs[index].name)
                                    : null,
                                label: player.previousClubs[index].name
                                    ? clubsData.find(club => club._id === player.previousClubs[index].name).name
                                    : null
                                }}
                            onChange={(selectedOption) =>
                                handleInputChange(
                                    { target: { value: selectedOption.value } },
                                    'previousClubs',
                                    index,
                                    'name'
                                )
                            }
                            options={clubsData.map(c => ({
                                label: c.name,
                                value: c._id,
                            }))}
                            className="w-full"
                            placeholder="Select Club"
                            isSearchable
                            required
                        />

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
            {/* <div className="flex flex-col">
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
            </div> */}
            <Button
                type="submit"
                className="w-full px-4 py-2 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
            >
                Save Player
            </Button>

            {savePlayerDataMutation.isPending && <div>Saving player...</div>}

        </form>
    );
}

export default AddPlayer