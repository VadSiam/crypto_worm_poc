import React from 'react';
import styled from 'styled-components';

const Star = styled.span`
  font-size: 2em;
  color: ${props => props.theme.gold ? 'gold' : 'gray'};
`;

const StarsDisplay = ({ ordersCount, totalStars }) => {
  let stars = [];
  for (let i = 0; i < totalStars; i++) {
    stars.push(<Star theme={{ gold: i < ordersCount }} key={i}>★</Star>);
  }
  return <>{stars}</>;
};

export default StarsDisplay;
