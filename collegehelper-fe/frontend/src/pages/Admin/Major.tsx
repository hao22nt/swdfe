import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { useEffect, useState, useMemo } from 'react';
import { fetchAllMajors, createMajor, updateMajor, deleteMajor } from '../../api/ApiCollection';

const Major = () => {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMajor, setEditingMajor] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(5);

  // Fetch all majors
  const { isLoading, isError, data } = useQuery({
    queryKey: ['majors'],
    queryFn: fetchAllMajors,
  });

  // Filter data based on search term
  const filteredData = useMemo(() => {
    return (data?.items || []).filter((item) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [data, searchTerm]);

  // Paginate data
  const paginatedData = useMemo(() => {
    const start = page * pageSize;
    return filteredData.slice(start, start + pageSize).map((item, index) => ({
      ...item,
      displayId: start + index + 1,
    }));
  }, [filteredData, page, pageSize]);

  // Handle Next and Previous
  const handleNext = () => {
    if ((page + 1) * pageSize < filteredData.length) {
      setPage(page + 1);
    }
  };

  const handlePrevious = () => {
    if (page > 0) {
      setPage(page - 1);
    }
  };

  // Handle create, update, and delete
  const createMutation = useMutation({
    mutationFn: createMajor,
    onSuccess: () => {
      queryClient.invalidateQueries(['majors']);
      toast.success('Major created successfully!');
      setIsModalOpen(false);
    },
    onError: (error) => {
      toast.error('Failed to create major!');
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => updateMajor(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['majors']);
      toast.success('Major updated successfully!');
      setIsModalOpen(false);
      setEditingMajor(null);
    },
    onError: (error) => {
      toast.error('Failed to update major!');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteMajor,
    onSuccess: () => {
      queryClient.invalidateQueries(['majors']);
      toast.success('Major deleted successfully!');
    },
    onError: (error) => {
      toast.error('Failed to delete major!');
    },
  });

  useEffect(() => {
    if (isLoading) {
      toast.loading('Loading majors...', { id: 'majorsToast' });
    } else {
      toast.dismiss('majorsToast');
    }
    if (isError) {
      toast.error('Failed to fetch majors!');
    }
  }, [isLoading, isError]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = {
      name: e.target.name.value,
      relatedSkills: e.target.relatedSkills.value,
      description: e.target.description.value,
    };

    if (editingMajor) {
      updateMutation.mutate({ id: editingMajor.id, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  return (
    <div className="w-full p-0 m-0">
      <div className="w-full flex flex-col items-stretch gap-3">
        {/* Header */}
        <div className="w-full flex justify-between mb-5">
          <div className="flex gap-1 justify-start flex-col items-start">
            <h2 className="font-bold text-2xl xl:text-4xl mt-0 pt-0 text-base-content dark:text-neutral-200">
              Major List
            </h2>
            {filteredData.length > 0 && (
              <span className="text-neutral dark:text-neutral-content font-medium text-base">
                {filteredData.length} Majors Found
              </span>
            )}
          </div>
          <button
            className="btn btn-primary"
            onClick={() => {
              setEditingMajor(null);
              setIsModalOpen(true);
            }}
          >
            Add New Major
          </button>
        </div>

        {/* Search Input */}
        <div className="w-full mb-3">
          <input
            type="text"
            placeholder="Search by Major Name"
            className="input input-bordered w-full"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setPage(0); // Reset page on search
            }}
          />
        </div>

        {/* Table or Loading/Error Message */}
        {isLoading ? (
          <div className="w-full flex justify-center">Loading majors...</div>
        ) : isError ? (
          <div className="w-full flex justify-center text-red-500">
            Error while fetching majors!
          </div>
        ) : (
          <div className="w-full">
            {/* Render Table */}
            <table className="table w-full border">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Major Name</th>
                  <th>Related Skills</th>
                  <th>Description</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedData.map((major) => (
                  <tr key={major.id}>
                    <td>{major.displayId}</td>
                    <td>{major.name}</td>
                    <td>{major.relatedSkills}</td>
                    <td>{major.description}</td>
                    <td>
                      <button
                        className="btn btn-sm btn-primary mr-2"
                        onClick={() => {
                          setEditingMajor(major);
                          setIsModalOpen(true);
                        }}
                      >
                        Edit
                      </button>
                      <button
                        className="btn btn-sm btn-error"
                        onClick={() => deleteMutation.mutate(major.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Pagination Controls */}
            <div className="flex justify-between items-center mt-4">
              <span>
                {page * pageSize + 1}–
                {Math.min((page + 1) * pageSize, filteredData.length)} of{' '}
                {filteredData.length} items
              </span>
              <div className="flex gap-2">
                <button
                  className="btn btn-sm"
                  onClick={handlePrevious}
                  disabled={page === 0}
                >
                  Previous
                </button>
                <button
                  className="btn btn-sm"
                  onClick={handleNext}
                  disabled={(page + 1) * pageSize >= filteredData.length}
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal for Add/Edit */}
        {isModalOpen && (
          <div className="modal modal-open">
            <div className="modal-box">
              <h3 className="font-bold text-lg">
                {editingMajor ? 'Edit Major' : 'Add New Major'}
              </h3>
              <form onSubmit={handleSubmit}>
                <div className="form-control">
                  <label className="label">Major Name</label>
                  <input
                    type="text"
                    name="name"
                    defaultValue={editingMajor?.name || ''}
                    className="input input-bordered"
                    required
                  />
                </div>
                <div className="form-control">
                  <label className="label">Related Skills</label>
                  <input
                    type="text"
                    name="relatedSkills"
                    defaultValue={editingMajor?.relatedSkills || ''}
                    className="input input-bordered"
                    required
                  />
                </div>
                <div className="form-control">
                  <label className="label">Description</label>
                  <textarea
                    name="description"
                    defaultValue={editingMajor?.description || ''}
                    className="textarea textarea-bordered"
                    required
                  />
                </div>
                <div className="modal-action">
                  <button type="submit" className="btn btn-primary">
                    {editingMajor ? 'Update' : 'Create'}
                  </button>
                  <button
                    type="button"
                    className="btn"
                    onClick={() => {
                      setIsModalOpen(false);
                      setEditingMajor(null);
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Major;