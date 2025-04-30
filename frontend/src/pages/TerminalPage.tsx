import { useEffect, useRef, useState } from 'react';
import { Terminal } from '@xterm/xterm';
import '@xterm/xterm/css/xterm.css';
import { FitAddon } from 'xterm-addon-fit';
import { WebLinksAddon } from '@xterm/addon-web-links';
import { monitoringSocket } from '../sockets/monitoring-socket';
import { Container } from '../types/types';
import { useTerminalStore } from '../stores/terminalStore';

type Props = {
  id: string;
  name: string;
  status: string;
};

const OptionTag = ({ id, name, status }: Props) => (
  <option key={id} value={id} disabled={status === 'exited'} style={{ color: status === 'exited' ? 'gray' : 'black' }}>
    {name}
  </option>
);

const TerminalPage = () => {
  const terminalRef = useRef<HTMLDivElement>(null);
  const socketRef = useRef<any>(null);
  const term = useRef<Terminal | null>(null);

  const [selectedContainer, setSelectedContainer] = useState<string>('');

  const containers = useTerminalStore((state) => state.containers);
  const addContainer = useTerminalStore((state) => state.addContainer);
  const clearContainers = useTerminalStore((state) => state.clearContainers);

  // Ініціалізація сокету та контейнерів
  useEffect(() => {
    socketRef.current = monitoringSocket();

    socketRef.current.emit('findAllContainers');
    clearContainers();

    socketRef.current.on('findAllContainers', (data: Container[]) => {
      data.forEach((container) => addContainer(container));

      const running = data.find((container) => container.status === 'running');
      if (running) {
        setSelectedContainer(running.id);
        socketRef.current.emit('exec', running.id);
      }
    });

    return () => {
      socketRef.current?.disconnect();
    };
  }, []);

  // Ініціалізація терміналу після завантаження DOM
  useEffect(() => {
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
      term.current?.dispose();
    };
  }, []);

  const handleChangeContainer = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newContainerId = e.target.value;
    setSelectedContainer(newContainerId);

    term.current?.reset(); // повне очищення
    term.current?.write('\x1Bc'); // скидання буфера

    socketRef.current.emit('exec', newContainerId);
  };

  return (
    <div>
      <select name="containers" id="containers" value={selectedContainer} onChange={handleChangeContainer}>
        {containers.length > 0 ? (
          containers.map(({ id, name, status }) => (
            <OptionTag key={id} id={id} name={name} status={status} />
          ))
        ) : (
          <option disabled>Контейнерів немає</option>
        )}
      </select>

      <div className="w-screen h-screen bg-black">
        <div ref={terminalRef} className="w-full h-full text-left" />
      </div>
    </div>
  );
};

export default TerminalPage;
