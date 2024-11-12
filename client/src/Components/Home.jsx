import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getClubs, addClub, editClub, deleteClub } from '../api/Clubs';
import { Table, TableHead, TableRow, TableBody, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Edit, Trash2 } from "lucide-react";
import Loader from './Loader/Loader';

const Home = () => {
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState('');
    const [searchDebounce, setSearchDebounce] = useState('');
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedClubId, setSelectedClubId] = useState(null);
    const [clubName, setClubName] = useState('');
    const queryClient = useQueryClient();

    const { isLoading, error, data } = useQuery({
        queryKey: ['clubs', page, searchDebounce],
        queryFn: () => getClubs({ page, search }),
    });

    useEffect(() => {
        const timeOutId = setTimeout(() => {
            setSearchDebounce(search);
        }, 1000);
        return () => clearTimeout(timeOutId);
    }, [search]);

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
        editClubMutation.mutate({ id: selectedClubId, name: clubName });
    };

    const handleDeleteClub = () => {
        deleteClubMutation.mutate(selectedClubId);
    };

    if (isLoading) return <Loader />;
    if (error) return <div>Error fetching data</div>;

    return (
        <div className='ml-5'>
            <div className="flex justify-center items-center gap-10 mt-5">
                {/* <h1 className="text-2xl font-bold">Clubs</h1> */}
                <Input
                    type="text"
                    placeholder="Search clubs..."
                    className="border border-gray-400 p-1"
                    value={search}
                    autoFocus
                    onChange={(e) => setSearch(e.target.value)}
                />
                <Button onClick={() => setShowAddModal(true)} variant="green">
                    Add Club
                </Button>
            </div>

            <Table className="w-full mt-5">
                <TableHead className="bg-gray-100">
                    <TableRow>
                        <TableCell className="font-semibold p-3">Club Name</TableCell>
                        <TableCell className="font-semibold p-3">Actions</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {data && data.clubs && data.clubs.map((club) => (
                        <TableRow key={club._id}>
                            <TableCell>{club.name}</TableCell>
                            <TableCell>
                                <Button
                                    onClick={() => { setSelectedClubId(club._id); setShowEditModal(true); }}
                                    variant="yellow"
                                    className="mr-2"
                                >
                                    <div className="flex flex-row gap-2 items-center">
                                        <p>Edit</p>
                                        <Edit size={16} />
                                    </div>
                                </Button>
                                <Button
                                    onClick={() => { setSelectedClubId(club._id); setShowDeleteModal(true); }}
                                    variant="red"
                                >
                                    <div className="flex flex-row gap-2 items-center">
                                        <p>Delete</p>
                                        <Trash2 size={16} color='red'/>
                                    </div>
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

            <div className="flex flex-row gap-5 justify-center mt-5">
                <Button onClick={() => setPage(page - 1)} disabled={page === 1}>
                    Previous
                </Button>
                <Button onClick={() => setPage(page + 1)} disabled={data.total <= data.perPage}>
                    Next
                </Button>
                {page} of {Math.ceil(data.total / data.perPage)}
            </div>

            {/* Add Modal */}
            {showAddModal && (
                <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
                    <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
                        <h2 className="text-lg font-semibold text-gray-800 mb-4">Add Club</h2>
                        <input
                            type="text"
                            placeholder="Club Name"
                            className="border border-gray-300 rounded p-2 w-full mb-4"
                            value={clubName}
                            onChange={(e) => setClubName(e.target.value)}
                        />
                        <div className="flex justify-end gap-4">
                            <button
                                onClick={() => setShowAddModal(false)}
                                className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleAddClub}
                                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                            >
                                Add
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Edit Modal */}
            {showEditModal && (
                <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
                    <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
                        <h2 className="text-lg font-semibold text-gray-800 mb-4">Edit Club</h2>
                        <input
                            type="text"
                            placeholder="New Club Name"
                            className="border border-gray-300 rounded p-2 w-full mb-4"
                            value={clubName}
                            onChange={(e) => setClubName(e.target.value)}
                        />
                        <div className="flex justify-end gap-4">
                            <button
                                onClick={() => setShowEditModal(false)}
                                className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleEditClub}
                                className="bg-yellow-500 text-white px-4 py-2 rounded-md hover:bg-yellow-600 transition-colors"
                            >
                                Update
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Modal */}
            {showDeleteModal && (
                <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
                    <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
                        <h2 className="text-lg font-semibold text-gray-800 mb-4">Confirm Delete</h2>
                        <p className="text-gray-700 mb-4">Are you sure you want to delete this club?</p>
                        <div className="flex justify-end gap-4">
                            <button
                                onClick={() => setShowDeleteModal(false)}
                                className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDeleteClub}
                                className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors"
                            >
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
