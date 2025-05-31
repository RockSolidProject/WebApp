import React, { useEffect, useState, useRef } from "react";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    Legend,
    ResponsiveContainer,
    Label,
    CartesianGrid
} from "recharts";

const ropeGrades = [
    "3", "3+", "4a", "4b", "4c",
    "5a", "5b", "5c",
    "6a", "6a+", "6b", "6b+", "6c", "6c+",
    "7a", "7a+", "7b", "7b+", "7c", "7c+",
    "8a", "8a+", "8b", "8b+", "8c", "8c+",
    "9a", "9a+", "9b", "9b+", "9c", "9c+"
];
const boulderGrades = [
    "3", "3+", "4", "4+", "5", "5+",
    "6A", "6A+", "6B", "6B+", "6C", "6C+",
    "7A", "7A+", "7B", "7B+", "7C", "7C+",
    "8A", "8A+", "8B", "8B+", "8C", "8C+", "9A"
];
const urbanGrades = [
    "I", "II", "III", "IV", "IV+", "V", "V+", "VI", "VI+",
    "VII", "VII+", "VIII", "VIII+", "IX", "IX+", "X", "X+", "XI", "XI+"
];

function getGradesByType(type) {
    if (type === "boulder") return boulderGrades;
    if (type === "lead")    return ropeGrades;
    if (type === "urban")   return urbanGrades;
    return [];
}

const backendUrl = import.meta.env.VITE_BACKEND_URL;

export default function GradesOverTimeChart({ routeId }) {
    const [dataOverTime, setDataOverTime] = useState([]);
    const [routeType, setRouteType] = useState(null);
    const [chartData, setChartData] = useState([]);
    const [currentPeriod, setCurrentPeriod] = useState("");
    const [yMax, setYMax] = useState(1);
    const [isLoading, setIsLoading] = useState(true);

    const indexRef = useRef(0);
    const intervalRef = useRef(null);

    useEffect(() => {
        if (!routeId) return;

        setIsLoading(true);

        fetch(`${backendUrl}/routeConnections/gradesOverTime/${routeId}`)
            .then(async (res) => {
                if (!res.ok) {
                    const text = await res.text();
                    throw new Error(`Server napaka: ${res.status} – ${text}`);
                }
                return res.json();
            })
            .then((resp) => {
                const arr = Array.isArray(resp.data) ? resp.data : [];
                const rt = resp.routeType;

                setDataOverTime(arr);
                setRouteType(rt);

                if (!arr.length || !rt) {
                    setChartData([]);
                    setYMax(1);
                    return;
                }

                let maxVal = 1;
                arr.forEach(entry => {
                    Object.values(entry.grades).forEach(count => {
                        if (count > maxVal) maxVal = count;
                    });
                });
                setYMax(maxVal);

                const gradesList = getGradesByType(rt);
                const initialData = gradesList.map(grade => ({
                    grade,
                    count: 0
                }));
                setChartData(initialData);
                setCurrentPeriod(arr[0]?.period || "");
            })
            .catch((err) => {
                console.error("Fetch napaka:", err.message);
                setChartData([]);
                setYMax(1);
            })
            .finally(() => setIsLoading(false));
    }, [routeId]);

    useEffect(() => {
        if (isLoading || !routeType || dataOverTime.length === 0) return;

        clearInterval(intervalRef.current);
        indexRef.current = 0;

        const gradesList = getGradesByType(routeType);
        setChartData(gradesList.map(grade => ({ grade, count: 0 })));
        setCurrentPeriod(dataOverTime[0].period);

        intervalRef.current = setInterval(() => {
            const idx = indexRef.current;

            if (idx >= dataOverTime.length) {
                clearInterval(intervalRef.current);
                return;
            }

            const entry = dataOverTime[idx];
            setCurrentPeriod(entry.period);

            setChartData(prev => {
                return prev.map(item => ({
                    ...item,
                    count: item.count + (entry.grades[item.grade] || 0),
                }));
            });

            indexRef.current += 1;
        }, 500);

        return () => clearInterval(intervalRef.current);
    }, [dataOverTime, routeType, isLoading]);

    // DEBUG: odstrani kasneje
    console.log("chartData:", chartData);
    console.log("dataOverTime:", dataOverTime);
    console.log("routeType:", routeType);
    console.log("yMax:", yMax);

    if (isLoading) {
        return <div className="p-4 text-center">Nalaganje podatkov...</div>;
    }

    if (!chartData.length || !routeType) {
        return <div className="p-4 text-center">Ni podatkov za prikaz</div>;
    }

    return (
        <div className="w-full h-full flex flex-col">
            <h3 className="text-center font-bold mb-2">
                Kumulativne ocene do {currentPeriod}
            </h3>

            <div className="flex-grow min-h-[400px]">
                <ResponsiveContainer width="100%" height={400}>
                    <BarChart
                        data={chartData}
                        margin={{ top: 20, right: 30, left: 40, bottom: 60 }}
                    >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis
                            dataKey="grade"
                            angle={-45}
                            textAnchor="end"
                            height={60}
                            interval={0}
                        >
                            <Label
                                value="Težavnost (Grade)"
                                position="insideBottom"
                                offset={-50}
                                style={{ textAnchor: 'middle' }}
                            />
                        </XAxis>

                        <YAxis domain={[0, yMax]}>
                            <Label
                                value="Kumulativno število ocen"
                                angle={-90}
                                position="insideLeft"
                                style={{ textAnchor: 'middle' }}
                            />
                        </YAxis>

                        <Tooltip
                            formatter={(value) => [`${value}`, 'Število ocen']}
                            labelFormatter={(label) => `Težavnost: ${label}`}
                        />

                        <Legend />

                        <Bar
                            dataKey="count"
                            name="Število ocen"
                            fill="#3b82f6"
                            animationDuration={500}
                            isAnimationActive={true}
                        />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
