import { loggerSocket } from '../sockets/logger-socket';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

function LogsPage() {
  const [logs, setLogs] = useState<string[]>( [] );

  useEffect( () => {
    const socket = loggerSocket();
    socket.on( 'streamLogs', ( data ) => {
      console.log('streamLogs', data );
    } );

    socket.on( 'data', ( data ) => {
      console.log('data', data );
      // setLogs( res );
    } );

    socket.on( 'logs', ( data ) => {
      console.log('logs', data );
      // setLogs( res );
    } );

    socket.on( 'log', ( data ) => {
      console.log('log', data );
      // setLogs( res );
    } );

    socket.on( 'error', ( message: string ) => {
      toast.error( message );
    } );

    socket.emit( 'streamLogs', '61a7019e978bc8ef076d1c34d56a5b789352e67c256def80f70b2ff7451cd0e7' );
    socket.emit('data')
    socket.emit('logs')
    socket.emit('log')

    return () => {
      socket.off( 'streamLogs' );
      socket.off( 'error' );
      socket.disconnect();
    };
  }, [] );

  return (
    <div>
      <p>{ logs }</p>
    </div>
  );
}

export default LogsPage;