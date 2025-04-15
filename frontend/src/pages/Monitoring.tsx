// import { CartesianGrid, Legend, Line, LineChart, Tooltip, XAxis, YAxis } from 'recharts'
import { useEffect, useRef, useState } from 'react'
import { monitoringSocket } from '../sockets/monitoring-socket'

function Monitoring(props) {

    const [containers, setContainers] = useState([])
    const socketRef = useRef(null)

    useEffect(() => {
        const socket = monitoringSocket()
        socketRef.current = socket

        socket.on('findAllContainers', (data) => {
            setContainers(data)
        })
        socket.on('updateContainer', (updatedContainer) => {
            console.log(updatedContainer.state)
            setContainers(prev =>
                prev.map(c => c.id === updatedContainer.id ? updatedContainer : c)
            )
        })

        socket.emit('monitoring-socket', 'Привіт від клієнта!')
        socket.emit('findAllContainers')
        // socket.emit('updateContainer')

        return () => {
            socket.disconnect()
        }
    }, [])

    const handleStart = (containerId: string) => {
        socketRef.current?.emit('startContainer', containerId)
        socketRef.current?.emit('updateContainer', containerId)
    }

    const handleStop = (containerId: string) => {
        socketRef.current?.emit('stopContainer', containerId)
        socketRef.current?.emit('updateContainer', containerId)
    }

    const handleRestart = (containerId: string) => {
        socketRef.current?.emit('restartContainer', containerId)
        socketRef.current?.emit('updateContainer', containerId)
    }

    return (
        <div className="p-6">
            <ul>
                {containers?.map((item) => {
                    return (
                        <li key={item.id}>
                            <div className="flex items-center justify-center gap-[15px]">
                                <p>{item.name}</p>
                                <p>{item.state.Status}</p>
                                <button onClick={() => {handleStart(item.id)}}>Start</button>
                                <button onClick={() => {handleStop(item.id)}}>Stop</button>
                                <button onClick={() => {handleRestart(item.id)}}>Restart</button>
                            </div>
                        </li>
                    )
                })}
            </ul>
        </div>
    )
}

export default Monitoring
