import { Outlet } from "react-router-dom";
import Box from "@mui/material/Box";

export function AboutLayout() {
  return (
    <Box sx={{ p: 4 }}>
      <Box component="header">About Header</Box>
      <Box component="main">
        <Outlet />
      </Box>
    </Box>
  );
}
