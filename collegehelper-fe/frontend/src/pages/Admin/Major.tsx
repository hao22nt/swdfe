import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import DataTable from '../../components/DataTable';
import { GridColDef } from '@mui/x-data-grid';
import { fetchMajors, createMajor, updateMajor, deleteMajor } from '../../api/ApiCollection';
import { useEffect, useState } from 'react';

const Major = () => {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMajor, setEditingMajor] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(5);

  // Fetch majors với phân trang
  const { isLoading, isError, data } = useQuery({
    queryKey: ['majors', page, pageSize],
    queryFn: () => fetchMajors(page + 1, pageSize), // Giả sử API nhận pageNumber và pageSize
  });

  // Thêm displayId để hiển thị ID theo thứ tự số
  const transformedData = data?.map((item, index) => ({
    ...item,
    displayId: index + 1 + page * pageSize, // Tính thứ tự dựa trên trang
  })) || [];

  // Lọc dữ liệu theo searchTerm
  const filteredData = transformedData.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Mutation để tạo mới major
  const createMutation = useMutation({
    mutationFn: createMajor,
    onSuccess: () => {
      queryClient.invalidateQueries(['majors']);
      toast.success('Major created successfully!');
      setIsModalOpen(false);
    },
    onError: (error) => {
      console.error('Error creating major:', error);
      toast.error('Failed to create major!');
    },
  });

  // Mutation để cập nhật major
  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => updateMajor(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['majors']);
      toast.success('Major updated successfully!');
      setIsModalOpen(false);
      setEditingMajor(null);
    },
    onError: (error) => {
      console.error('Error updating major:', error);
      toast.error('Failed to update major!');
    },
  });

  // Mutation để xóa major
  const deleteMutation = useMutation({
    mutationFn: deleteMajor,
    onSuccess: () => {
      queryClient.invalidateQueries(['majors']);
      toast.success('Major deleted successfully!');
    },
    onError: (error) => {
      console.error('Error deleting major:', error);
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

  const columns: GridColDef[] = [
    { field: 'displayId', headerName: 'ID', width: 90, sortable: false },
    { field: 'name', headerName: 'Major Name', minWidth: 300, sortable: true },
    { field: 'relatedSkills', headerName: 'Related Skills', minWidth: 250, sortable: true },
    { field: 'description', headerName: 'Description', minWidth: 400, sortable: true },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 150,
      renderCell: (params) => (
        <div className="flex gap-2">
          <button
            className="btn btn-sm btn-primary"
            onClick={() => {
              setEditingMajor(params.row);
              setIsModalOpen(true);
            }}
          >
            Edit
          </button>
          <button
            className="btn btn-sm btn-error"
            onClick={() => deleteMutation.mutate(params.row.id)}
          >
            Delete
          </button>
        </div>
      ),
    },
  ];

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
        <div className="w-full flex justify-between mb-5">
          <div className="flex gap-1 justify-start flex-col items-start">
            <h2 className="font-bold text-2xl xl:text-4xl mt-0 pt-0 text-base-content dark:text-neutral-200">
              Major List
            </h2>
            {data?.length > 0 && (
              <span className="text-neutral dark:text-neutral-content font-medium text-base">
                {data.length} Majors Found
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

        {/* Ô tìm kiếm */}
        <div className="w-full mb-3">
          <input
            type="text"
            placeholder="Search by Major Name"
            className="input input-bordered w-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {isLoading ? (
          <div className="w-full flex justify-center">Loading majors...</div>
        ) : isError ? (
          <div className="w-full flex justify-center text-red-500">
            Error while fetching majors!
          </div>
        ) : (
          <DataTable
            slug="majors"
            columns={columns}
            rows={filteredData}
            page={page}
            pageSize={pageSize}
            rowCount={data?.total || filteredData.length} // Giả sử API trả về total
            onPageChange={(newPage) => setPage(newPage)}
            onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
            rowsPerPageOptions={[5, 10, 20]}
            pagination
          />
        )}

        {/* Modal để thêm/sửa */}
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