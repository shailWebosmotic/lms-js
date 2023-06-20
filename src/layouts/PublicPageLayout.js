import React from "react";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { Outlet } from "react-router-dom";
import config from "../config";

export default function PublicPageLayout() {
  return (
    <Stack
      p={2}
      sx={{
        minHeight: "100vh",
      }}
    >
      <Stack alignItems="center">
        <Outlet />
      </Stack>
      <Box
        display="flex"
        flexGrow={1}
        alignItems="flex-end"
        justifyContent="center"
      >
        <Typography variant="subtitle" my={2}>
          © 2023–{new Date().getFullYear()} Company Name (V{config.version})
        </Typography>
      </Box>
    </Stack>
  );
}
