import React, {useState} from 'react';
import {Collapse,Box,Typography,FormControlLabel,Checkbox,Slider,Divider,Button,Stack, useMediaQuery, useTheme} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

const FilterSidebar = ({requireBoulder, setRequireBoulder, requireLead, setRequireLead, requireUrban, setRequireUrban, requiredNumberOfRoutes, setRequiredNumberOfRoutes,
      distanceTmp, setDistanceTmp, setDistance, latitude, setLatitude, longitude, setLongitude, choosingLocation, setChoosingLocation, isLoggedIn, navigate, climbingAreas, setRequireMoonboard, requireMoonboard,
      setRequireSpraywall, requireSpraywall, setRequireLeadCenter, requireLeadCenter, setRequireBoulders, requireBoulders, setRequireKilter, requireKilter, setShowClimbingAreas,
      showClimbingAreas, showClimbingCenters, setShowClimbingCenters
}) => {
    const [isActiveMobile, setIsActiveMobile] = useState(false)

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm')); 

    const contentFilters = (<>
        <FormControlLabel
            control={
                <Checkbox checked={showClimbingAreas} onChange={() => setShowClimbingAreas(!showClimbingAreas)} />
            }
            label={
                <Typography variant='h6' fontWeight={550}>Zunanja plezališča</Typography>
            }
        />

        {showClimbingAreas && (
            <Box pl={2}>
                <Typography fontWeight={550} variant="h6" gutterBottom>Vsebujejo:</Typography>
                <Stack direction="column" spacing={0}>
                    <FormControlLabel sx={{ mt: -1 }}
                        control={
                            <Checkbox size="small" checked={requireBoulder} onChange={() => setRequireBoulder(!requireBoulder)} />
                        }
                        label="Balvane"
                    />
                    <FormControlLabel sx={{ mt: -1 }}
                        control={
                            <Checkbox size="small" checked={requireLead} onChange={() => setRequireLead(!requireLead)} />
                        }
                        label="Športne poti"
                    />
                    <FormControlLabel sx={{ mt: -1 }}
                        control={
                            <Checkbox size="small" checked={requireUrban} onChange={() => setRequireUrban(!requireUrban)} />
                        }
                        label="Urbane poti"
                    />
                </Stack>
                <Box style={{display: 'flex', alignItems: 'center', gap: 2}}>
                    <Typography fontWeight={550} variant="h6" gutterBottom>Število poti: </Typography>
                    <Typography fontWeight={550} variant="h6" gutterBottom> {requiredNumberOfRoutes}</Typography>
                </Box>
                <Box sx={{pl: 1}}>
                    <Box sx={{ width: "50%" }}>
                    <Slider
                        type="range"
                        min={0}
                        max={Math.max(1, ...climbingAreas.map(a => a.routes?.length || 0))}
                        value={requiredNumberOfRoutes}
                        onChange={(e) => setRequiredNumberOfRoutes(Number(e.target.value))}
                        size='small'
                    />
                    </Box>
                </Box>
            </Box>
        )}

        <Divider sx={{ my: 2 }} />

        <FormControlLabel
            control={
                <Checkbox checked={showClimbingCenters} onChange={() => setShowClimbingCenters(!showClimbingCenters)} />
            }
            label={
                <Typography variant='h6' fontWeight={550}>Plezalni centri</Typography>
            }
        />
        {showClimbingCenters && (
            <Stack pl={2} direction="column" spacing={0}>
                <FormControlLabel sx={{ mt: -1 }}
                    control={
                        <Checkbox size="small" checked={requireLeadCenter} onChange={() => setRequireLeadCenter(!requireLeadCenter)} />
                    }
                    label="Športne stene"
                /> 
                <FormControlLabel sx={{ mt: -1 }}
                    control={
                        <Checkbox size="small" checked={requireBoulders} onChange={() => setRequireBoulders(!requireBoulders)} />
                    }
                    label="Balvanske stene"
                />
                <FormControlLabel sx={{ mt: -1 }}
                    control={
                        <Checkbox size="small" checked={requireSpraywall} onChange={() => setRequireSpraywall(!requireSpraywall)} />
                    }
                    label="Šutalnica"
                />
                <FormControlLabel sx={{ mt: -1 }}
                    control={
                        <Checkbox size="small" checked={requireMoonboard} onChange={() => setRequireMoonboard(!requireMoonboard)} />
                    }
                    label="Moonboard"
                />
                <FormControlLabel sx={{ mt: -1 }}
                    control={
                        <Checkbox size="small" checked={requireKilter} onChange={() => setRequireKilter(!requireKilter)} />
                    }
                    label="Kilterboard"
                />
            </Stack>
        )}
        <Divider sx={{ mt: 4, mb: 3 }} />

        {isLoggedIn && 
            <Stack direction="column" spacing={2} px={2}>
                <Button variant="contained" onClick={() => navigate('/addClimbingArea')}>Dodaj plezališče</Button>
                <Button variant="contained" onClick={() => navigate('/addClimbingCenter')}>Dodaj center</Button>
            </Stack>
        }
    </>)

    return (
        <Box sx={{ width: '100%', p: 2, paddingRight: 1, bgcolor: 'grey.100', borderRadius: 2,boxSizing: "border-box" }}>
            {!isMobile ? 
                <Typography variant="h5" fontWeight={550} gutterBottom>Filtri</Typography>
                : 
                <Box 
                    onClick={() => setIsActiveMobile(!isActiveMobile)}
                    sx={{
                        display: "flex",
                        alignItems: 'center',
                        cursor: 'pointer',
                        '&:hover': { color: "#1565c0" }
                    }}
                >
                    {isActiveMobile ? <ExpandMoreIcon/>: <ChevronRightIcon/>}
                    <Typography variant="h5" fontWeight={550}>Filtri</Typography>
                </Box>
            }

            {isMobile ? (
                <Collapse in={isActiveMobile}>{contentFilters}</Collapse>
            )
            : (
                contentFilters
            )}
        </Box>
    );
};

export default FilterSidebar;