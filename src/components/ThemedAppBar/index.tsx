import React from "react";
import { Box, useTheme } from "@mui/material";

interface ThemedAppBarProps {
  position?: "fixed" | "absolute" | "sticky" | "static" | "relative";
  color?:
    | "primary"
    | "secondary"
    | "neutral"
    | "blue"
    | "purple"
    | "green"
    | "yellow"
    | "red"
    | "orange";
  sx?: any;
  children?: React.ReactNode;
}

/**
 * A theme-aware AppBar replacement that supports custom palette colors
 * and ensures all child MUI components (icons, selects, buttons)
 * use the correct contrast color automatically.
 *
 * Usage:
 *  <ThemedAppBar position="fixed" color="primary" sx={{ top: 'auto', bottom: 0 }}>
 *  <ThemedAppBar color="purple" position="static">
 */
export default function ThemedAppBar({
  position = "static",
  color = "primary",
  sx,
  children,
}: ThemedAppBarProps) {
  const theme = useTheme();
  const paletteColor = theme.palette[color] || theme.palette.primary;

  return (
    <Box
      component="header"
      sx={{
        position,
        top: position === "fixed" || position === "absolute" ? 0 : undefined,
        left: 0,
        right: 0,
        zIndex: theme.zIndex.appBar,
        bgcolor: paletteColor.main,
        color: paletteColor.contrastText,
        boxShadow: theme.shadows[4],
        transition: "background-color 0.3s ease, color 0.3s ease",

        "& .MuiTypography-root": {
          color: paletteColor.contrastText,
        },
        "& .MuiSvgIcon-root": {
          color: paletteColor.contrastText,
        },
        "& .MuiIconButton-root": {
          color: paletteColor.contrastText,
        },
        "& .MuiButtonBase-root": {
          color: paletteColor.contrastText,
        },
        "& .MuiSelect-icon": {
          color: paletteColor.contrastText,
        },
        "& .MuiOutlinedInput-notchedOutline": {
          borderColor: "rgba(255,255,255,0.4)",
        },
        "&:hover .MuiOutlinedInput-notchedOutline": {
          borderColor: paletteColor.contrastText,
        },
        "& .MuiSelect-select": {
          color: paletteColor.contrastText,
        },

        ...sx, // allow user overrides like standard AppBar
      }}
    >
      {children}
    </Box>
  );
}
