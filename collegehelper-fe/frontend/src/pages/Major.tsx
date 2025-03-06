import React from 'react';
import { GridColDef } from '@mui/x-data-grid';
import DataTable from '../components/DataTable';
import { useQuery } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { fetchMajors } from '../api/ApiCollection'; // 🔥 Gọi API đúng của Major

const Major = () => {
  const { isLoading, isError, isSuccess, data } = useQuery({
    queryKey: ['allMajors'],
    queryFn: fetchMajors, // 🔥 Đổi API từ fetchOrders -> fetchMajors
  });

  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 90 },
    {
      field: 'name',
      headerName: 'Major Name',
      minWidth: 250, 
      maxWidth: 300, // 👈 Giới hạn chiều rộng cột
    },
    {
      field: 'description',
      headerName: 'Description',
      minWidth: 300,
      maxWidth: 400, // 👈 Không cho nó giãn quá lớn
    },
    {
      field: 'faculty',
      headerName: 'Faculty',
      width: 200, // 👈 Giữ cố định
    },
  ];
  

  React.useEffect(() => {
    if (isLoading) {
      toast.loading('Loading...', { id: 'promiseMajors' });
    }
    if (isError) {
      toast.error('Error while fetching Majors!', { id: 'promiseMajors' });
    }
    if (isSuccess) {
      toast.success('Majors loaded successfully!', { id: 'promiseMajors' });
    }
  }, [isError, isLoading, isSuccess]);

  return (
    <div className="w-full p-0 m-0">
      <div className="w-full flex flex-col items-stretch gap-3">
        <div className="w-full flex justify-between mb-5">
          <div className="flex gap-1 justify-start flex-col items-start">
            <h2 className="font-bold text-2xl xl:text-4xl text-base-content dark:text-neutral-200">
              Major
            </h2>
            {data && data.length > 0 && (
              <span className="text-neutral dark:text-neutral-content font-medium text-base">
                {data.length} Majors Found
              </span>
            )}
          </div>
        </div>

        {isLoading ? (
          <DataTable slug="majors" columns={columns} rows={[]} includeActionColumn={false} />
        ) : isSuccess ? (
          <DataTable slug="majors" columns={columns} rows={data} includeActionColumn={false} />
        ) : (
          <>
            <DataTable slug="majors" columns={columns} rows={[]} includeActionColumn={false} />
            <div className="w-full flex justify-center">Error fetching Majors!</div>
          </>
        )}
      </div>
    </div>
  );
};

export default Major;
