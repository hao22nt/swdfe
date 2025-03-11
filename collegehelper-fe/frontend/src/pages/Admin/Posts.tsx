import React from 'react';
import { GridColDef } from '@mui/x-data-grid';
import DataTable from '../../components/DataTable';
import { useQuery } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { fetchPosts } from '../../api/ApiCollection';
import { HiOutlineGlobeAmericas, HiOutlineLockClosed } from 'react-icons/hi2';

const Posts = () => {
  const { isLoading, isError, isSuccess, data } = useQuery({
    queryKey: ['allposts'],
    queryFn: fetchPosts,
  });

  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', minWidth: 90 },
    {
      field: 'title',
      headerName: 'Title',
      minWidth: 400,
      renderCell: (params) => (
        <div className="p-2">
          <span className="font-semibold text-lg block">{params.row.title}</span>
          <p className="text-sm text-gray-500 line-clamp-2">{params.row.summary}</p>
        </div>
      ),
    },
    { field: 'university', headerName: 'University', minWidth: 250 },
    { field: 'author', headerName: 'Author', minWidth: 200 },
    { field: 'date', headerName: 'Date', minWidth: 150 },
    { field: 'views', headerName: 'Views', minWidth: 100 },
    {
      field: 'status',
      headerName: 'Status',
      minWidth: 150,
      renderCell: (params) => {
        const statusColors = {
          Pending: 'bg-yellow-500',
          Approved: 'bg-green-500',
          Rejected: 'bg-red-500',
        };
        return (
          <span className={`px-3 py-1 rounded-full text-white ${statusColors[params.row.status] || 'bg-gray-500'}`}>
            {params.row.status}
          </span>
        );
      },
    },
  ];

  React.useEffect(() => {
    if (isLoading) toast.loading('Loading posts...', { id: 'posts' });
    if (isError) toast.error('Error fetching posts!', { id: 'posts' });
    if (isSuccess) toast.success('Posts loaded successfully!', { id: 'posts' });
  }, [isError, isLoading, isSuccess]);

  return (
    <div className="p-5">
      <h2 className="font-bold text-3xl mb-4 text-base-content dark:text-neutral-200">University Posts</h2>
      {data && data.length > 0 && (
        <p className="text-neutral dark:text-neutral-content font-medium text-base mb-3">
          {data.length} Posts Found
        </p>
      )}
      <DataTable slug="posts" columns={columns} rows={isLoading ? [] : data} includeActionColumn={false} />
      {isError && <p className="text-red-500 text-center mt-3">Error loading posts!</p>}
    </div>
  );
};

export default Posts;

