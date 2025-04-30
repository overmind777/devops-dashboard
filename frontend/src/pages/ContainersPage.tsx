import { useEffect, useRef, useState } from 'react';
import { monitoringSocket } from '../sockets/monitoring-socket';
import ContainerComponents from '../components/ContainerComponents';
import { Socket } from 'socket.io-client';
import { Container } from '../types/types';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useTerminalStore } from '../stores/terminalStore';


function ContainersPage() {

  const containers = useTerminalStore((state)=>state.containers);
  const addContainer = useTerminalStore((state)=>state.addContainer);
  const clearContainers = useTerminalStore((state)=>state.clearContainers);
  const socketRef = useRef<Socket | null>( null );

  useEffect( () => {
    const socket = monitoringSocket();
    socketRef.current = socket;
    socket.on( 'findAllContainers', ( data ) => {
      if (!Array.isArray( data )) {
        return;
      }

      clearContainers();
      data.forEach((container: Container) => {
        addContainer(container);
      });

    } );

    socket.emit( 'findAllContainers' );

    socket.on( 'error', ( message: string ) => {
      toast.error( message );
    } );

    return () => {
      socket.off('findAllContainers');
      socket.off( 'error' );
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
      <ul className='flex flex-row flex-wrap justify-center gap-[20px] overflow-y-auto max-h-[80vh]'>
        { containers?.map( ( item: any ) => {
          return (
            <li key={ item.id } className="flex items-center justify-center gap-[5px] w-[400px] h-[400px] border border-gray-200">
              <ContainerComponents item={ item }
                                   handleStart={ handleStart }
                                   handleStop={ handleStop }
                                   handleRestart={ handleRestart }
              />
            </li>
          );
        } ) }
      </ul>
      <ToastContainer position="top-right" autoClose={ 3000 } />
    </div>
  );
}


export default ContainersPage;
