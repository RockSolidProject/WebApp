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
import { Box, Typography, Button, CircularProgress } from "@mui/material";

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
    if (type === "lead") return ropeGrades;
    if (type === "urban") return urbanGrades;
    return [];
}

const backendUrl = import.meta.env.VITE_BACKEND_URL;

export default function GradesOverTimeChart({ routeId }) {
    const [dataOverTime, setDataOverTime] = useState([]);
    const [routeType, setRouteType] = useState(null);
    const [chartData, setChartData] = useState([]);
    const [currentMonth, setCurrentMonth] = useState("");
    const [yMax, setYMax] = useState(1);
    const [isLoading, setIsLoading] = useState(true);
    const [isPlaying, setIsPlaying] = useState(false);

    const indexRef = useRef(0);
    const intervalRef = useRef(null);

    useEffect(() => {
        if (!routeId) return;
        setIsLoading(true);

        fetch(`${backendUrl}/routeConnections/gradesOverTime/${routeId}`)
            .then(async (res) => {
                if (!res.ok) {
                    const text = await res.text();
                    throw new Error(`Error when getting data for chart: ${res.status} – ${text}`);
                }
                return res.json();
            })
            .then((response) => {
                const arr = Array.isArray(response.data) ? response.data : [];
                const rType = response.routeType;

                setDataOverTime(arr);
                setRouteType(rType);

                if (!arr.length || !rType) {
                    setChartData([]);
                    setYMax(1);
                    return;
                }

                const gradesList = getGradesByType(rType);
                const cumulativeCounts = {};
                gradesList.forEach(grade => cumulativeCounts[grade] = 0);

                let maxCumulative = 1;
                arr.forEach(entry => { // Get max value on chart
                    gradesList.forEach(grade => {
                        cumulativeCounts[grade] += entry.grades[grade] || 0;
                        if (cumulativeCounts[grade] > maxCumulative) {
                            maxCumulative = cumulativeCounts[grade];
                        }
                    });
                });

                setYMax(maxCumulative);

                const startData = gradesList.map(grade => ({
                    grade,
                    count: 0
                }));
                setChartData(startData);
                setCurrentMonth(arr[0]?.period || "");
            })
            .catch((err) => {
                console.error("Fetch napaka:", err.message);
                setChartData([]);
                setYMax(1);
            })
            .finally(() => setIsLoading(false));
    }, [routeId]);

    function startAnimation() {
        if (!routeType || dataOverTime.length === 0) return;

        clearInterval(intervalRef.current);
        indexRef.current = 0;

        const gradesList = getGradesByType(routeType);
        setChartData(gradesList.map(grade => ({ grade, count: 0 })));
        setCurrentMonth(dataOverTime[0].period);

        setIsPlaying(true);

        let stepDuration;
        if (dataOverTime.length <= 3) {
            stepDuration = 400;
        } else if (dataOverTime.length <= 8) {
            stepDuration = 300;
        } else {
            stepDuration = 200;
        }

        intervalRef.current = setInterval(() => {
            const index = indexRef.current;

            if (index >= dataOverTime.length) {
                clearInterval(intervalRef.current);
                setIsPlaying(false);
                return;
            }

            const entry = dataOverTime[index];
            setCurrentMonth(entry.period);

            setChartData(previous => {
                return previous.map(item => ({
                    ...item,
                    count: item.count + (entry.grades[item.grade] || 0),
                }));
            });

            indexRef.current += 1;
        }, stepDuration);
    }

    useEffect(() => {
        if (isLoading) return;
        if (!routeType || dataOverTime.length === 0) return;

        startAnimation();

        return () => clearInterval(intervalRef.current);
    }, [isLoading, routeType, dataOverTime]);

    const formatYAxis = (value) => {
        return Number.isInteger(value) ? value : '';
    };

    if (isLoading) {
        return <Box p={4} textAlign="center"><CircularProgress /></Box>;
    }

    if (!chartData.length || !routeType) {
        return <Box p={4} textAlign="center">Ni podatkov za prikaz</Box>;
    }
    const generateYAxisScale = (max) => {
        const scale = [];
        for (let i = 0; i <= max; i++) {
            scale.push(i);
        }
        return scale;
    };

    return (
        <Box width="100%" display="flex" flexDirection="column">
            <Typography variant="h6" align="center" fontWeight="bold" mb={1}>
                Kumulativne ocene do {currentMonth}
            </Typography>

            <Box>
                <ResponsiveContainer width="100%" height={350}>
                    <BarChart
                        data={chartData}
                        margin={{ top: 10, right: 20, left: 20, bottom: 30 }}
                    >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis
                            dataKey="grade"
                            angle={-45}
                            textAnchor="end"
                            height={60}
                            interval={0}
                        >
                        </XAxis>
                        <YAxis
                            domain={[0, yMax]}
                            tickFormatter={formatYAxis}
                            ticks={generateYAxisScale(yMax)}
                            allowDecimals={false}
                        >
                            <Label
                                value="Število ocen"
                                angle={-90}
                                position="insideLeft"
                                offset={-10}
                                fill="#3b82f6"
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
                            name="Ocene"
                            fill="#3b82f6"
                            animationDuration={
                                dataOverTime.length <= 3 ? 400 : dataOverTime.length <= 8 ? 300 : 200
                            }
                            isAnimationActive={true}
                        />
                    </BarChart>
                </ResponsiveContainer>
            </Box>
            <Box mt={2} textAlign="center">
                <Button
                    onClick={startAnimation}
                    variant="contained"
                    color="primary"
                    disabled={isPlaying}
                >
                    {isPlaying ? "Predvajanje..." : "Ponovno predvajanje"}
                </Button>
            </Box>
        </Box>
    );
}