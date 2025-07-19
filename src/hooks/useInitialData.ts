import { useMantineColorScheme } from "@mantine/core";
import { useEffect } from "react";
import { useAppDispatch } from "@/redux/hooks";
import { setEvents } from "@/redux/slices/eventsSlice";
import { setTheme } from "@/redux/slices/themeSlice";
import { setInitialBalance } from "@/redux/slices/balanceSlice";
import { storageUtils } from "@/utils/storage";

export const useInitialData = () => {
  const dispatch = useAppDispatch();
  const { setColorScheme } = useMantineColorScheme();

  useEffect(() => {
    const savedEvents = storageUtils.loadEvents();
    dispatch(setEvents(savedEvents));

    const savedTheme = storageUtils.loadTheme();
    dispatch(setTheme(savedTheme));
    // Sync Mantine color scheme with loaded theme
    setColorScheme(savedTheme);

    const savedInitialBalance = storageUtils.loadInitialBalance();
    dispatch(setInitialBalance(savedInitialBalance));
  }, [dispatch, setColorScheme]);
};
