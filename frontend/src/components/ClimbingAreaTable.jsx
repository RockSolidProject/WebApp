import React, { useState } from 'react';
import {
  Table, TableHead, TableBody, TableRow, TableCell,
  Typography,Collapse, Box, 
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

const ClimbingAreaTable = ({ filteredAreas }) => {
    const [isTableVisible, setIsTableVisible] = useState(true);

    const hasData = filteredAreas.length > 0

    return (
        <>{hasData && (
            <Box sx={{ width: '100%' }}>
                <Box 
                    onClick={() => setIsTableVisible(!isTableVisible)}
                    sx={{
                        display: "flex",
                        alignItems: 'center',
                        cursor: 'pointer',
                        mb: 1,
                        '&:hover': { color: "#1565c0" }
                    }}
                >
                    {isTableVisible ? <ExpandMoreIcon/>: <ChevronRightIcon/>}
                    <Typography variant="h5" sx={{userSelect: 'none'}}>
                        Zunanja plezališča
                    </Typography>
                </Box>

                <Collapse in={isTableVisible}>
                    <Box>
                        <Table size="small">
                            <TableHead>
                                <TableRow sx={{ bgcolor: 'grey.100' }}>
                                    <TableCell><Typography fontWeight="550">Plezališče</Typography></TableCell>
                                    <TableCell align='center'><Typography fontWeight="550">Število poti</Typography></TableCell>
                                    <TableCell align='center'><Typography fontWeight="550">Vrste poti</Typography></TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                            {filteredAreas.map((climbingArea, index) => (
                                <TableRow key={index}>
                                    <TableCell>{climbingArea.name}</TableCell>
                                    <TableCell align='center'>{climbingArea.routes ? climbingArea.routes.length : 0}</TableCell>
                                    <TableCell align='center'>{(climbingArea.routes && climbingArea.routes.length > 0) ? (
                                        [...new Set(climbingArea.routes.map(route => route.type))].join(",")
                                    ) : "_"}</TableCell>
                                </TableRow>
                            ))}
                            </TableBody>
                        </Table>
                    </Box>
                </Collapse>
            </Box>
        )}</>
    );
};

export default ClimbingAreaTable;