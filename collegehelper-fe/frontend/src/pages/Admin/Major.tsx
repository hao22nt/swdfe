import { useQuery } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import DataTable from '../../components/DataTable';
import { GridColDef } from '@mui/x-data-grid';
import { fetchMajors } from '../../api/ApiCollection';
import { useEffect } from 'react';

const Major = () => {
  const { isLoading, isError, data } = useQuery({
    queryKey: ['majors'],
    queryFn: fetchMajors,
  });

  useEffect(() => {
    if (isLoading) {
      toast.loading('Loading majors...', { id: 'majorsToast' });
    } else {
      toast.dismiss('majorsToast'); // Ẩn loading khi đã tải xong
    }
    if (isError) {
      toast.error('Failed to fetch majors!');
    }
  }, [isLoading, isError]);

  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 90 },
    { field: 'name', headerName: 'Major Name', minWidth: 300 },
    { field: 'relatedSkills', headerName: 'Related Skills', minWidth: 250 },
    { field: 'description', headerName: 'Description', minWidth: 400 },
  ];

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
        </div>

        {isLoading ? (
          <div className="w-full flex justify-center">Loading majors...</div>
        ) : isError ? (
          <div className="w-full flex justify-center text-red-500">
            Error while fetching majors!
          </div>
        ) : (
          <DataTable slug="majors" columns={columns} rows={data || []} includeActionColumn={false} />
        )}
      </div>
    </div>
  );
};

export default Major;
