// import { CartesianGrid, Legend, Line, LineChart, Tooltip, XAxis, YAxis } from 'recharts'
import { useEffect, useRef, useState } from 'react';
import { monitoringSocket } from '../sockets/monitoring-socket';
import ContainerComponents from '../components/ContainerComponents';
import { Socket } from 'socket.io-client';
import { Container } from '../types/types';


function Monitoring( props: any ) {

  const [containers, setContainers] = useState<Container[]>( [] );
  const socketRef = useRef<Socket | null>( null );
  const socket = monitoringSocket();

  useEffect( () => {

    socketRef.current = socket;

    socket.on( 'findAllContainers', ( data ) => {
      if (!Array.isArray( data )) {
        console.error( 'Invalid containers:', data );
        return;
      }

      setContainers( ( prev: any ) => {
        return data.map( ( newContainer: any ) => {
          const oldContainer = prev.find( ( c: any ) => c.id === newContainer.id );
          if (!oldContainer) return newContainer;

          if (JSON.stringify( oldContainer ) !== JSON.stringify( newContainer )) {
            return newContainer;
          }

          return oldContainer;
        } );
      } );
    } );

    socket.emit( 'findAllContainers' );
    socket.emit( 'startContainer' );

    return () => {
      socket.disconnect();
    };
  }, [] );

  const handleStart = ( containerId: string ): any => {
    socketRef.current?.emit( 'startContainer', containerId );
  };

  const handleStop = ( containerId: string ): any => {
    socketRef.current?.emit( 'stopContainer', containerId );
  };

  const handleRestart = ( containerId: string ): any => {
    socketRef.current?.emit( 'restartContainer', containerId );
  };

  return (
    <div className="p-6">
      <ul>
        { containers?.map( ( item: any ) => {
          return (
            <li key={ item.id } className="flex items-center justify-center gap-[15px]">
              <ContainerComponents item={ item }
                                   handleStart={ handleStart }
                                   handleStop={ handleStop }
                                   handleRestart={ handleRestart }
              />
            </li>
          );
        } ) }
      </ul>
    </div>
  );
}

export default Monitoring;
