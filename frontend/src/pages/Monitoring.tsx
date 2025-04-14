// import React from 'react'

import { CartesianGrid, Legend, Line, LineChart, Tooltip, XAxis, YAxis } from 'recharts'

const data = [
    { name: '10:00', cpu: 20, mem: 60 },
    { name: '10:05', cpu: 35, mem: 75 },
    { name: '10:10', cpu: 25, mem: 70 },
]

function Monitoring( props ) {
    return (
        <div className='p-6'>
            <h1 className="text-2xl font-bold mb-4">Monitoring</h1>
            <LineChart width={500} height={300} data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="cpu" stroke="#8884d8" />
                <Line type="monotone" dataKey="mem" stroke="#82ca9d" />
            </LineChart>
        </div>
    )
}

export default Monitoring