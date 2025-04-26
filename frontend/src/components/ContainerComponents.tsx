import * as React from 'react';
import { useEffect, useState } from 'react';
import { ContainerProps } from '../types/types';
import {
  Legend,
  Pie,
  PieChart,
  RadialBar,
  RadialBarChart,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';
import { monitoringSocket } from '../sockets/monitoring-socket';

const ContainerComponents = React.memo(function ContainerComponents({
  item,
  handleStart,
  handleStop,
  handleRestart,
}: ContainerProps): React.JSX.Element {
  const { id, name, state } = item;
  const [stateStatus, setStateStatus] = useState<string>(state.Status);
  const [cpu, setCpu] = useState<number>(0);
  const [ram, setRam] = useState<number>(0);

  useEffect(() => {
    const socket = monitoringSocket();

    const handleStats = (data) => {
      setCpu(data.cpu);
      setRam(data.memoryPercent);
    };

    socket.emit('startStatsStream', id);
    socket.on('containerStats', handleStats);

    setStateStatus(state.Status);

    return () => {
      socket.off('containerStats', handleStats);
      socket.emit('stopStatsStream', id);
    };
  }, [id, state.Status]);

  const chartData = [
    { name: 'CPU %', value: cpu },
    { name: 'Free CPU', value: 100 - cpu },
  ];

  const memoryData = [
    { name: 'RAM %', value: ram },
    { name: 'Free RAM', value: 100 - ram },
  ];

  return (
    <div className="w-full h-full">
      <div className="w-full h-[70%]">
        <RadialBarChart
          width={300}
          height={300}
          innerRadius="10%"
          outerRadius="80%"
          data={chartData}
          startAngle={180}
          endAngle={0}
        >
          <RadialBar
            minAngle={15}
            label={{ fill: '#666', position: 'insideStart' }}
            background
            clockWise={true}
          />
          <Legend
            iconSize={10}
            width={120}
            height={140}
            layout="vertical"
            verticalAlign="middle"
            align="right"
          />
          <Tooltip />
        </RadialBarChart>
        <div className="flex flex-col gap-[10px]">
          <h2>{name}</h2>
          {stateStatus === 'running' ? (
            <p className="text-green-500">{stateStatus}</p>
          ) : (
            <p className="text-red-500">{stateStatus}</p>
          )}
          <div className="flex justify-around">
            <button
              onClick={() => {
                handleStart(id);
              }}
            >
              Start
            </button>
            <button
              onClick={() => {
                handleStop(id);
              }}
            >
              Stop
            </button>
            <button
              onClick={() => {
                handleRestart(id);
              }}
            >
              Restart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
});

export default ContainerComponents;
