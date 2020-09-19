import React from 'react';
import DataTable, { createTheme } from 'react-data-table-component';

import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Moment from 'react-moment';
const customStyles = {
    rows: {
      style: {
        minHeight: '72px', // override the row height
        minWidth:'100px'
      }
    },
    // headCells: {
    //   style: {
    //     paddingLeft: '8px', // override the cell padding for head cells
    //     paddingRight: '8px',
    //   },
    // },
    cells: {
      style: {
        paddingLeft: '8px', // override the cell padding for data cells
        paddingRight: '8px',
      },
    },
  };


const columns = [
  {
    name: 'Receipt#',
    selector: 'receiptNo',
    sortable: true,
  },
  {
    name: 'Receipt Date',
    sortable: false,
    // cell: row=> <Moment format="DD/MM/YYYY">{row.receiptDate}</Moment>
    cell: row=> <text>{row.receiptDate}</text>
    // right: true,
  },
  {
    name: 'Payment Mode',
    selector: 'paymentMode',
    sortable: true,
  },
  {
    name: 'Amount',
    selector: 'amount',
    sortable: true,
    right: true
  },
  {
    name: 'Action',
    button: true,
    cell: row => <a href={row.invoiceFileName} target="_blank" rel="noopener noreferrer">Download</a>,
  },
];
const Invoices=({client: {invoices,client}})=>  {
        return (
            <div className="invoiceTable">
                <DataTable
                    // title="Invoices"
                    columns={columns}
                    theme="solarized"
                    pagination
                    noHeader
                    data={invoices}
                />
            </div>
        );
}

Invoices.propTypes = {
    client: PropTypes.object.isRequired
};

const mapStateToProps = (state) => ({
    client: state.client,
  });
export default connect(mapStateToProps)(Invoices);