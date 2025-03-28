import { useState, useMemo, FormEvent } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { getSubjects, createSubject, updateSubject, deleteSubject, type Subject, type SubjectInput } from '../../api/ApiCollection';
import { HiOutlineXMark } from 'react-icons/hi2';

const SubjectPage = () => {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [viewOpen, setViewOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(0);
  const [pageSize] = useState(5); // Giữ cố định giống Major

  // Fetch tất cả subjects (không phân trang từ server)
  const { isLoading, isError, data } = useQuery({
    queryKey: ['allSubjects'],
    queryFn: () => getSubjects(), // Giả sử lấy hết dữ liệu
    staleTime: 5 * 60 * 1000,
  });

  // Filter data based on search term
  const filteredData = useMemo(() => {
    return (data?.message.items.$values || []).filter((item) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [data, searchTerm]);

  // Paginate data
  const paginatedData = useMemo(() => {
    const start = page * pageSize;
    return filteredData.slice(start, start + pageSize).map((item, index) => ({
      ...item,
      displayId: start + index + 1, // Thêm displayId giống Major
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

  // Mutations
  const createMutation = useMutation({
    mutationFn: createSubject,
    onSuccess: () => {
      toast.success('Subject created successfully!');
      queryClient.invalidateQueries({ queryKey: ['allSubjects'] });
      setIsModalOpen(false);
    },
    onError: (error: Error) => toast.error(`Error creating subject: ${error.message}`),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: SubjectInput }) => updateSubject(id, data),
    onSuccess: () => {
      toast.success('Subject updated successfully!');
      queryClient.invalidateQueries({ queryKey: ['allSubjects'] });
      setEditOpen(false);
      setSelectedSubject(null);
    },
    onError: (error: Error) => toast.error(`Error updating subject: ${error.message}`),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteSubject,
    onSuccess: () => {
      toast.success('Subject deleted successfully!');
      queryClient.invalidateQueries({ queryKey: ['allSubjects'] });
    },
    onError: (error: Error) => toast.error(`Error deleting subject: ${error.message}`),
  });

  const handleCreateSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = {
      name: (form.elements.namedItem('name') as HTMLInputElement).value,
      description: (form.elements.namedItem('description') as HTMLTextAreaElement).value || null,
    };
    createMutation.mutate(formData);
  };

  const handleUpdateSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = {
      name: (form.elements.namedItem('name') as HTMLInputElement).value,
      description: (form.elements.namedItem('description') as HTMLTextAreaElement).value || null,
    };
    if (selectedSubject) {
      updateMutation.mutate({ id: selectedSubject.id, data: formData });
    }
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this subject?')) {
      deleteMutation.mutate(id);
    }
  };

  const handleEdit = (id: string) => {
    const subject = filteredData.find((item) => item.id === id);
    if (subject) {
      setSelectedSubject(subject);
      setEditOpen(true);
    } else {
      toast.error('Subject not found!');
    }
  };

  return (
    <div className="w-full p-0 m-0">
      <div className="w-full flex flex-col items-stretch gap-3">
        {/* Header */}
        <div className="w-full flex justify-between mb-5">
          <div className="flex gap-1 justify-start flex-col items-start">
            <h2 className="font-bold text-2xl xl:text-4xl mt-0 pt-0 text-base-content dark:text-neutral-200">
              Subjects
            </h2>
            {filteredData.length > 0 && (
              <span className="text-neutral dark:text-neutral-content font-medium text-base">
                {filteredData.length} Subjects Found
              </span>
            )}
          </div>
          <button
            className="btn btn-primary"
            onClick={() => {
              setSelectedSubject(null);
              setIsModalOpen(true);
            }}
          >
            Add New Subject
          </button>
        </div>

        {/* Search Input */}
        <div className="w-full mb-3">
          <input
            type="text"
            placeholder="Search by Subject Name"
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
          <div className="w-full flex justify-center">Loading subjects...</div>
        ) : isError ? (
          <div className="w-full flex justify-center text-red-500">
            Error while fetching subjects!
          </div>
        ) : (
          <div className="w-full">
            {/* Render Table */}
            <table className="table w-full border">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Description</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedData.map((subject) => (
                  <tr key={subject.id}>
                    <td>{subject.displayId}</td>
                    <td>{subject.name}</td>
                    <td>{subject.description || 'No description'}</td>
                    <td>
                      <button
                        className="btn btn-sm btn-primary mr-2"
                        onClick={() => handleEdit(subject.id)}
                      >
                        Edit
                      </button>
                      <button
                        className="btn btn-sm btn-error"
                        onClick={() => handleDelete(subject.id)}
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

        {/* Modal for Add */}
        {isModalOpen && (
          <div className="modal modal-open">
            <div className="modal-box">
              <h3 className="font-bold text-lg">Add New Subject</h3>
              <form onSubmit={handleCreateSubmit}>
                <div className="form-control">
                  <label className="label">Name</label>
                  <input
                    type="text"
                    name="name"
                    className="input input-bordered"
                    required
                  />
                </div>
                <div className="form-control">
                  <label className="label">Description</label>
                  <textarea
                    name="description"
                    className="textarea textarea-bordered"
                  />
                </div>
                <div className="modal-action">
                  <button type="submit" className="btn btn-primary">
                    Create
                  </button>
                  <button
                    type="button"
                    className="btn"
                    onClick={() => setIsModalOpen(false)}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal for View */}
        {viewOpen && selectedSubject && (
          <div className="fixed inset-0 flex justify-center items-center bg-black/75 z-[99]">
            <div className="w-[80%] max-w-lg rounded-lg p-7 bg-base-100 relative flex flex-col gap-5">
              <button
                onClick={() => setViewOpen(false)}
                className="absolute top-5 right-3 btn btn-ghost btn-circle"
              >
                <HiOutlineXMark className="text-xl font-bold" />
              </button>
              <h3 className="text-2xl font-bold">Subject Details</h3>
              <div className="flex flex-col gap-4">
                <div><strong>ID:</strong> {selectedSubject.id}</div>
                <div><strong>Name:</strong> {selectedSubject.name}</div>
                <div>
                  <strong>Description:</strong> {selectedSubject.description || 'No description'}
                </div>
              </div>
              <button onClick={() => setViewOpen(false)} className="btn btn-primary mt-4">
                Close
              </button>
            </div>
          </div>
        )}

        {/* Modal for Edit */}
        {editOpen && selectedSubject && (
          <div className="modal modal-open">
            <div className="modal-box">
              <h3 className="font-bold text-lg">Edit Subject</h3>
              <form onSubmit={handleUpdateSubmit}>
                <div className="form-control">
                  <label className="label">Name</label>
                  <input
                    type="text"
                    name="name"
                    defaultValue={selectedSubject.name}
                    className="input input-bordered"
                    required
                  />
                </div>
                <div className="form-control">
                  <label className="label">Description</label>
                  <textarea
                    name="description"
                    defaultValue={selectedSubject.description || ''}
                    className="textarea textarea-bordered"
                  />
                </div>
                <div className="modal-action">
                  <button type="submit" className="btn btn-primary">
                    Update
                  </button>
                  <button
                    type="button"
                    className="btn"
                    onClick={() => {
                      setEditOpen(false);
                      setSelectedSubject(null);
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

export default SubjectPage;