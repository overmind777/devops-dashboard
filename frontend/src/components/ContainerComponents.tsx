import * as React from 'react';
import { useEffect, useState } from 'react';
import { ContainerProps } from '../types/types';
import {
  Pie,
  PieChart,
  ResponsiveContainer,
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

    const handleStats = (data: any) => {
      setCpu(data.cpu !== null ? data.cpu : 0);
      setRam(data.memoryPercent !== null ? data.memoryPercent : 0);
    };

    socket.emit('startStatsStream', id);
    socket.on('containerStats', handleStats);

    setStateStatus(state.Status);

    return () => {
      socket.off('containerStats', handleStats);
      socket.emit('stopStatsStream', id);
      socket.disconnect();
    };
  }, [id, state.Status]);

  const chartData = [
    { name: 'CPU %', value: cpu, fill: 'red' },
    { name: 'Free CPU', value: 100 - cpu, fill: 'green' },
  ];

  const memoryData = [
    { name: 'RAM %', value: ram, fill: 'red' },
    { name: 'Free RAM', value: 100 - ram, fill: 'green' },
  ];

  return (
    <div className="w-full h-full">
      <div className="w-full h-[70%]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart width={400} height={400}>
            <Pie
              data={chartData}
              dataKey="value"
              startAngle={0}
              endAngle={180}
              cx="50%"
              cy="80%"
              outerRadius={40}
              fill="fill"
              label
              animationBegin={100}
              animationDuration={300}
              animationEasing="ease-in-out"
            />
            <Pie
              data={memoryData}
              dataKey="value"
              startAngle={0}
              endAngle={180}
              cx="50%"
              cy="80%"
              innerRadius={100}
              outerRadius={120}
              fill="#82ca9d"
              label
              animationBegin={100}
              animationDuration={300}
              animationEasing="ease-in-out"
            />
          </PieChart>
        </ResponsiveContainer>
        <div className="flex flex-col gap-[10px]">
          <h2>{name}</h2>
          {stateStatus === 'running' ? (
            <p className="text-green-500">{stateStatus}</p>
          ) : (
            <p className="text-red-500">{stateStatus}</p>
          )}
          <div className="flex justify-around text-white">
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
