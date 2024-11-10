import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getClubs, addClub, editClub, deleteClub } from '../api/Clubs';

const Home = () => {
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState('');
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedClubId, setSelectedClubId] = useState(null);
    const [clubName, setClubName] = useState('');
    const queryClient = useQueryClient();

    const { isLoading, error, data } = useQuery({
        queryKey: ['clubs', page, search],
        queryFn: () => getClubs({ page, search }),
    });

    const addClubMutation = useMutation({
        mutationFn: addClub,
        onSuccess: () => {
            queryClient.invalidateQueries('clubs');
            setShowAddModal(false);
            setClubName('');
        },
    });

    const editClubMutation = useMutation({
        mutationFn: editClub,
        onSuccess: () => {
            queryClient.invalidateQueries('clubs');
            setShowEditModal(false);
            setClubName('');
        },
    });

    const deleteClubMutation = useMutation({
        mutationFn: deleteClub,
        onSuccess: () => {
            queryClient.invalidateQueries('clubs');
            setShowDeleteModal(false);
        },
    });

    const handleAddClub = () => {
        addClubMutation.mutate({ name: clubName });
    };

    const handleEditClub = () => {
        console.log(selectedClubId, clubName);
        editClubMutation.mutate({ id: selectedClubId, name: clubName });
    };

    const handleDeleteClub = () => {
        deleteClubMutation.mutate(selectedClubId);
    };

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error fetching data</div>;

    return (
        <div>
            <div className="flex justify-center items-center gap-10 mt-5">
                <h1 className="text-2xl font-bold">Clubs</h1>
                <input
                    type="text"
                    placeholder="Search clubs..."
                    className="border border-gray-400 p-1"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
                <button
                    onClick={() => setShowAddModal(true)}
                    className="bg-green-500 text-white p-2 rounded"
                >
                    Add Club
                </button>
            </div>

            {data && data.clubs && data.clubs.map((club) => (
                <div key={club._id} className="flex flex-row justify-between mr-5 ml-5">
                    <div className="border p-2 my-2">
                        <h2>{club.name}</h2>
                    </div>
                    <div>
                        <button
                            onClick={() => { setSelectedClubId(club._id); setShowEditModal(true); }}
                            className="bg-yellow-500 text-white p-1 px-4 rounded mr-2"
                        >
                            Edit
                        </button>
                        <button
                            onClick={() => { setSelectedClubId(club._id); setShowDeleteModal(true); }}
                            className="bg-red-500 text-white p-1 px-4 rounded"
                        >
                            Delete
                        </button>
                    </div>
                </div>
            ))}

            <div className="flex flex-row gap-5 justify-center">
                <button
                    onClick={() => setPage(page - 1)}
                    disabled={page === 1}
                    className="bg-blue-500 text-white p-1 px-4 rounded"
                >
                    Previous
                </button>
                <button
                    onClick={() => setPage(page + 1)}
                    disabled={data.total <= data.perPage}
                    className="bg-blue-500 text-white p-1 px-4 rounded"
                >
                    Next
                </button>
                {page} of {Math.ceil(data.total / data.perPage)}
            </div>

            {/* Add Modal */}
            {showAddModal && (
                <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
                        <h2 className="text-lg font-bold mb-4">Add Club</h2>
                        <input
                            type="text"
                            placeholder="Club Name"
                            className="border border-gray-300 rounded p-2 w-full mb-4"
                            value={clubName}
                            onChange={(e) => setClubName(e.target.value)}
                        />
                        <div className="flex justify-end gap-4">
                            <button onClick={() => setShowAddModal(false)} className="bg-gray-500 text-white p-2 rounded hover:bg-gray-600 transition">
                                Cancel
                            </button>
                            <button onClick={handleAddClub} className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition">
                                Add
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Edit Modal */}
            {showEditModal && (
                <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
                        <h2 className="text-lg font-bold mb-4">Edit Club</h2>
                        <input
                            type="text"
                            placeholder="New Club Name"
                            className="border border-gray-300 rounded p-2 w-full mb-4"
                            value={clubName}
                            onChange={(e) => setClubName(e.target.value)}
                        />
                        <div className="flex justify-end gap-4">
                            <button onClick={() => setShowEditModal(false)} className="bg-gray-500 text-white p-2 rounded hover:bg-gray-600 transition">
                                Cancel
                            </button>
                            <button onClick={handleEditClub} className="bg-yellow-500 text-white p-2 rounded hover:bg-yellow-600 transition">
                                Update
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Modal */}
            {showDeleteModal && (
                <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
                        <h2 className="text-lg font-bold mb-4">Confirm Delete</h2>
                        <p className="mb-4">Are you sure you want to delete this club?</p>
                        <div className="flex justify-end gap-4">
                            <button onClick={() => setShowDeleteModal(false)} className="bg-gray-500 text-white p-2 rounded hover:bg-gray-600 transition">
                                Cancel
                            </button>
                            <button onClick={handleDeleteClub} className="bg-red-500 text-white p-2 rounded hover:bg-red-600 transition">
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Home;
