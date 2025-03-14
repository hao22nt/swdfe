import React from 'react';
import axios from 'axios';
import { GridColDef } from '@mui/x-data-grid';
import DataTable from '../../components/DataTable';
import { useQuery } from '@tanstack/react-query';
import toast from 'react-hot-toast';

const API_URL = "https://swpproject-egd0b4euezg4akg7.southeastasia-01.azurewebsites.net/api";

// Hàm fetch API để lấy danh sách majors
const fetchMajors = async () => {
  try {
    const token = localStorage.getItem("accessToken"); // Lấy token từ localStorage
    if (!token) {
      throw new Error("No access token found");
    }

    const response = await axios.get(`${API_URL}/majors/all`, {
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`, // Thêm token vào headers
      },
    });
    
    return response.data; // Trả về danh sách majors
  } catch (error) {
    console.error("Error fetching majors:", error);
    throw new Error("Failed to fetch majors");
  }
};

const Major = () => {
  const { isLoading, isError, isSuccess, data } = useQuery({
    queryKey: ['majors'],
    queryFn: fetchMajors, // Gọi API lấy danh sách majors
  });

  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 90 },
    {
      field: 'name',
      headerName: 'Major Name',
      minWidth: 300,
      flex: 1,
    },
    {
      field: 'department',
      headerName: 'Department',
      minWidth: 250,
      flex: 1,
    },
  ];

  React.useEffect(() => {
    if (isLoading) {
      toast.loading('Loading majors...', { id: 'promiseMajors' });
    }
    if (isError) {
      toast.error('Error while getting the majors!', { id: 'promiseMajors' });
    }
    if (isSuccess) {
      toast.success('Majors fetched successfully!', { id: 'promiseMajors' });
    }
  }, [isError, isLoading, isSuccess]);

  return (
    <div className="w-full p-0 m-0">
      <div className="w-full flex flex-col items-stretch gap-3">
        <div className="w-full flex justify-between mb-5">
          <div className="flex gap-1 justify-start flex-col items-start">
            <h2 className="font-bold text-2xl xl:text-4xl mt-0 pt-0 text-base-content dark:text-neutral-200">
              Major List
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
            <div className="w-full flex justify-center">
              Error while getting the data!
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Major;
