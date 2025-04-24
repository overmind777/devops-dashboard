import { useEffect, useRef } from 'react';
import { Terminal } from '@xterm/xterm';
import '@xterm/xterm/css/xterm.css';
import { FitAddon } from 'xterm-addon-fit';
import { WebLinksAddon } from '@xterm/addon-web-links';

function Settings() {
  const terminal = useRef<Terminal>( null );
  const terminalRef = useRef<HTMLDivElement>( null );
  // const fitAddon = useRef<FitAddon>( null );

  useEffect( () => {
    terminal.current = new Terminal( {
      cursorBlink: true,
      cursorStyle: 'bar',
      theme: {
        background: '#000000',
        foreground: '#ffffff',
      },
    } );

    // terminal.current.;
    if(terminalRef.current) {
      terminal.current.loadAddon(new WebLinksAddon())
      terminal.current.loadAddon( new FitAddon() );
      terminal.current.open( terminalRef.current );
      terminal.current.write('Hello from \x1B[1;3;31mxterm.js\x1B[0m $ ')
      terminal.current.focus()
    }

  }, [] );
  return (
    <div className="w-screen h-screen bg-black">
      <div id="terminal" ref={ terminalRef } className="w-screen h-screen text-left"></div>
    </div>
  );
}

export default Settings;