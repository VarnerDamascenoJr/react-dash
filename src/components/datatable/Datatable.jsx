import React from 'react'
import "./datatable.scss"
import { DataGrid } from '@mui/x-data-grid';
import { userColumns, userRows } from '../../datatablesource';




export default function Datatable() {

  const actionColumn = [
    {
      field:"action",
      headerName:"Action",
      width:200,
      renderCell:()=>{
        return (
          <div className='cellAction'>
            <div className="viewButton">View</div>
            <div className="viewButton">Delete</div>

          </div>
        )
      }
    }
  ]

  return (
    <div className='datatable'>
        <DataGrid
        rows={userRows}
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
  )
}
