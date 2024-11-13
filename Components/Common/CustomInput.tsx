import React from "react";
import { View, TextInput, Text, StyleSheet } from "react-native";

interface CustomInputProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  placeholderTextColor?: string;
  secureTextEntry?: boolean;
  error?: string;
  style?: any;
  labelStyle?: any;
}

const CustomInput: React.FC<CustomInputProps> = ({
  label,
  value,
  onChangeText,
  placeholder,
  placeholderTextColor = "#b4b4b4",
  secureTextEntry,
  error,
  style,
  labelStyle,
}) => {
  return (
    <View style={styles.container}>
      <Text style={[styles.label, labelStyle]}>{label}</Text>
      <TextInput
        style={[styles.input, error ? styles.inputError : null, style]}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={placeholderTextColor}
        secureTextEntry={secureTextEntry}
      />
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    fontWeight: "bold",
    color: "#f5f2e5",
  },
  input: {
    borderWidth: 1,
    borderColor: "#1a2b2b",
    borderRadius: 5,
    padding: 10,
    fontSize: 16,
    backgroundColor: "#1a2b2b",
    color: "#f5f2e5",
  },
  inputError: {
    borderColor: "#FF3B30",
  },
  errorText: {
    color: "#FF3B30",
    fontSize: 14,
    marginTop: 5,
  },
});

export default CustomInput;
