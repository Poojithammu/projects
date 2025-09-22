import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    RadialBarChart, RadialBar, Legend
} from 'recharts';

import './FacultyPerformance.css';

const FacultyPerformance = () => {
    const [data, setData] = useState(null);

    useEffect(() => {
        const fetchPerformance = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await axios.get('https://fms-backend-a1b0.onrender.com/api/faculty/performance', {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setData(res.data);
                console.log(res.data);
            } catch (err) {
                console.error('Failed to load performance data:', err);
            }
        };

        fetchPerformance();
    }, []);

    if (!data) return <div className="text-center mt-5 text-white">Loading performance data...</div>;

    const barData = [
        { name: 'Classes', value: data.classesHandled },
        // { name: 'Research', value: data.researchCount },
    ];

    const radialData = [
        { name: 'Attendance', value: Number(data.attendanceRate) || 0, fill: '#00bfa6' },
        { name: 'Feedback', value: Number(data.averageFeedback) || 0, fill: '#00ffc8' },
    ];

    return (
        <div className="container mt-4 mb-5">
            <div className="performance-card shadow p-4">
                <h2 className="mb-4 text-center text-primary">Faculty Performance Dashboard</h2>

                {/* KPI Stats */}
                <div className="row text-center mb-4">
                    <div className="col-md-3">
                        <div className="kpi-card p-3">
                            <h6>Classes</h6>
                            <h4>{data.classesHandled}</h4>
                        </div>
                    </div>
                    {/* <div className="col-md-3">
                        <div className="kpi-card p-3">
                            <h6>Research</h6>
                            <h4>{data.researchCount}</h4>
                        </div>
                    </div> */}
                    <div className="col-md-3">
                        <div className="kpi-card p-3">
                            <h6>Attendance %</h6>
                            <h4>{data.attendanceRate}%</h4>
                        </div>
                    </div>
                    <div className="col-md-3">
                        <div className="kpi-card p-3">
                            <h6>Feedback</h6>
                            <h4>{data.averageFeedback}/5</h4>
                        </div>
                    </div>
                </div>

                {/* Charts */}
                <div className="row g-4">
                    <div className="col-md-6">
                        <div className="chart-card p-3 h-100">
                            <h5 className="text-secondary mb-3 text-center">Classes</h5>
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart data={barData}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                                    <XAxis dataKey="name" stroke="#ccc" />
                                    <YAxis allowDecimals={false} stroke="#ccc" />
                                    <Tooltip />
                                    <Bar dataKey="value" fill="#00ffc8" radius={[5, 5, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    <div className="col-md-6">
                        <div className="chart-card p-3 h-100">
                            <h5 className="text-secondary mb-3 text-center">Attendance & Feedback</h5>
                            <ResponsiveContainer width="100%" height={300}>
                                <RadialBarChart
                                    innerRadius="20%"
                                    outerRadius="90%"
                                    data={radialData}
                                    startAngle={180}
                                    endAngle={0}
                                >
                                    <RadialBar minAngle={15} background clockWise dataKey="value" />
                                    <Legend
                                        iconSize={10}
                                        layout="horizontal"
                                        verticalAlign="bottom"
                                        align="center"
                                        wrapperStyle={{ color: '#fff' }}
                                    />
                                    <Tooltip />
                                </RadialBarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FacultyPerformance;
