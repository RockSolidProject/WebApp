// components/Section.js
import React from "react";
import { Box, Typography, Chip } from "@mui/material";

// Določi barvni stil na podlagi ID-ja
function getChipStyleFromId(id) {
    const colors = ["#FFCDD2", "#C8E6C9", "#BBDEFB", "#FFF9C4", "#D1C4E9"];
    const hash = Array.from(id).reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const backgroundColor = colors[hash % colors.length];
    return {
        backgroundColor,
        color: "#000",
    };
}

const Section = ({ title, items }) => {
    return (
        <Box>
            <Typography variant="h6" gutterBottom>
                {title}
            </Typography>
            <Box display="flex" flexWrap="wrap" gap={1}>
                {items.map((item) => (
                    <Chip
                        key={item._id}
                        label={item.name}
                        sx={getChipStyleFromId(item._id)}
                    />
                ))}
            </Box>
        </Box>
    );
};

export default Section;
