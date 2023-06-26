import React, { Dispatch, SetStateAction, useState } from 'react';
import { cryptoPairs } from '../utils/data';

interface ISelect {
  defaultPair: string,
  setPair: Dispatch<SetStateAction<string>>
}

const PairSelect: React.FC<ISelect> = ({
  defaultPair,
  setPair,
}) => {
  const [value, setValue] = useState(defaultPair);

  const handleChange = (event) => {
    const { value } = event.target;
    setValue(value);
    setPair(value);
  };

  return (
    <select value={value} onChange={handleChange}>
      {cryptoPairs.map(cp => (
        <option key={cp.value} value={cp.value}>{cp.label}</option>
      ))}
    </select>
  );
}

export default PairSelect;
