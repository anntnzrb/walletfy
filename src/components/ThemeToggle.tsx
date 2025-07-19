import { ActionIcon, useMantineColorScheme } from "@mantine/core";
import { IconMoon, IconSun } from "@tabler/icons-react";
import React, { useCallback } from "react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { toggleTheme } from "@/redux/slices/themeSlice";
import { storageUtils } from "@/utils/storage";

const ThemeToggleComponent: React.FC = () => {
  const dispatch = useAppDispatch();
  const themeMode = useAppSelector((state) => state.theme.mode);
  const { setColorScheme } = useMantineColorScheme();

  const handleToggle = useCallback(() => {
    dispatch(toggleTheme());
    const newTheme = themeMode === "light" ? "dark" : "light";
    setColorScheme(newTheme);
    storageUtils.saveTheme(newTheme);
  }, [dispatch, themeMode, setColorScheme]);

  return (
    <ActionIcon
      onClick={handleToggle}
      variant="default"
      size="lg"
      aria-label="Toggle color scheme"
      data-testid="theme-toggle"
      style={{
        backgroundColor: "rgba(255, 255, 255, 0.1)",
        border: "1px solid rgba(255, 255, 255, 0.2)",
        borderRadius: "var(--walletfy-radius-md)",
        color: "white",
        transition: "all 0.2s ease-in-out",
      }}
      title={
        themeMode === "light"
          ? "🌙 Cambiar a modo oscuro"
          : "☀️ Cambiar a modo claro"
      }
    >
      {themeMode === "light" ? <IconMoon size={18} /> : <IconSun size={18} />}
    </ActionIcon>
  );
};

export const ThemeToggle = React.memo(ThemeToggleComponent);
