import { useEffect, useRef, useState } from 'react';
import { Terminal } from '@xterm/xterm';
import '@xterm/xterm/css/xterm.css';
import { FitAddon } from 'xterm-addon-fit';
import { WebLinksAddon } from '@xterm/addon-web-links';
import { monitoringSocket } from '../sockets/monitoring-socket';
import { Container } from '../types/types';
<<<<<<< HEAD
import { useTerminalStore } from '../stores/terminalStore';
=======
import container from './Monitoring';
>>>>>>> 09fdcedd1f2ace232274ec16f7260beaef78ad7a

type Props = {
  id: string;
  name: string;
  status: string;
<<<<<<< HEAD
=======
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
>>>>>>> 09fdcedd1f2ace232274ec16f7260beaef78ad7a
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
<<<<<<< HEAD

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
=======
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

>>>>>>> 09fdcedd1f2ace232274ec16f7260beaef78ad7a
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
<<<<<<< HEAD
    setSelectedContainer(newContainerId);

    term.current?.reset(); // повне очищення
    term.current?.write('\x1Bc'); // скидання буфера

=======
    setVisibleContainer(newContainerId);
    term.current?.reset();
>>>>>>> 09fdcedd1f2ace232274ec16f7260beaef78ad7a
    socketRef.current.emit('exec', newContainerId);
  };

  return (
    <div>
<<<<<<< HEAD
      <select name="containers" id="containers" value={selectedContainer} onChange={handleChangeContainer}>
=======
      <select
        name="containers"
        id="containers"
        value={visibleContainer}
        onChange={handleChangeContainer}
      >
>>>>>>> 09fdcedd1f2ace232274ec16f7260beaef78ad7a
        {containers.length > 0 ? (
          containers.map(({ id, name, status }) => (
            <OptionTag key={id} id={id} name={name} status={status} />
          ))
        ) : (
          <option disabled>Контейнерів немає</option>
        )}
      </select>

      <div className="w-screen h-screen bg-black">
<<<<<<< HEAD
        <div ref={terminalRef} className="w-full h-full text-left" />
=======
        <div ref={terminalRef} className="w-full h-full text-left"></div>
>>>>>>> 09fdcedd1f2ace232274ec16f7260beaef78ad7a
      </div>
    </div>
  );
};

export default TerminalPage;
