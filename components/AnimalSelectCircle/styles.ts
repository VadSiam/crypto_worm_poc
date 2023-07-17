import styled from "styled-components";

const CircularSelectWrapper = styled.div`
  position: relative;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const CircularButton = styled.button`
  /* background-color: #4285f4; */
  color: white;
  border: none;
  border-radius: 50%;
  padding: 2px;
  font-size: 14px;
  cursor: pointer;
  outline: none;
  margin-left: 60px;
`;

const CircleOptions = styled.div`
  position: absolute;
  pointer-events: none;
`;

const CircularOption = styled.button`
  position: absolute;
  background-color: #f0f0f0;
  color: #333;
  border: 1px solid #ccc;
  border-radius: 50%;
  padding: 2px;
  font-size: 14px;
  cursor: pointer;
  outline: none;
  pointer-events: auto;

  &:hover {
    background-color: #eee;
  }
`;

export {
  CircularSelectWrapper,
  CircularButton,
  CircleOptions,
  CircularOption,
}