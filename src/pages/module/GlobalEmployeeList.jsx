import React, { useState, useEffect } from 'react';
import './css/EmployeeList.css';

function EmployeeList() {
    const [employees, setEmployees] = useState([]);
    const [job, setJob] = useState('police'); // Setze den Job, den du anzeigen möchtest

    useEffect(() => {
        // Funktion, die Daten vom FiveM-Server anfordert
        const fetchData = () => {
            window.postMessage({
                action: 'getEmployees',
                job: job
            }, '*');
        };

        // Event Listener für die NUI Messages
        const handleMessage = (event) => {
            if (event.data.action === 'getEmployeesResponse' && event.data.status === 'success') {
                setEmployees(event.data.data);
            } else if (event.data.status === 'error') {
                console.error(event.data.message);
            }
        };

        window.addEventListener('message', handleMessage);
        fetchData();

        return () => {
            window.removeEventListener('message', handleMessage);
        };
    }, [job]);

    return (
        <div className="table-container">
            <h2 className="header">Mitarbeiterübersicht - {job}</h2>
            <table className="table">
                <thead>
                    <tr>
                        <th className="th">Name</th>
                        <th className="th">Job Grade</th>
                        <th className="th">Telefonnummer</th>
                        <th className="th">E-Mail</th>
                        <th className="th">Details</th>
                    </tr>
                </thead>
                <tbody>
                    {employees.map((employee, index) => (
                        <tr key={index} className="tr">
                            <td className="td">{employee.name}</td>
                            <td className="td">{employee.job_grade}</td>
                            <td className="td">{employee.phone}</td>
                            <td className="td">{employee.email}</td>
                            <td className="td"><button onClick={() => console.log('Details anzeigen für', employee.id)}>Anzeigen</button></td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default EmployeeList;
