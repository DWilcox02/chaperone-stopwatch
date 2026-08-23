import { Platform, Text, type TextProps } from 'react-native';

import { Fonts, ThemeColor } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import styles from '@/constants/styles';

export type ThemedTextProps = TextProps & {
  type?: 'default' | 'title' | 'small' | 'smallBold' | 'subtitle' | 'link' | 'linkPrimary' | 'code';
  themeColor?: ThemeColor;
};

export function ThemedText({ style, type = 'default', themeColor, ...rest }: ThemedTextProps) {
  const theme = useTheme();

  return (
    <Text
      style={[
        { color: theme[themeColor ?? 'text'] },
        type === 'default' && styles.themedTextDefault,
        type === 'title' && styles.themedTextTitle,
        type === 'small' && styles.themedTextSmall,
        type === 'smallBold' && styles.themedTextSmallBold,
        type === 'subtitle' && styles.themedTextSubtitle,
        type === 'link' && styles.themedTextLink,
        type === 'linkPrimary' && styles.themedTextLinkPrimary,
        type === 'code' && [styles.themedTextCode, { fontFamily: Fonts.mono, fontWeight: Platform.select({ android: 700 }) ?? 500 }],
        style,
      ]}
      {...rest}
    />
  );
}

