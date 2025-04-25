import { useEffect, useRef } from 'react';
import { Terminal } from '@xterm/xterm';
import '@xterm/xterm/css/xterm.css';
import { FitAddon } from 'xterm-addon-fit';
import { WebLinksAddon } from '@xterm/addon-web-links';
import { monitoringSocket } from '../sockets/monitoring-socket';

function Settings() {
  const terminalRef = useRef<HTMLDivElement>(null);
  const socketRef = useRef<any>(null);
  const term = useRef<Terminal | null>(null);

  useEffect(() => {
    socketRef.current = monitoringSocket();
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

    // Запускаємо exec на бекенді
    socketRef.current.emit('exec', '61a7019e978bc8ef076d1c34d56a5b789352e67c256def80f70b2ff7451cd0e7');

    // Надсилаємо кожне введення користувача
    term.current.onData((data) => {
      socketRef.current.emit('execInput', data);
    });

    // Слухаємо відповідь з контейнера
    socketRef.current.on('execOutput', (data: string) => {
      term.current?.write(data);
    });

    return () => {
      socketRef.current.disconnect();
      term.current?.dispose();
    };
  }, []);

  return (
    <div className="w-screen h-screen bg-black">
      <div ref={terminalRef} className="w-full h-full text-left"></div>
    </div>
  );
}

export default Settings;
