import 'react-toastify/dist/ReactToastify.css';
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

const data = [
  { name: 'Group A', value: 400 },
  { name: 'Group B', value: 300 },
  { name: 'Group C', value: 300 },
  { name: 'Group D', value: 200 },
  { name: 'Group E', value: 278 },
  { name: 'Group F', value: 189 },
];

function container() {

  return (
    <div style={{ width: '100%', height: '400px' }}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart width={400} height={400}>
          <Pie dataKey={'value'}
               startAngle={180}
               endAngle={0}
               data={data}
               cx="50%"
               cy="50%"
               outerRadius={80}
               fill="#8884d8"
               label/>
          <Tooltip />
          {/*<Legend />*/}
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}

export default container;
