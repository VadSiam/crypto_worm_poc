import React, { Dispatch, SetStateAction, useState } from 'react';
import { AnimalHead, heads } from './../utils/data';

interface ISelect {
  defaultHead: string,
  setHead: Dispatch<SetStateAction<string>>
}

const SimpleSelect: React.FC<ISelect> = ({
  defaultHead,
  setHead,
}) => {
  const [worm, dragon, frog] = heads;
  const [value, setValue] = useState(defaultHead);

  const handleChange = (event) => {
    const { value } = event.target;
    setValue(value);
    setHead(value);
  };

  return (
    <select value={value} onChange={handleChange}>
      <option value={worm.id}>{worm.id}</option>
      <option value={dragon.id}>{dragon.id}</option>
      <option value={frog.id}>{frog.id}</option>
    </select>
  );
}

export default SimpleSelect;
