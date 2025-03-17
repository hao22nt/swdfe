import React from 'react';
import { GridColDef } from '@mui/x-data-grid';
import DataTable from '../../components/DataTable';
import { type Subject, type SubjectInput, getSubjects, createSubject, updateSubject, deleteSubject } from '../../api/ApiCollection';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import AddData from '../../components/AddData';
import { HiOutlineXMark } from 'react-icons/hi2';

const SubjectPage = () => {
  const [isOpen, setIsOpen] = React.useState(false); // Modal thêm mới
  const [viewOpen, setViewOpen] = React.useState(false); // Modal xem chi tiết
  const [editOpen, setEditOpen] = React.useState(false); // Modal chỉnh sửa
  const [selectedSubject, setSelectedSubject] = React.useState<Subject | null>(null); // Dữ liệu được chọn
  const queryClient = useQueryClient();

  const { isLoading, isError, isSuccess, data } = useQuery<Subject[]>({
    queryKey: ['allSubjects'],
    queryFn: getSubjects,
  });

  const createMutation = useMutation({
    mutationFn: createSubject,
    onSuccess: () => {
      toast.success("Subject created successfully!");
      queryClient.invalidateQueries({ queryKey: ['allSubjects'] });
      setIsOpen(false);
    },
    onError: (error: Error) => {
      toast.error(`Error creating subject: ${error.message}`);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: SubjectInput }) => updateSubject(id, data),
    onSuccess: () => {
      toast.success("Subject updated successfully!");
      queryClient.invalidateQueries({ queryKey: ['allSubjects'] });
      setEditOpen(false);
    },
    onError: (error: Error) => {
      toast.error(`Error updating subject: ${error.message}`);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteSubject,
    onSuccess: () => {
      toast.success("Subject deleted successfully!");
      queryClient.invalidateQueries({ queryKey: ['allSubjects'] });
    },
    onError: (error: Error) => {
      toast.error(`Error deleting subject: ${error.message}`);
    },
  });

  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 120 },
    { field: 'name', headerName: 'Name', minWidth: 200, flex: 1 },
    { field: 'description', headerName: 'Description', minWidth: 300, flex: 1 },
  ];

  React.useEffect(() => {
    if (isLoading) {
      toast.loading('Loading...', { id: 'promiseSubjects' });
    }
    if (isError) {
      toast.error('Error while getting the data!', { id: 'promiseSubjects' });
    }
    if (isSuccess) {
      toast.success('Got the subject data successfully!', { id: 'promiseSubjects' });
    }
  }, [isError, isLoading, isSuccess]);

  const handleCreate = (newData: SubjectInput) => {
    createMutation.mutate(newData);
  };

  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to delete this subject?")) {
      deleteMutation.mutate(id);
    }
  };

  const handleView = (id: string) => {
    const subject = data?.find((item) => item.id === id);
    if (subject) {
      setSelectedSubject(subject);
      setViewOpen(true);
    } else {
      toast.error("Subject not found!");
    }
  };

  const handleEdit = (id: string) => {
    const subject = data?.find((item) => item.id === id);
    if (subject) {
      setSelectedSubject(subject);
      setEditOpen(true);
    } else {
      toast.error("Subject not found!");
    }
  };

  const handleUpdate = (newData: SubjectInput) => {
    if (selectedSubject) {
      updateMutation.mutate({ id: selectedSubject.id, data: newData });
    }
  };

  return (
    <div className="w-full p-0 m-0">
      <div className="w-full flex flex-col items-stretch gap-3">
        <div className="w-full flex justify-between xl:mb-5">
          <div className="flex gap-1 justify-start flex-col items-start">
            <h2 className="font-bold text-2xl xl:text-4xl mt-0 pt-0 text-base-content dark:text-neutral-200">
              Subjects
            </h2>
            {data && data.length > 0 && (
              <span className="text-neutral dark:text-neutral-content font-medium text-base">
                {data.length} Subjects Found
              </span>
            )}
          </div>
          <button
            onClick={() => setIsOpen(true)}
            className={`btn ${isLoading ? 'btn-disabled' : 'btn-primary'}`}
          >
            Add New Subject +
          </button>
        </div>

        {isLoading ? (
          <DataTable
            slug="subjects"
            columns={columns}
            rows={[]}
            includeActionColumn={true}
            onDelete={handleDelete}
            onView={handleView}
            onEdit={handleEdit}
          />
        ) : isSuccess ? (
          <DataTable
            slug="subjects"
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
              slug="subjects"
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
          <AddData<SubjectInput>
            slug="subject"
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            onSubmit={handleCreate}
            fields={[
              { name: 'name', label: 'Name', type: 'text', required: true },
              { name: 'description', label: 'Description', type: 'textarea' },
            ]}
          />
        )}

        {/* Modal xem chi tiết */}
        {viewOpen && selectedSubject && (
          <div className="w-screen h-screen fixed top-0 left-0 flex justify-center items-center bg-black/75 z-[99]">
            <div className="w-[80%] xl:w-[50%] rounded-lg p-7 bg-base-100 relative flex flex-col items-stretch gap-5">
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
                <div><strong>Description:</strong> {selectedSubject.description || 'No description'}</div>
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
        {editOpen && selectedSubject && (
          <AddData<SubjectInput>
            slug="subject"
            isOpen={editOpen}
            setIsOpen={setEditOpen}
            onSubmit={handleUpdate}
            fields={[
              { name: 'name', label: 'Name', type: 'text', required: true },
              { name: 'description', label: 'Description', type: 'textarea' },
            ]}
            initialData={{
              name: selectedSubject.name,
              description: selectedSubject.description || null,
            }}
          />
        )}
      </div>
    </div>
  );
};

export default SubjectPage;