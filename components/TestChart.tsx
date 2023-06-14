import { ComposedChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, TooltipProps } from 'recharts';

const data = [
  { name: 'A', value: 11 },
  { name: 'B', value: 12 },
  { name: 'C', value: 17 },
  { name: 'D', value: 13 },
  { name: 'E', value: 30 },
];

const CustomTooltip: React.FC<TooltipProps<number, string>> = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const { value } = payload[0].payload;

    // Ignore the tooltip if the value is outside of the range [10, 20]
    if (value < 10 || value > 20) {
      return null;
    }

    return (
      <div style={{ backgroundColor: '#fff', padding: '5px', border: '1px solid #ccc' }}>
        <p>{`Value : ${value}`}</p>
      </div>
    );
  }

  return null;
};

const AnomalyChart = () => (
  <ComposedChart width={600} height={400} data={data}>
    <CartesianGrid stroke="#f5f5f5" />
    <XAxis dataKey="name" />
    <YAxis domain={[10, 20]} />
    <Tooltip content={<CustomTooltip />} />
    {data.map((entry, index) =>
      entry.value >= 10 && entry.value <= 20 && <Line type="monotone" dataKey="value" data={[data[index - 1], entry]} stroke="#ff7300" key={index} />
    )}
  </ComposedChart>
);

export default AnomalyChart;
