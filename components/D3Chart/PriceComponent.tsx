import React from 'react';
import styled, { keyframes } from 'styled-components';

const gradientChange = keyframes`
  0% { background-position: 0% }
  100% { background-position: 100% }
`;

const growShrink = keyframes`
  0% { font-size: 1em; }
  50% { font-size: 1.5em; }
  100% { font-size: 1em; }
`;

const GradientText = styled.div`
  align-items: center;
  justify-content: center;
  display: flex;
  height: 30px;
  background: linear-gradient(45deg, blue, red);
  font-weight: bold;
  background-size: 200% auto;
  color: #fff;
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;  
  animation: ${gradientChange} 3s linear infinite;
`;

const CharEven = styled.span`
  animation: ${growShrink} 1s infinite;
`;

const CharOdd = styled.span`
  animation: ${growShrink} 1s 0.5s infinite;
`;

interface IPriceComponent {
  text: string,
}

const PriceComponent: React.FC<IPriceComponent> = ({
  text,
}) => {
  return (
    <GradientText>
      {text.split('').map((char, i) => i % 2 === 0
        ? <CharEven key={i}>{char}</CharEven>
        : <CharOdd key={i}>{char}</CharOdd>
      )}
    </GradientText>
  );
}

export default PriceComponent;
