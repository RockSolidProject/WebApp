import {
    Chart,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
} from 'chart.js';
import { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';

Chart.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const ropeGrades = [ "3", "3+", "4a", "4b", "4c", "5a", "5b", "5c", "6a", "6a+", "6b", "6b+", "6c", "6c+", "7a", "7a+", "7b", "7b+", "7c", "7c+", "8a", "8a+", "8b", "8b+", "8c", "8c+", "9a", "9a+", "9b", "9b+", "9c", "9c+" ];
const boulderGrades = [ "3", "3+", "4", "4+", "5", "5+", "6A", "6A+", "6B", "6B+", "6C", "6C+", "7A", "7A+", "7B", "7B+", "7C", "7C+", "8A", "8A+", "8B", "8B+", "8C", "8C+", "9A" ];
const urbanGrades = [ "I", "II", "III", "IV", "IV+", "V", "V+", "VI", "VI+", "VII", "VII+", "VIII", "VIII+", "IX", "IX+", "X", "X+", "XI", "XI+" ];

export default function AnimatedGradesChart({ routeId }) {
    const [data, setData] = useState(null);
    const [error, setError] = useState(null);
    const [gradeType, setGradeType] = useState('lead');

    useEffect(() => {
        async function fetchData() {
            try {
                const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/routeConnections/gradesOverTime/${routeId}`);
                if (!res.ok) throw new Error("Failed to fetch grades over time");
                const json = await res.json();
                if (!Array.isArray(json)) throw new Error("Invalid data format");

                if (json.length > 0 && json[0].gradeType) {
                    setGradeType(json[0].gradeType);
                }

                setData(json);
            } catch (err) {
                setError(err.message);
            }
        }
        fetchData();
    }, [routeId]);

    if (error) return <div style={{ color: "red" }}>{error}</div>;
    if (!data) return <div>Loading...</div>;
    if (!Array.isArray(data) || data.length === 0) return <div>No grade data yet.</div>;

    const gradeScale = gradeType === 'boulder' ? boulderGrades : gradeType === 'urban'
            ? urbanGrades : ropeGrades;

    const chartData = {
        labels: data.map(d => d.period),
        datasets: [{
            label: 'Average Grade Index',
            data: data.map(d => d.avgGradeIndex),
            fill: false,
            borderColor: 'rgb(75, 192, 192)',
            tension: 0.1
        }]
    };

    const chartOptions = {
        responsive: true,
        animation: {
            duration: 2000
        },
        scales: {
            y: {
                ticks: {
                    callback: function (value) {
                        return gradeScale[Math.round(value)] ?? value;
                    }
                },
                title: {
                    display: true,
                    text: 'Grade'
                },
                min: 0,
                max: gradeScale.length - 1
            },
            x: {
                title: {
                    display: true,
                    text: 'Period'
                }
            }
        },
        plugins: {
            legend: {
                display: true
            },
            tooltip: {
                callbacks: {
                    label: function (context) {
                        const grade = gradeScale[Math.round(context.parsed.y)] ?? context.parsed.y;
                        return `Avg: ${grade}`;
                    }
                }
            }
        }
    };

    return <Line data={chartData} options={chartOptions} />;
}
