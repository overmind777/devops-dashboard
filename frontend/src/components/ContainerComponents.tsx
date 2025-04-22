import * as React from 'react';
import { useEffect, useState } from 'react';
import { ContainerProps } from '../types/types';
import { Pie, PieChart, ResponsiveContainer } from 'recharts';
import { monitoringSocket } from '../sockets/monitoring-socket';

const ContainerComponents = React.memo(
  function ContainerComponents( { item, handleStart, handleStop, handleRestart }: ContainerProps ): React.JSX.Element {
    const { id, name, state } = item;
    const [stateStatus, setStateStatus] = useState<string>( state.Status );
    const [cpu, setCpu] = useState<number>(0);
    const [ram, setRam] = useState<number>(0);

    useEffect( () => {
      const socket = monitoringSocket();
      socket.emit('getContainersStats', id);
      socket.on('containerStats', (data)=>{
        if(data.containerId === id){
          setCpu(data.stats.cpu);
          setRam(data.stats.memoryPercent);
        }
      })
      setStateStatus( state.Status );

    }, [item] );

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
          <ResponsiveContainer>
            <PieChart>
              <Pie
                data={ chartData }
                dataKey="value"
                startAngle={ 0 }
                endAngle={ 180 }
                cx="50%"
                cy="80%"
                outerRadius={ 60 }
                fill="#8884d8"
                label
              />
              <Pie
                data={ memoryData }
                dataKey="value"
                startAngle={ 0 }
                endAngle={ 180 }
                cx="50%"
                cy="80%"
                innerRadius={ 70 }
                outerRadius={ 90 }
                fill="#82ca9d"
                label
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <p>{ name }</p>
        <p>{ stateStatus }</p>
        <button onClick={ () => {
          handleStart( id );
        } }>Start
        </button>
        <button onClick={ () => {
          handleStop( id );
        } }>Stop
        </button>
        <button onClick={ () => {
          handleRestart( id );
        } }>Restart
        </button>
      </div>
    );
  },
);

export default ContainerComponents;