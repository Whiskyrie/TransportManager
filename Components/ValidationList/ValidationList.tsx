import React, { useEffect, useRef } from "react";
import { View, Text, Animated, StyleSheet, Platform } from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { validationTheme as theme } from "./validationTheme";

interface ValidationItem {
  isValid: boolean;
  message: string;
}

interface ValidationListProps {
  items: ValidationItem[];
  isFieldFocused: boolean;
  fieldTouched: boolean;
}

export const ValidationList: React.FC<ValidationListProps> = ({
  items,
  isFieldFocused,
  fieldTouched,
}) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const shouldShow = isFieldFocused; // Removida a condição fieldTouched

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: shouldShow ? 1 : 0,
      duration: 200,
      useNativeDriver: true,
    }).start();
  }, [shouldShow]);

  // Se não deve mostrar, retorna null imediatamente
  if (!shouldShow) return null;

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      <View style={styles.grid}>
        {items.map((item, index) => (
          <View key={index} style={styles.gridItem}>
            <Icon
              name={item.isValid ? "check" : "close"}
              size={12}
              color={item.isValid ? theme.colors.success : theme.colors.error}
              style={styles.icon}
            />
            <Text
              style={[
                styles.message,
                item.isValid ? styles.validText : styles.invalidText,
              ]}
              numberOfLines={1}
            >
              {item.message}
            </Text>
          </View>
        ))}
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: -theme.spacing.xs,
    marginBottom: theme.spacing.sm,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginHorizontal: -theme.spacing.xxs,
  },
  gridItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: theme.spacing.xs,
    paddingVertical: theme.spacing.xxs,
    marginHorizontal: theme.spacing.xxs,
    marginVertical: theme.spacing.xxs,
    borderRadius: 4,
    backgroundColor: Platform.select({
      ios: "rgba(0,0,0,0.02)",
      android: "rgba(0,0,0,0.03)",
    }),
  },
  icon: {
    marginRight: 4,
  },
  message: {
    fontSize: theme.typography.small,
    ...Platform.select({
      ios: {
        fontWeight: "400",
      },
      android: {
        fontFamily: "sans-serif",
      },
    }),
  },
  validText: {
    color: theme.colors.success,
  },
  invalidText: {
    color: theme.colors.error,
  },
});
