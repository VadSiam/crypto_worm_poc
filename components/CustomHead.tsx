export const CustomHead = (props: any) => {
  const { viewBox, imgHead, x, y } = props;
  return (
    <g transform={`translate(${viewBox.x},${viewBox.y})`}>
      <image
        x={x ?? -30}
        y={y ?? -32}
        width="80"
        height="80"
        xlinkHref={imgHead}
      />
    </g>
  );
};
