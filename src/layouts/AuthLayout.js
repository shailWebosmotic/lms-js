import React from "react";

import Box from "@mui/material/Box";
import { Outlet } from "react-router-dom";

export default function AuthLayout() {
  return (
    <Box>
      <Outlet />
    </Box>
  );
}
