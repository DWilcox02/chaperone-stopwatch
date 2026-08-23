import { version } from 'expo/package.json';
import { Image } from 'expo-image';
import { useColorScheme } from 'react-native';

import { ThemedText } from './themed-text';
import { ThemedView } from './themed-view';

import styles from '@/constants/styles';

export function WebBadge() {
  const scheme = useColorScheme();

  return (
    <ThemedView style={styles.webBadgeContainer}>
      <ThemedText type="code" themeColor="textSecondary" style={styles.webBadgeVersionText}>
        v{version}
      </ThemedText>
      <Image
        source={
          scheme === 'dark'
            ? require('@/assets/images/expo-badge-white.png')
            : require('@/assets/images/expo-badge.png')
        }
        style={styles.webBadgeImage}
      />
    </ThemedView>
  );
}

