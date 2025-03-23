import React from 'react';
import { GridColDef } from '@mui/x-data-grid';
import DataTable from '../../components/DataTable';
import { getAdmissionMethod, createAdmissionMethod, deleteAdmissionMethod, updateAdmissionMethod, AdmissionMethod, AdmissionInput } from '../../api/ApiCollection';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import AddData from '../../components/AddData';
import { HiOutlineXMark } from 'react-icons/hi2';

const Admission = () => {
  const [isOpen, setIsOpen] = React.useState(false); // Modal thêm mới
  const [viewOpen, setViewOpen] = React.useState(false); // Modal xem chi tiết
  const [editOpen, setEditOpen] = React.useState(false); // Modal chỉnh sửa
  const [selectedMethod, setSelectedMethod] = React.useState<AdmissionMethod | null>(null); // Dữ liệu được chọn
  const queryClient = useQueryClient();

  const { isLoading, isError, isSuccess, data } = useQuery<AdmissionMethod[]>({
    queryKey: ['allAdmissions'],
    queryFn: getAdmissionMethod,
  });

  const createMutation = useMutation({
    mutationFn: createAdmissionMethod,
    onSuccess: () => {
      toast.success("Admission method created successfully!");
      queryClient.invalidateQueries({ queryKey: ['allAdmissions'] });
      setIsOpen(false);
    },
    onError: (error: Error) => {
      toast.error(`Error creating admission method: ${error.message}`);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteAdmissionMethod,
    onSuccess: () => {
      toast.success("Admission method deleted successfully!");
      queryClient.invalidateQueries({ queryKey: ['allAdmissions'] });
    },
    onError: (error: Error) => {
      toast.error(`Error deleting admission method: ${error.message}`);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: AdmissionInput }) => updateAdmissionMethod(id, data),
    onSuccess: () => {
      toast.success("Admission method updated successfully!");
      queryClient.invalidateQueries({ queryKey: ['allAdmissions'] });
      setEditOpen(false);
    },
    onError: (error: Error) => {
      toast.error(`Error updating admission method: ${error.message}`);
    },
  });

  const columns: GridColDef[] = [
    //{ field: 'id', headerName: 'ID', width: 120 },
    { field: 'methodName', headerName: 'Method Name', minWidth: 250, flex: 1 },
    { field: 'requiredDocuments', headerName: 'Required Documents', minWidth: 200, flex: 1 },
    { field: 'description', headerName: 'Description', minWidth: 300, flex: 1 },
  ];

  React.useEffect(() => {
    if (isLoading) {
      toast.loading('Loading...', { id: 'promiseAdmissions' });
    }
    if (isError) {
      toast.error('Error while getting the data!', { id: 'promiseAdmissions' });
    }
    if (isSuccess) {
      toast.success('Got the admission data successfully!', { id: 'promiseAdmissions' });
    }
  }, [isError, isLoading, isSuccess]);

  const handleCreate = (newData: AdmissionInput) => {
    createMutation.mutate(newData);
  };

  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to delete this admission method?")) {
      deleteMutation.mutate(id);
    }
  };

  const handleView = (id: string) => {
    const method = data?.find((item) => item.id === id);
    if (method) {
      setSelectedMethod(method);
      setViewOpen(true);
    } else {
      toast.error("Admission method not found!");
    }
  };

  const handleEdit = (id: string) => {
    const method = data?.find((item) => item.id === id);
    if (method) {
      setSelectedMethod(method);
      setEditOpen(true);
    } else {
      toast.error("Admission method not found!");
    }
  };

  const handleUpdate = (newData: AdmissionInput) => {
    if (selectedMethod) {
      updateMutation.mutate({ id: selectedMethod.id, data: newData });
    }
  };

  return (
    <div className="w-full p-0 m-0">
      <div className="w-full flex flex-col items-stretch gap-3">
        <div className="w-full flex justify-between xl:mb-5">
          <div className="flex gap-1 justify-start flex-col items-start">
            <h2 className="font-bold text-2xl xl:text-4xl mt-0 pt-0 text-base-content dark:text-neutral-200">
              Admission Methods
            </h2>
            {data && data.length > 0 && (
              <span className="text-neutral dark:text-neutral-content font-medium text-base">
                {data.length} Admission Methods Found
              </span>
            )}
          </div>
          <button
            onClick={() => setIsOpen(true)}
            className={`btn ${isLoading ? 'btn-disabled' : 'btn-primary'}`}
          >
            Add New Admission Method +
          </button>
        </div>

        {isLoading ? (
          <DataTable
            slug="admission-methods"
            columns={columns}
            rows={[]}
            includeActionColumn={true}
            onDelete={handleDelete}
            onView={handleView}
            onEdit={handleEdit} // Thêm prop onEdit
          />
        ) : isSuccess ? (
          <DataTable
            slug="admission-methods"
            columns={columns}
            rows={data || []}
            includeActionColumn={true}
            onDelete={handleDelete}
            onView={handleView}
            onEdit={handleEdit} // Thêm prop onEdit
          />
        ) : (
          <>
            <DataTable
              slug="admission-methods"
              columns={columns}
              rows={[]}
              includeActionColumn={true}
              onDelete={handleDelete}
              onView={handleView}
              onEdit={handleEdit} // Thêm prop onEdit
            />
            <div className="w-full flex justify-center">Error while getting the data!</div>
          </>
        )}

        {/* Modal thêm mới */}
        {isOpen && (
          <AddData
            slug="admission-method"
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            onSubmit={handleCreate}
            fields={[
              { name: 'methodName', label: 'Method Name', type: 'text', required: true },
              { name: 'requiredDocuments', label: 'Required Documents', type: 'text' },
              { name: 'description', label: 'Description', type: 'textarea' },
            ]}
          />
        )}

        {/* Modal xem chi tiết */}
        {viewOpen && selectedMethod && (
          <div className="w-screen h-screen fixed top-0 left-0 flex justify-center items-center bg-black/75 z-[99]">
            <div className="w-[80%] xl:w-[50%] rounded-lg p-7 bg-base-100 relative flex flex-col items-stretch gap-5">
              <button
                onClick={() => setViewOpen(false)}
                className="absolute top-5 right-3 btn btn-ghost btn-circle"
              >
                <HiOutlineXMark className="text-xl font-bold" />
              </button>
              <h3 className="text-2xl font-bold">Admission Method Details</h3>
              <div className="flex flex-col gap-4">
                <div><strong>ID:</strong> {selectedMethod.id}</div>
                <div><strong>Method Name:</strong> {selectedMethod.methodName}</div>
                <div><strong>Required Documents:</strong> {selectedMethod.requiredDocuments || 'None'}</div>
                <div><strong>Description:</strong> {selectedMethod.description || 'No description'}</div>
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
        {editOpen && selectedMethod && (
          <AddData
            slug="admission-method"
            isOpen={editOpen}
            setIsOpen={setEditOpen}
            onSubmit={handleUpdate}
            fields={[
              { name: 'methodName', label: 'Method Name', type: 'text', required: true },
              { name: 'requiredDocuments', label: 'Required Documents', type: 'text' },
              { name: 'description', label: 'Description', type: 'textarea' },
            ]}
            initialData={{
              methodName: selectedMethod.methodName,
              requiredDocuments: selectedMethod.requiredDocuments || '',
              description: selectedMethod.description || '',
            }}
          />
        )}
      </div>
    </div>
  );
};

export default Admission;