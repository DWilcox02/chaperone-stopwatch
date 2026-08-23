import { DarkTheme, DefaultTheme, ThemeProvider } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { useColorScheme } from 'react-native';
import * as Database from '../services/database';


import AppTabs from '@/components/app-tabs';
import { StopwatchSessionProvider } from '@/hooks/use-stopwatch-session';

SplashScreen.preventAutoHideAsync();

export default function TabLayout() {
  const colorScheme = useColorScheme();

  useEffect(() => {
    async function initializeDatabase() {
      try {
        await Database.getDatabase();
      } catch (error) {
        console.error('Failed to initialize the database.', error);
      } finally {
        await SplashScreen.hideAsync();
      }
    }

    void initializeDatabase();
  }, []);

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <StopwatchSessionProvider>
          <AppTabs />
        </StopwatchSessionProvider>
    </ThemeProvider>
  );
}
