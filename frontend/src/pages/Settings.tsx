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

    socketRef.current.emit('exec', '11b817fe0578d2d9252d6a2f3ff851603482e7e7a511ce36022095e0a9d368c6');

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

  return (
    <div className="w-screen h-screen bg-black">
      <div ref={terminalRef} className="w-full h-full text-left"></div>
    </div>
  );
}

export default Settings;
