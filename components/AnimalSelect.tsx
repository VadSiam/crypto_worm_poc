import { FormControl, MenuItem, Select } from '@mui/material';
import React, { Dispatch, SetStateAction, useState } from 'react';
import { heads } from '../utils/data';

interface ISelect {
  defaultHead: string,
  setHead: Dispatch<SetStateAction<string>>
}

const AnimalSelect: React.FC<ISelect> = ({
  defaultHead,
  setHead,
}) => {
  const [value, setValue] = useState(defaultHead);

  const handleChange = (event) => {
    const { value } = event.target;
    setValue(value);
    setHead(value);
  };

  return (
    <FormControl size="small">
      <Select value={value} onChange={handleChange}>
        {heads.map((head) => (
          <MenuItem key={head.id} value={head.id}>{head.id}</MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}

export default AnimalSelect;
