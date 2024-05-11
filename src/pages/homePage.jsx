import React from 'react'
import { Box } from "@mui/material";
import Filters from "../components/Filters";
import JobCards from "../components/JobCards";
function HomePage() {
  return (
    <Box
      fluid
      sx={{
        px: { xs: "1rem", sm: "2rem", md: "3rem", lg: "5rem" },
        py: "1rem",
        display: "flex",
        flexDirection: "column",
        gap: "6rem",
      }}
    >
      <Filters />
      <JobCards />
    </Box>
  );
}

export default HomePage