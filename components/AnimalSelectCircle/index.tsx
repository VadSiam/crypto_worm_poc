import React, { useState, useEffect, useRef } from 'react';
import { CircleOptions, CircularButton, CircularOption, CircularSelectWrapper } from './styles';
import { AnimalHead } from '../../utils/data';
import { Avatar } from '@mui/material';

export interface IOption {
  value: string
  label: string
}

export interface ICircleOptionsStyles {
  radius: number;
  xCorrection: number;
  yCorrection: number;
}

const defaultCircleOptionsStyles: ICircleOptionsStyles = {
  radius: 100,
  xCorrection: -20,
  yCorrection: -15,
};

export type CSSProperties = {
  [key: string]: string | number | CSSProperties;
};

export interface CircularSelectProps {
  options: AnimalHead[]
  defaultOption: AnimalHead
  onChange: (option: string) => void
  circleOptionsStyles?: ICircleOptionsStyles
  wrapperStyles?: CSSProperties
  mainButtonStyles?: CSSProperties
  optionsStyles?: CSSProperties
  optionStyles?: CSSProperties
}

export const AnimalSelectCircle = ({
  options,
  defaultOption,
  onChange,
  circleOptionsStyles = defaultCircleOptionsStyles,
}: CircularSelectProps) => {
  const { radius, xCorrection, yCorrection } = circleOptionsStyles;
  const [selectedOption, setSelectedOption] = useState<AnimalHead>(defaultOption);
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const circularSelectRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        circularSelectRef.current &&
        !circularSelectRef.current.contains(event.target as Node)
      ) {
        setIsExpanded(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  const handleOptionSelect = (option: AnimalHead) => {
    setSelectedOption(option);
    onChange(option.id);
    setIsExpanded(false);
  };

  return (
    <CircularSelectWrapper ref={circularSelectRef}>
      <CircularButton onClick={toggleExpand}>
        <Avatar
          alt={selectedOption.id}
          src={selectedOption.img}
        />
      </CircularButton>
      {isExpanded && (
        <CircleOptions>
          {options.map((option: AnimalHead, index: number) => {
            const angle = (index * 360 * Math.PI) / (180 * options.length);
            const x = xCorrection + radius * Math.cos(angle);
            const y = yCorrection + radius * Math.sin(angle);
            console.log('Calculated values:', x, y);
            
            return (
              <CircularOption
                key={option.id}
                style={{ left: x, top: y }}
                onClick={() => handleOptionSelect(option)}
              >
                <Avatar
                  alt={option.id}
                  src={option.img}
                />
              </CircularOption>
            );
          })}
        </CircleOptions>
      )}
    </CircularSelectWrapper>
  );
};
