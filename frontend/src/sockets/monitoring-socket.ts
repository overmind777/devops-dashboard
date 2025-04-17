import { io, Socket } from 'socket.io-client'

let socket: Socket

export const monitoringSocket = () => {
    socket = io( 'http://127.0.0.1:3000/containers' )
    socket.on( 'connect', () => {
        console.log( 'Connected to Monitoring' )
    } )

    socket.on( 'disconnect', () => {
        console.warn( '❌ Disconnected from Monitoring WebSocket' )
    } )

    return socket
}
