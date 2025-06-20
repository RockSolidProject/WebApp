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
import {
    Box,
    Typography,
    Button,
    CircularProgress,
    Slider
} from "@mui/material";

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
    const [sliderIndex, setSliderIndex] = useState(0);
    const [yMax, setYMax] = useState(1);
    const [isLoading, setIsLoading] = useState(true);
    const [isPlaying, setIsPlaying] = useState(false);
    const [showMonthlyDiff, setShowMonthlyDiff] = useState(false);
    const hasPlayedRef = useRef(false);

    const intervalRef = useRef(null);
    const indexRef = useRef(0);

    useEffect(() => {
        if (!routeId) return;
        setIsLoading(true);

        fetch(`${backendUrl}/routeConnections/gradesOverTime/${routeId}`)
            .then(async (res) => {
                if (!res.ok) {
                    const text = await res.text();
                    throw new Error(`Error: ${res.status} – ${text}`);
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

                const grades = getGradesByType(rType);
                const cumulativeCounts = {};
                grades.forEach((g) => (cumulativeCounts[g] = 0));
                let maxY = 1;

                arr.forEach((entry) => {
                    grades.forEach((grade) => {
                        cumulativeCounts[grade] += entry.grades[grade] || 0;
                        if (cumulativeCounts[grade] > maxY) {
                            maxY = cumulativeCounts[grade];
                        }
                    });
                });

                setYMax(maxY);
                updateChartData(0, arr, rType, showMonthlyDiff);
            })
            .catch((err) => {
                console.error("Napaka:", err.message);
                setChartData([]);
                setYMax(1);
            })
            .finally(() => setIsLoading(false));
    }, [routeId]);

    useEffect(() => {
        if (!isLoading && chartData.length && routeType && !isPlaying && !hasPlayedRef.current) {
            startAnimation();
            hasPlayedRef.current = true;
        }
    }, [chartData]);
    const updateChartData = (index, data = dataOverTime, type = routeType, monthly = showMonthlyDiff) => {
        if (!type || !data.length) return;

        const grades = getGradesByType(type);

        if (monthly) {
            const monthlyData = grades.map((grade) => ({
                grade,
                count: data[index].grades[grade] || 0
            }));
            setChartData(monthlyData);
        } else {
            const cumulative = {};
            grades.forEach((g) => (cumulative[g] = 0));
            for (let i = 0; i <= index; i++) {
                grades.forEach((g) => {
                    cumulative[g] += data[i].grades[g] || 0;
                });
            }
            const cumulativeData = grades.map((grade) => ({
                grade,
                count: cumulative[grade] || 0
            }));
            setChartData(cumulativeData);
        }

        setSliderIndex(index);
    };

    const startAnimation = () => {
        if (!routeType || !dataOverTime.length) return;

        clearInterval(intervalRef.current);
        indexRef.current = 0;
        setIsPlaying(true);

        let step = dataOverTime.length <= 3 ? 400 : dataOverTime.length <= 8 ? 300 : 200;

        intervalRef.current = setInterval(() => {
            const i = indexRef.current;
            if (i >= dataOverTime.length) {
                clearInterval(intervalRef.current);
                setIsPlaying(false);
                return;
            }
            updateChartData(i);
            indexRef.current++;
        }, step);
    };

    useEffect(() => {
        if (!isLoading) {
            updateChartData(sliderIndex);
        }
    }, [showMonthlyDiff]);

    const formatYAxis = (value) => Number.isInteger(value) ? value : "";

    const generateTicks = (max) => {
        const ticks = [];
        for (let i = 0; i <= max; i++) ticks.push(i);
        return ticks;
    };

    if (isLoading) {
        return <Box p={4} textAlign="center"><CircularProgress /></Box>;
    }

    if (!chartData.length || !routeType) {
        return <Box p={4} textAlign="center">Ni podatkov za prikaz</Box>;
    }

    return (
        <Box width="100%">
            <Typography variant="h6" align="center" fontWeight="bold" mb={1}>
                {showMonthlyDiff ? "Ocene za mesec " : "Kumulativne ocene do "} {dataOverTime[sliderIndex]?.period}
            </Typography>

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
                    />
                    <YAxis
                        domain={[0, yMax]}
                        ticks={generateTicks(yMax)}
                        tickFormatter={formatYAxis}
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
                    <Tooltip />
                    <Legend />
                    <Bar
                        dataKey="count"
                        name="Ocene"
                        fill="#3b82f6"
                        animationDuration={200}
                        isAnimationActive={true}
                    />
                </BarChart>
            </ResponsiveContainer>

            {/* Popravljen SLIDER z marks, valueLabelFormat in disabled med predvajanjem */}
            <Box mt={4} px={4}>
                <Slider
                    value={sliderIndex}
                    onChange={(e, val) => {
                        setSliderIndex(val);
                        updateChartData(val);
                        clearInterval(intervalRef.current);
                        setIsPlaying(false);
                    }}
                    min={0}
                    max={dataOverTime.length - 1}
                    step={1}
                    disabled={isPlaying}
                    marks={dataOverTime.map((d, i) => ({
                        value: i,
                        label: d.period
                    }))}
                    valueLabelDisplay="auto"
                    valueLabelFormat={(i) => dataOverTime[i]?.period}
                />
            </Box>

            <Box mt={2} textAlign="center">
                <Button
                    onClick={startAnimation}
                    variant="contained"
                    color="primary"
                    disabled={isPlaying}
                    sx={{
                        minWidth: 205,
                        display: 'inline-flex',
                        justifyContent: 'center'
                    }}
                >
                    {isPlaying ? "Predvajanje..." : "Ponovno predvajanje"}
                </Button>

                <Button
                    onClick={() => setShowMonthlyDiff(prev => !prev)}
                    variant="outlined"
                    color="secondary"
                    sx={{
                        ml: 2,
                        minWidth: 225,
                        display: 'inline-flex',
                        justifyContent: 'center'
                    }}
                >
                    {showMonthlyDiff ? "Prikaži kumulativno" : "Prikaži mesečno razliko"}
                </Button>
            </Box>
        </Box>
    );
}
