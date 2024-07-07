import React from "react";
import AppLayout from "../components/layout/AppLayout";
import { Box, Typography } from "@mui/material";
import { grayColor, bgGradient, bgDarkGradient } from "../constants/color";

const Home = () => {
    return (
        <Box
            sx={{
                // backgroundImage: bgDarkGradient,
                // backgroundImage: bgGradient,
                bgcolor: grayColor,
            }}
            height={"100%"}
        >
            <Typography p={"2rem"} variant="h4" textAlign={"center"}>
                Select a friend to chat
            </Typography>
        </Box>
    );
};

export default AppLayout()(Home);
