import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  LayoutAnimation,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons"; // Adicione esta importação
import { theme } from "../../Screens/Authentication/style";

// Primeiro, defina o componente BackButton
const BackButton = ({ onPress }) => {
  const [isPressed, setIsPressed] = useState(false);

  const handlePressIn = () => {
    setIsPressed(true);
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
  };

  const handlePressOut = () => {
    setIsPressed(false);
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={[
        styles.backButtonContainer,
        isPressed && {
          transform: [{ scale: 0.97 }],
          backgroundColor: theme.colors.primary + "08",
        },
      ]}
      activeOpacity={0.8}
      accessibilityRole="button"
      accessibilityLabel="Voltar para a tela de login"
      accessibilityHint="Navega de volta para a tela de autenticação"
    >
      <View style={styles.backButtonContent}>
        <MaterialIcons
          name="arrow-back-ios"
          size={18}
          color={theme.colors.primary}
        />
        <Text style={styles.backButtonText}>Voltar para login</Text>
      </View>
    </TouchableOpacity>
  );
};

// Adicione os novos estilos
const styles = StyleSheet.create({
  backButtonContainer: {
    marginTop: theme.spacing.m,
    paddingVertical: 12,
    paddingHorizontal: 20,
    alignSelf: "center",
    backgroundColor: "rgba(49, 11, 11, 0.2)", // Versão mais suave do primary
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: theme.colors.primary,
    transform: [{ scale: 1 }],
  },
  backButtonContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
  backButtonText: {
    color: theme.colors.text, // #f5f2e5
    fontSize: 16,
    fontWeight: "600",
    letterSpacing: 0.3,
  },
});

export default BackButton;
