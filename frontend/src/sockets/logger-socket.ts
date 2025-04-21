import { io, Socket } from 'socket.io-client'

let socket: Socket

export const loggerSocket = () => {
  socket = io( 'ws://127.0.0.1:3000/logs', {
    transports: ['websocket']
  }  )

  socket.on( 'connect', () => {
    console.log( 'Connected to Logging' )
  } )

  socket.on( 'disconnect', () => {
    console.warn( '❌ Disconnected from Logging WebSocket' )
  } )

  return socket
}
