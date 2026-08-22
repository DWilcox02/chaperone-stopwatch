import { NativeTabs } from 'expo-router/unstable-native-tabs';

import { useColorScheme } from 'react-native';

import { Colors } from '@/constants/theme';

export default function AppTabs() {
  const scheme = useColorScheme();
  const colors = Colors[scheme === 'unspecified' ? 'light' : scheme];

  return (
    <NativeTabs
      backgroundColor={colors.background}
      indicatorColor={colors.backgroundElement}
      labelStyle={{ selected: { color: colors.text } }}>
      <NativeTabs.Trigger name="child">
        <NativeTabs.Trigger.Label>Timers</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon
          sf={{ default: 'stopwatch', selected: 'stopwatch.fill' }}
          md="menu_book"
        />
      </NativeTabs.Trigger>

      
      <NativeTabs.Trigger name="index">
        <NativeTabs.Trigger.Label>Groups</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon
          sf={{ default: 'person.2', selected: 'person.2.fill' }}
          md="menu_book"
        />
      </NativeTabs.Trigger>
      
      <NativeTabs.Trigger name="log">
        <NativeTabs.Trigger.Label>Log</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon
          sf={{ default: 'book.closed', selected: 'book.closed.fill' }}
          md="menu_book"
        />
      </NativeTabs.Trigger>
    </NativeTabs>

  );
}
