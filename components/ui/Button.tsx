import { theme } from '@/constants/theme'
import React from 'react'
import {
    ActivityIndicator,
    StyleSheet,
    Text,
    TextStyle,
    TouchableOpacity,
    ViewStyle,
} from 'react-native'

interface ButtonProps {
  children: React.ReactNode
  onPress?: () => void
  variant?: 'default' | 'ghost' | 'outline'
  size?: 'default' | 'sm' | 'lg' | 'icon'
  disabled?: boolean
  loading?: boolean
  style?: ViewStyle
  textStyle?: TextStyle
}

export function Button({
  children,
  onPress,
  variant = 'default',
  size = 'default',
  disabled = false,
  loading = false,
  style,
  textStyle,
}: ButtonProps) {
  const getVariantStyle = () => {
    switch (variant) {
      case 'ghost':
        return styles.ghostButton
      case 'outline':
        return styles.outlineButton
      default:
        return styles.defaultButton
    }
  }

  const getSizeStyle = () => {
    switch (size) {
      case 'sm':
        return styles.smSize
      case 'lg':
        return styles.lgSize
      case 'icon':
        return styles.iconSize
      default:
        return styles.defaultSize
    }
  }

  return (
    <TouchableOpacity
      style={[
        styles.button,
        getVariantStyle(),
        getSizeStyle(),
        disabled && styles.disabled,
        style,
      ]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}
    >
      {loading ? (
        <ActivityIndicator
          size="small"
          color={variant === 'default' ? theme.colors.primaryForeground : theme.colors.primary}
        />
      ) : typeof children === 'string' ? (
        <Text
          style={[
            styles.text,
            variant === 'ghost' && styles.ghostText,
            variant === 'outline' && styles.outlineText,
            variant === 'default' && styles.defaultText,
            size === 'sm' && styles.smText,
            size === 'lg' && styles.lgText,
            textStyle,
          ]}
        >
          {children}
        </Text>
      ) : (
        children
      )}
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: theme.borderRadius.md,
  },

  // Variants
  defaultButton: {
    backgroundColor: theme.colors.primary,
  },
  ghostButton: {
    backgroundColor: 'transparent',
  },
  outlineButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: theme.colors.border,
  },

  // Sizes
  defaultSize: {
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
  },
  smSize: {
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
  },
  lgSize: {
    paddingVertical: theme.spacing.lg,
    paddingHorizontal: theme.spacing.xl,
  },
  iconSize: {
    width: 40,
    height: 40,
    paddingVertical: 0,
    paddingHorizontal: 0,
  },

  // Text
  text: {
    fontSize: theme.fontSize.base,
    fontWeight: '600',
  },
  defaultText: {
    color: theme.colors.primaryForeground,
  },
  ghostText: {
    color: theme.colors.foreground,
  },
  outlineText: {
    color: theme.colors.foreground,
  },
  smText: {
    fontSize: theme.fontSize.sm,
  },
  lgText: {
    fontSize: theme.fontSize.xl,
  },
  iconText: {
    fontSize: theme.fontSize.base,
  },

  disabled: {
    opacity: theme.colors.disabledOpacity,
  },
})
