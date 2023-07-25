import React from 'react';
import styled from 'styled-components';

const Select = styled.select`
  width: 100px;
  height: 35px;
  font-size: 16px;
  border: none;
  border-radius: 4px;
  padding: 5px;
  background-color: lightgray;
  color: black;
`;

interface INumberSelector {
  numberChange: (number: number) => void;
  adjustNumber: number;
}

const NumberSelector: React.FC<INumberSelector> = ({
  numberChange,
  adjustNumber,
}) => {
  const [selectedValue, setSelectedValue] = React.useState(adjustNumber);
  const numbersArray = Array.from(Array(351).keys()); // creates an array [0, 1, 2, ..., 350]

  const handleChange = (event) => {
    setSelectedValue(event.target.value);
    numberChange(event.target.value);
  };

  return (
    <Select value={selectedValue} onChange={handleChange}>
      {numbersArray.map((number) =>
        <option key={number} value={number}>{number}</option>
      )}
    </Select>
  );
};

export default NumberSelector;