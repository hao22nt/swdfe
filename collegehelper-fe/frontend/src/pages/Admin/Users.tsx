import React from 'react';
import { GridColDef } from '@mui/x-data-grid';
import DataTable from '../../components/DataTable';
import { getUserList, updateUser, deleteUser, User, UserInput } from '../../api/ApiCollection';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import AddData from '../../components/AddData';
import { HiOutlineXMark } from 'react-icons/hi2';

const Users = () => {
  const [isOpen, setIsOpen] = React.useState(false); // Modal thêm mới
  const [viewOpen, setViewOpen] = React.useState(false); // Modal xem chi tiết
  const [editOpen, setEditOpen] = React.useState(false); // Modal chỉnh sửa
  const [selectedUser, setSelectedUser] = React.useState<User | null>(null); // Người dùng được chọn
  const queryClient = useQueryClient();

  const { isLoading, isError, isSuccess, data } = useQuery<User[]>({
    queryKey: ['allusers'],
    queryFn: getUserList,
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UserInput }) => updateUser(id, data),
    onSuccess: () => {
      toast.success("User updated successfully!");
      queryClient.invalidateQueries({ queryKey: ['allusers'] });
      setEditOpen(false);
    },
    onError: (error: Error) => {
      toast.error(`Error updating user: ${error.message}`);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteUser,
    onSuccess: () => {
      toast.success("User deleted successfully!");
      queryClient.invalidateQueries({ queryKey: ['allusers'] });
    },
    onError: (error: Error) => {
      toast.error(`Error deleting user: ${error.message}`);
    },
  });

  const columns: GridColDef[] = [
    {
      field: 'name',
      headerName: 'Name',
      minWidth: 220,
      flex: 1,
      renderCell: (params) => (
        <div className="flex gap-3 items-center">
          <span className="mb-0 pb-0 leading-none">{params.row.name}</span>
        </div>
      ),
    },
    { field: 'userName', headerName: 'Username', minWidth: 150, },
    { field: 'email', headerName: 'Email', minWidth: 200,  },
    { field: 'phoneNumber', headerName: 'Phone', minWidth: 120, },
    {
      field: 'userImage',
      headerName: 'Image',
      minWidth: 100,
      flex: 1,
      renderCell: (params) => (
        <img
          src={params.value || '/Portrait_Placeholder.png'}
          alt="user-image"
          className="w-10 h-10 object-cover rounded-full"
        />
      ),
    },
  ];
  

  React.useEffect(() => {
    if (isLoading) {
      toast.loading('Loading...', { id: 'promiseUsers' });
    }
    if (isError) {
      toast.error('Error while getting the data!', { id: 'promiseUsers' });
    }
    if (isSuccess) {
      toast.success('Got the data successfully!', { id: 'promiseUsers' });
    }
  }, [isError, isLoading, isSuccess]);

  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      deleteMutation.mutate(id);
    }
  };

  const handleView = (id: string) => {
    const user = data?.find((item) => item.id === id);
    if (user) {
      setSelectedUser(user);
      setViewOpen(true);
    } else {
      toast.error("User not found!");
    }
  };

  const handleEdit = (id: string) => {
    const user = data?.find((item) => item.id === id);
    if (user) {
      setSelectedUser(user);
      setEditOpen(true);
    } else {
      toast.error("User not found!");
    }
  };

  const handleUpdate = (newData: UserInput) => {
    if (selectedUser) {
      // Chỉ gửi các trường đã thay đổi
      const patchData: UserInput = {};
      if (newData.name !== selectedUser.name) patchData.name = newData.name;
      if (newData.userName !== selectedUser.userName) patchData.userName = newData.userName;
      if (newData.email !== selectedUser.email) patchData.email = newData.email;
      if (newData.phoneNumber !== undefined) patchData.phoneNumber = newData.phoneNumber; // Có thể để trống
      if (newData.userImage !== undefined) patchData.userImage = newData.userImage; // Có thể để trống

      updateMutation.mutate({ id: selectedUser.id, data: patchData });
    }
  };

  return (
    <div className="w-full p-0 m-0">
      <div className="w-full flex flex-col items-stretch gap-3">
        <div className="w-full flex justify-between mb-5">
          <div className="flex gap-1 justify-start flex-col items-start">
            <h2 className="font-bold text-2xl xl:text-4xl mt-0 pt-0 text-base-content dark:text-neutral-200">
              Users
            </h2>
            {data && data.length > 0 && (
              <span className="text-neutral dark:text-neutral-content font-medium text-base">
                {data.length} Users Found
              </span>
            )}
          </div>
          <button
            onClick={() => setIsOpen(true)}
            className={`btn ${isLoading ? 'btn-disabled' : 'btn-primary'}`}
          >
            Add New User +
          </button>
        </div>

        {isLoading ? (
          <DataTable
            slug="users"
            columns={columns}
            rows={[]}
            includeActionColumn={true}
            onDelete={handleDelete}
            onView={handleView}
            onEdit={handleEdit}
          />
        ) : isSuccess ? (
          <DataTable
            slug="users"
            columns={columns}
            rows={data || []}
            includeActionColumn={true}
            onDelete={handleDelete}
            onView={handleView}
            onEdit={handleEdit}
          />
        ) : (
          <>
            <DataTable
              slug="users"
              columns={columns}
              rows={[]}
              includeActionColumn={true}
              onDelete={handleDelete}
              onView={handleView}
              onEdit={handleEdit}
            />
            <div className="w-full flex justify-center">Error while getting the data!</div>
          </>
        )}

        {/* Modal thêm mới */}
        {isOpen && (
          <AddData<UserInput>
            slug="user"
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            fields={[
              { name: 'name', label: 'Name', type: 'text', required: true },
              { name: 'userName', label: 'Username', type: 'text', required: true },
              { name: 'email', label: 'Email', type: 'email', required: true },
              { name: 'phoneNumber', label: 'Phone Number', type: 'text' },
              { name: 'userImage', label: 'Image URL', type: 'text' },
            ]}
          />
        )}

        {/* Modal xem chi tiết */}
        {viewOpen && selectedUser && (
          <div className="w-screen h-screen fixed top-0 left-0 flex justify-center items-center bg-black/75 z-[99]">
            <div className="w-[80%] xl:w-[50%] rounded-lg p-7 bg-base-100 relative flex flex-col items-stretch gap-5">
              <button
                onClick={() => setViewOpen(false)}
                className="absolute top-5 right-3 btn btn-ghost btn-circle"
              >
                <HiOutlineXMark className="text-xl font-bold" />
              </button>
              <h3 className="text-2xl font-bold">User Details</h3>
              <div className="flex flex-col gap-4">
                <div><strong>ID:</strong> {selectedUser.id}</div>
                <div><strong>Name:</strong> {selectedUser.name}</div>
                <div><strong>Username:</strong> {selectedUser.userName}</div>
                <div><strong>Email:</strong> {selectedUser.email}</div>
                <div><strong>Phone Number:</strong> {selectedUser.phoneNumber || 'N/A'}</div>
                <div><strong>Image:</strong> {selectedUser.userImage ? <img src={selectedUser.userImage} alt="User" className="w-20" /> : 'No image'}</div>
              </div>
              <button
                onClick={() => setViewOpen(false)}
                className="btn btn-primary mt-4"
              >
                Close
              </button>
            </div>
          </div>
        )}

        {/* Modal chỉnh sửa */}
        {editOpen && selectedUser && (
          <AddData<UserInput>
            slug="user"
            isOpen={editOpen}
            setIsOpen={setEditOpen}
            onSubmit={handleUpdate}
            fields={[
              { name: 'name', label: 'Name', type: 'text', required: true },
              { name: 'userName', label: 'Username', type: 'text', required: true },
              { name: 'email', label: 'Email', type: 'email', required: true },
              { name: 'phoneNumber', label: 'Phone Number', type: 'text' }, // Không required
              { name: 'userImage', label: 'Image URL', type: 'text' }, // Không required
            ]}
            initialData={{
              name: selectedUser.name,
              userName: selectedUser.userName,
              email: selectedUser.email,
              phoneNumber: selectedUser.phoneNumber || '',
              userImage: selectedUser.userImage || '',
            }}
          />
        )}
      </div>
    </div>
  );
};

export default Users;