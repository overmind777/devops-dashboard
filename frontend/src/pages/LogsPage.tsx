import { loggerSocket } from '../sockets/logger-socket';
import { useEffect, useRef, useState } from 'react';
import { toast } from 'react-toastify';
import { Container } from '../types/types';
import { monitoringSocket } from '../sockets/monitoring-socket';

function LogsPage() {
  const loggerSocketRef = useRef<any>(null);
  const monitoringSocketRef = useRef<any>(null);

  const [logs, setLogs] = useState<string[]>([]);
  const [containers, setContainers] = useState<Container[]>([]);

  useEffect(() => {
    if (containers.length > 0) {
      handleContainerChange(containers[0].id);
    }
  }, [containers]);

  useEffect(() => {
    const socketContainers = monitoringSocket();
    const socketLogs = loggerSocket();

    loggerSocketRef.current = socketLogs;
    monitoringSocketRef.current = socketContainers;

    socketContainers.on('findAllContainers', (data) => {
      if (!Array.isArray(data)) {
        return;
      }
      setContainers(data);
    });

    socketContainers.emit('findAllContainers');

    socketLogs.on('logs', (data) => {
      const lines = data.log.split('\n').filter(Boolean);
      setLogs((prev) => [...prev, lines]);
    });

    socketLogs.on('error', (message: string) => {
      toast.error(message);
    });

    socketLogs.emit('streamLogs');

    return () => {
      socketLogs.off('streamLogs');
      socketLogs.off('error');
      socketLogs.disconnect();

      socketContainers.off('findAllContainers');
      socketContainers.disconnect();
    };
  }, []);

  const handleContainerChange = (containerId: any) => {
    setLogs([]);
    loggerSocketRef.current?.emit('streamLogs', containerId);
  };

  return (
    <div className="flex justify-center items-start w-full h-full gap-[20px]">
      {containers.length > 0 && (
        <div className='sticky top-[20px] z-10'>
          <select
          name="containers-select"
          id="cont-select"
          className="basis-[20vw] border border-gray-500 rounded-[10px] p-[10px] "
          onChange={ ( e ) => handleContainerChange( e.target.value ) }
        >
          { containers.map( ( container ) => {
            return (
              <option key={ container.id } value={ container.id }>{ container.name }</option>
            );
          } ) }
        </select>
        </div>
      )}
      <div className='overflow-y-auto h-[90%]'>
        <ul className="flex flex-col gap-[5px]">
          { logs.map( ( log, idx ) => {
            return <li key={ idx } className="list-none text-left">{ log }</li>;
          } ) }
        </ul>
      </div>
    </div>
  );
}

export default LogsPage;
