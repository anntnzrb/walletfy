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
		>
			{themeMode === "light" ? <IconMoon size={18} /> : <IconSun size={18} />}
		</ActionIcon>
	);
};

export const ThemeToggle = React.memo(ThemeToggleComponent);
