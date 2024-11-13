import React from "react";
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
} from "react-native";

interface CustomButtonProps {
  title: string;
  onPress: () => void;
  type?: "primary" | "secondary" | "danger";
  style?: ViewStyle;
  textStyle?: TextStyle;
  disabled?: boolean;
}

const CustomButton: React.FC<CustomButtonProps> = ({
  title,
  onPress,
  type = "primary",
  style,
  textStyle,
}) => {
  return (
    <TouchableOpacity
      style={[styles.button, styles[type], style]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Text style={[styles.text, styles[`${type}Text`], textStyle]}>
        {title}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    padding: 10,
    borderRadius: 10,
    marginBottom: 15,
    marginTop: 10,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.095,
    shadowRadius: 8,
    elevation: 5,
  },
  primary: {
    backgroundColor: "#661511",
  },
  secondary: {
    backgroundColor: "#F0F0F0",
  },
  danger: {
    backgroundColor: "#FF3B30",
  },
  text: {
    fontSize: 16,
    fontWeight: "600",
  },
  primaryText: {
    color: "#f5f2e5",
  },
  secondaryText: {
    color: "#333333",
  },
  dangerText: {
    color: "#FFFFFF",
  },
});

export default CustomButton;
