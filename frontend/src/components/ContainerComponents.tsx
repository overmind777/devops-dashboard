import * as React from 'react';
import { useEffect, useState } from 'react';
import { ContainerProps } from '../types/types';
import { Pie, PieChart, ResponsiveContainer } from 'recharts';
import { monitoringSocket } from '../sockets/monitoring-socket';

const ContainerComponents = React.memo(
  function ContainerComponents( { item, handleStart, handleStop, handleRestart }: ContainerProps ): React.JSX.Element {
    const { id, name, state } = item;
    const [stateStatus, setStateStatus] = useState<string>( state.Status );
    const [cpu, setCpu] = useState<number>( 0 );
    const [ram, setRam] = useState<number>( 0 );

    useEffect( () => {
      const socket = monitoringSocket();
      socket.emit( 'getContainersStats', id );
      socket.on( 'containerStats', ( data ) => {
        if (data.containerId === id) {
          setCpu( data.stats.cpu );
          setRam( data.stats.memoryPercent );
        }
      } );
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
          <ResponsiveContainer width="100%" height="100%">
            <PieChart width={ 400 } height={ 400 }>
              <Pie
                data={ chartData }
                dataKey="value"
                startAngle={ 0 }
                endAngle={ 180 }
                cx="50%"
                cy="80%"
                outerRadius={ 40 }
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
                innerRadius={ 100 }
                outerRadius={ 120 }
                fill="#82ca9d"
                label
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className='flex flex-col gap-[10px]'>
          <h2>{ name }</h2>
          { stateStatus === 'running' ? ( <p className="text-green-500">{ stateStatus }</p> ) : (
            <p className="text-red-500">{ stateStatus }</p> ) }
          <div className="flex justify-around">
            <button
              onClick={ () => {
                handleStart( id );
              } }>Start
            </button>
            <button
              onClick={ () => {
                handleStop( id );
              } }>Stop
            </button>
            <button
              onClick={ () => {
                handleRestart( id );
              } }>Restart
            </button>
          </div>
        </div>
      </div>
    );
  },
);

export default ContainerComponents;