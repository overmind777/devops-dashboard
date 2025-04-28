import { useEffect, useRef, useState } from 'react';
import { Terminal } from '@xterm/xterm';
import '@xterm/xterm/css/xterm.css';
import { FitAddon } from 'xterm-addon-fit';
import { WebLinksAddon } from '@xterm/addon-web-links';
import { monitoringSocket } from '../sockets/monitoring-socket';
import { useTerminalStore } from '../stores/terminalStore';
import { Container } from '../types/types';
import container from './Monitoring';

type Props = {
  id: string;
  name: string;
  status: string;
};

const OptionTag = ({ id, name, status }: Props) => {
  return (
    <option
      key={id}
      value={id}
      disabled={status !== 'running'}
      style={{ color: status !== 'running' ? 'gray' : 'black' }}
    >
      {name}
    </option>
  );
};

const TerminalPage = () => {
  const terminalRef = useRef<HTMLDivElement>(null);
  const socketRef = useRef<any>(null);
  const term = useRef<Terminal | null>(null);
  const { containers, addContainer, clearContainers } = useTerminalStore();
  const [firstContainer, setFirstContainer] = useState<Container>();
  const [visibleContainer, setVisibleContainer] = useState<string>('');

  useEffect(() => {
    socketRef.current = monitoringSocket();
    socketRef.current.emit('findAllContainers');
    socketRef.current.on('findAllContainers', (data: any) => {
      clearContainers();
      const first = data.find((container) => container.status === 'running' ? socketRef.current.emit('exec', container.id) : null);
      setFirstContainer(first);
      data.forEach((container: Container) => {
        addContainer(container);
      });
    });

    term.current = new Terminal({
      cursorBlink: true,
      cursorStyle: 'bar',
      theme: {
        background: '#000000',
        foreground: '#ffffff',
      },
    });

    const fitAddon = new FitAddon();
    const webLinksAddon = new WebLinksAddon();
    term.current.loadAddon(fitAddon);
    term.current.loadAddon(webLinksAddon);

    if (terminalRef.current) {
      term.current.open(terminalRef.current);
      fitAddon.fit();
      term.current.focus();
    }

    term.current.onData((data) => {
      socketRef.current.emit('execInput', data);
    });

    socketRef.current.on('execOutput', (data: string) => {
      term.current?.write(data);
    });

    return () => {
      socketRef.current.disconnect();
      term.current?.dispose();
    };
  }, []);

  const handleChangeContainer = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newContainerId = e.target.value;
    setVisibleContainer(newContainerId);
    term.current?.reset();
    socketRef.current.emit('exec', newContainerId);
  };

  return (
    <div>
      <select
        name="containers"
        id="containers"
        value={visibleContainer}
        onChange={handleChangeContainer}
      >
        {containers.length > 0 ? (
          containers.map(({ id, name, status }) => (
            <OptionTag key={id} id={id} name={name} status={status} />
          ))
        ) : (
          <option disabled>Контейнерів немає</option>
        )}
      </select>
      <div className="w-screen h-screen bg-black">
        <div ref={terminalRef} className="w-full h-full text-left"></div>
      </div>
    </div>
  );
};

export default TerminalPage;
