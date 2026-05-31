import { useState } from 'react';
import './datatable.scss';
import { DataGrid, type GridColDef, type GridRenderCellParams } from '@mui/x-data-grid';
import { userColumns, userRows } from '../../datatablesource';
import { Link } from 'react-router-dom';
import type { UserRow } from '../../types';

export default function Datatable() {
  const [data, setData] = useState<UserRow[]>(userRows);

  const handleDelete = (id: number) => {
    setData((currentData) => currentData.filter((item) => item.id !== id));
  };

  const actionColumn: GridColDef<UserRow>[] = [
    {
      field: 'action',
      headerName: 'Action',
      width: 200,
      renderCell: (params: GridRenderCellParams<UserRow>) => {
        return (
          <div className="cellAction">
            <Link to="/users/test" style={{ textDecoration: 'none' }}>
              <div className="viewButton">View</div>
            </Link>
            <div className="viewButton" onClick={() => handleDelete(params.row.id)}>
              Delete
            </div>
          </div>
        );
      },
    },
  ];

  return (
    <div className="datatable">
      <div className="datatableTitle">
        Add New User
        <Link to="/users/new" className="link">
          Add New
        </Link>
      </div>
      <DataGrid
        className="datagrid"
        rows={data}
        columns={userColumns.concat(actionColumn)}
        initialState={{
          pagination: {
            paginationModel: { page: 0, pageSize: 5 },
          },
        }}
        pageSizeOptions={[9]}
        checkboxSelection
      />
    </div>
  );
}
