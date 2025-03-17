import React from 'react';
import { GridColDef } from '@mui/x-data-grid';
import DataTable from '../../components/DataTable';
import { type AcademicYear, type AcademicYearInput, getAcademicYears, createAcademicYear, updateAcademicYear, deleteAcademicYear } from '../../api/ApiCollection';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import AddData from '../../components/AddData';
import { HiOutlineXMark } from 'react-icons/hi2';

const AcademicYearPage = () => {
  const [isOpen, setIsOpen] = React.useState(false); // Modal thêm mới
  const [viewOpen, setViewOpen] = React.useState(false); // Modal xem chi tiết
  const [editOpen, setEditOpen] = React.useState(false); // Modal chỉnh sửa
  const [selectedYear, setSelectedYear] = React.useState<AcademicYear | null>(null); // Dữ liệu được chọn
  const queryClient = useQueryClient();

  const { isLoading, isError, isSuccess, data } = useQuery<AcademicYear[]>({
    queryKey: ['allAcademicYears'],
    queryFn: getAcademicYears,
  });

  const createMutation = useMutation({
    mutationFn: createAcademicYear,
    onSuccess: () => {
      toast.success("Academic year created successfully!");
      queryClient.invalidateQueries({ queryKey: ['allAcademicYears'] });
      setIsOpen(false);
    },
    onError: (error: Error) => {
      toast.error(`Error creating academic year: ${error.message}`);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: AcademicYearInput }) => updateAcademicYear(id, data),
    onSuccess: () => {
      toast.success("Academic year updated successfully!");
      queryClient.invalidateQueries({ queryKey: ['allAcademicYears'] });
      setEditOpen(false);
    },
    onError: (error: Error) => {
      toast.error(`Error updating academic year: ${error.message}`);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteAcademicYear,
    onSuccess: () => {
      toast.success("Academic year deleted successfully!");
      queryClient.invalidateQueries({ queryKey: ['allAcademicYears'] });
    },
    onError: (error: Error) => {
      toast.error(`Error deleting academic year: ${error.message}`);
    },
  });

  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 120 },
    { field: 'year', headerName: 'Year', minWidth: 150, flex: 1 },
  ];

  React.useEffect(() => {
    if (isLoading) {
      toast.loading('Loading...', { id: 'promiseAcademicYears' });
    }
    if (isError) {
      toast.error('Error while getting the data!', { id: 'promiseAcademicYears' });
    }
    if (isSuccess) {
      toast.success('Got the academic year data successfully!', { id: 'promiseAcademicYears' });
    }
  }, [isError, isLoading, isSuccess]);

  const handleCreate = (newData: AcademicYearInput) => {
    createMutation.mutate(newData);
  };

  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to delete this academic year?")) {
      deleteMutation.mutate(id);
    }
  };

  const handleView = (id: string) => {
    const year = data?.find((item) => item.id === id);
    if (year) {
      setSelectedYear(year);
      setViewOpen(true);
    } else {
      toast.error("Academic year not found!");
    }
  };

  const handleEdit = (id: string) => {
    const year = data?.find((item) => item.id === id);
    if (year) {
      setSelectedYear(year);
      setEditOpen(true);
    } else {
      toast.error("Academic year not found!");
    }
  };

  const handleUpdate = (newData: AcademicYearInput) => {
    if (selectedYear) {
      updateMutation.mutate({ id: selectedYear.id, data: newData });
    }
  };

  return (
    <div className="w-full p-0 m-0">
      <div className="w-full flex flex-col items-stretch gap-3">
        <div className="w-full flex justify-between xl:mb-5">
          <div className="flex gap-1 justify-start flex-col items-start">
            <h2 className="font-bold text-2xl xl:text-4xl mt-0 pt-0 text-base-content dark:text-neutral-200">
              Academic Years
            </h2>
            {data && data.length > 0 && (
              <span className="text-neutral dark:text-neutral-content font-medium text-base">
                {data.length} Academic Years Found
              </span>
            )}
          </div>
          <button
            onClick={() => setIsOpen(true)}
            className={`btn ${isLoading ? 'btn-disabled' : 'btn-primary'}`}
          >
            Add New Academic Year +
          </button>
        </div>

        {isLoading ? (
          <DataTable
            slug="academic-years"
            columns={columns}
            rows={[]}
            includeActionColumn={true}
            onDelete={handleDelete}
            onView={handleView}
            onEdit={handleEdit}
          />
        ) : isSuccess ? (
          <DataTable
            slug="academic-years"
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
              slug="academic-years"
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
          <AddData<AcademicYearInput>
            slug="academic-year"
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            onSubmit={handleCreate}
            fields={[
              { name: 'year', label: 'Year', type: 'number', required: true },
            ]}
          />
        )}

        {/* Modal xem chi tiết */}
        {viewOpen && selectedYear && (
          <div className="w-screen h-screen fixed top-0 left-0 flex justify-center items-center bg-black/75 z-[99]">
            <div className="w-[80%] xl:w-[50%] rounded-lg p-7 bg-base-100 relative flex flex-col items-stretch gap-5">
              <button
                onClick={() => setViewOpen(false)}
                className="absolute top-5 right-3 btn btn-ghost btn-circle"
              >
                <HiOutlineXMark className="text-xl font-bold" />
              </button>
              <h3 className="text-2xl font-bold">Academic Year Details</h3>
              <div className="flex flex-col gap-4">
                <div><strong>ID:</strong> {selectedYear.id}</div>
                <div><strong>Year:</strong> {selectedYear.year}</div>
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
        {editOpen && selectedYear && (
          <AddData<AcademicYearInput>
            slug="academic-year"
            isOpen={editOpen}
            setIsOpen={setEditOpen}
            onSubmit={handleUpdate}
            fields={[
              { name: 'year', label: 'Year', type: 'number', required: true },
            ]}
            initialData={{
              year: selectedYear.year,
            }}
          />
        )}
      </div>
    </div>
  );
};

export default AcademicYearPage;