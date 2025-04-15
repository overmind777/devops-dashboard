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
            console.log(data)
            setContainers(data)
        })

        socket.emit('monitoring-socket', 'Привіт від клієнта!')
        socket.emit('findAllContainers')

        return () => {
            socket.disconnect()
        }
    }, [])

    useEffect( () => {
        console.log(containers)
    }, [containers] )

    const handleStart = (containerId: string) => {
        socketRef.current?.emit('startContainer', containerId)
    }

    const handleStop = (containerId: string) => {
        socketRef.current?.emit('stopContainer', containerId)
    }

    const handleRestart = (containerId: string) => {
        socketRef.current?.emit('restartContainer', containerId)
    }

    return (
        <div className="p-6">
            <ul>
                {containers.map((item, i) => {
                    return (
                        <li key={i}>
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
