import React from 'react';
import { DataGrid, GridColDef, GridToolbar } from '@mui/x-data-grid';
import { useNavigate } from 'react-router-dom';
import { HiOutlinePencilSquare, HiOutlineEye, HiOutlineTrash } from 'react-icons/hi2';
import toast from 'react-hot-toast';

interface DataTableProps {
  columns: GridColDef[];
  rows: object[];
  slug: string;
  includeActionColumn: boolean;
  onDelete?: (id: string) => void;
  onView?: (id: string) => void;
  onEdit?: (id: string) => void; // Thêm prop onEdit
}

const DataTable: React.FC<DataTableProps> = ({
  columns,
  rows,
  slug,
  includeActionColumn,
  onDelete,
  onView,
  onEdit,
}) => {
  const navigate = useNavigate();

  const actionColumn: GridColDef = {
    field: 'action',
    headerName: 'Action',
    minWidth: 200,
    flex: 1,
    renderCell: (params) => {
      return (
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              if (onView && params.row.id) {
                onView(params.row.id);
              } else {
                navigate(`/${slug}/${params.row.id}`);
              }
            }}
            className="btn btn-square btn-ghost"
          >
            <HiOutlineEye />
          </button>
          <button
            onClick={() => {
              if (onEdit && params.row.id) {
                onEdit(params.row.id); // Gọi onEdit nếu tồn tại
              } else {
                toast('Jangan diedit!', { icon: '😠' });
              }
            }}
            className="btn btn-square btn-ghost"
          >
            <HiOutlinePencilSquare />
          </button>
          <button
            onClick={() => {
              if (onDelete && params.row.id) {
                onDelete(params.row.id);
              } else {
                toast('Jangan dihapus!', { icon: '😠' });
              }
            }}
            className="btn btn-square btn-ghost"
          >
            <HiOutlineTrash />
          </button>
        </div>
      );
    },
  };

  const finalColumns = includeActionColumn ? [...columns, actionColumn] : columns;

  return (
    <div className="w-full bg-base-100 text-base-content">
      <DataGrid
        className="dataGrid p-0 xl:p-3 w-full bg-base-100 text-white"
        rows={rows}
        columns={finalColumns}
        getRowHeight={() => 'auto'}
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: 10,
            },
          },
        }}
        slots={{ toolbar: GridToolbar }}
        slotProps={{
          toolbar: {
            showQuickFilter: true,
            quickFilterProps: { debounceMs: 500 },
          },
        }}
        pageSizeOptions={[10]}
        checkboxSelection
        disableRowSelectionOnClick
        disableColumnFilter
        disableDensitySelector
        disableColumnSelector
      />
    </div>
  );
};

export default DataTable;