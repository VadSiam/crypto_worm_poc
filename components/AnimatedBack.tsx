import styled, { keyframes } from "styled-components";

const moveBackground = keyframes`
  0% {
    background-position: 0 0;
  }
  100% {
    background-position: -1000px 0;
  }
`;

const AnimatedBack = styled.div`
  width: 100%;
  height: 100vh;
  background-image: url('https://cdn.discordapp.com/attachments/1092399713757708378/1120287817164148816/vad_siam_clouds_and_trees_cartoon_style_101da6cf-e17a-4c69-8e10-36f0f71fdf84.png');
  background-repeat: repeat-x;
  background-size: 100% 92%; 
  animation: ${moveBackground} 20s linear infinite;
`;

export default AnimatedBack;