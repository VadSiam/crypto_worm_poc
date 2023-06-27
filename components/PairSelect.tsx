import { FormControl, MenuItem, Select } from '@mui/material';
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
    <FormControl size="small">
      <Select value={value} onChange={handleChange} disabled>
        {cryptoPairs.map(cp => (
          <MenuItem key={cp.value} value={cp.value}>{cp.label}</MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}

export default PairSelect;
