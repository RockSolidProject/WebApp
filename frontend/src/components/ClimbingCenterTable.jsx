import React, { useState } from 'react';
import {
  Table, TableHead, TableBody, TableRow, TableCell,
  Typography,Collapse, Box, 
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

const ClimbingCenterTable = ({ filteredCenters }) => {
    const [isTableVisible, setIsTableVisible] = useState(true);

    return (
        <Box sx={{ width: '100%', mb: 2 }}>
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
                    Notranji plezalni centri
                </Typography>
            </Box>

            <Collapse in={isTableVisible}>
                <Table size='small'>
                    <TableHead>
                        <TableRow sx={{ bgcolor: 'grey.100' }}>
                            <TableCell><Typography fontWeight="550">Climbing Center</Typography></TableCell>
                            <TableCell align='center'><Typography fontWeight="550">Boulders</Typography></TableCell>
                            <TableCell align='center'><Typography fontWeight="550">Routes</Typography></TableCell>
                            <TableCell align='center'><Typography fontWeight="550">Moonboard</Typography></TableCell>
                            <TableCell align='center'><Typography fontWeight="550">Spray Wall</Typography></TableCell>
                            <TableCell align='center'><Typography fontWeight="550">Kilter</Typography></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                    {filteredCenters.map((center, index) => (
                        <TableRow key={index}>
                            <TableCell>{center.name}</TableCell>
                            <TableCell align='center'>{center.hasBoulders ? "✔️" : ""}</TableCell>
                            <TableCell align='center'>{center.hasRoutes ? "✔️" : ""}</TableCell>
                            <TableCell align='center'>{center.hasMoonboard ? "✔️" : ""}</TableCell>
                            <TableCell align='center'>{center.hasSprayWall ? "✔️" : ""}</TableCell>
                            <TableCell align='center'>{center.hasKilter ? "✔️" : ""}</TableCell>
                        </TableRow>
                    ))}
                    </TableBody>
                </Table>
            </Collapse>
        </Box>
    );
};

export default ClimbingCenterTable;