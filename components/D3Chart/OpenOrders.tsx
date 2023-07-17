import React, { useState } from 'react';
import styled from 'styled-components';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import StarsDisplay from './StarsDisplay';

const OrdersWrapper = styled.div`
  position: relative;
  width: 200px;
  height: 30px;
  line-height: 30px;
  background-color: #fff;
  text-align: center;
  /* border: 1px solid #000; */
`;

interface IOpenOrders {
  openOrders: {
    price: string,
    side: string
  }[]
}

const OpenOrders: React.FC<IOpenOrders> = ({
  openOrders,
}) => {
  const [showOrders, setShowOrders] = useState(false);

  return (
    <OrdersWrapper
      onMouseEnter={() => setShowOrders(true)}
      onMouseLeave={() => setShowOrders(false)}
    >
      <StarsDisplay ordersCount={openOrders.length} totalStars={6} />

      {showOrders && !!openOrders.length && (
        <TableContainer component={Paper}>
          <Table size="small" aria-label="a dense table">
            <TableHead>
              <TableRow>
                <TableCell>Price</TableCell>
                <TableCell>Side</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {openOrders.map((order, index) => (
                <TableRow
                  key={index}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <TableCell style={{ color: order.side === 'BUY' ? 'green' : 'red' }}>
                    {order.price}
                  </TableCell>
                  <TableCell>{order.side}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </OrdersWrapper>
  );
}

export default OpenOrders;
