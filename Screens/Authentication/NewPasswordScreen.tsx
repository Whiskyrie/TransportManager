import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";

import { theme, sharedStyles } from "./style";

interface NewPasswordScreenProps {
  resetToken: string | null;
  onSetNewPassword: (newPassword: string, confirmPassword: string) => Promise<void>;
  onNavigateToLogin: () => void;
}

const NewPasswordScreen: React.FC<NewPasswordScreenProps> = ({
  onSetNewPassword,
  onNavigateToLogin,
}) => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const handleSetNewPassword = async () => {
    if (!newPassword || !confirmPassword) {
      setError("Por favor, preencha todos os campos.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("As senhas não coincidem.");
      return;
    }

    try {
      await onSetNewPassword(newPassword, confirmPassword);
      onNavigateToLogin(); // Navegar de volta ao login após o sucesso
    } catch (err: any) {
      console.error("Erro ao redefinir senha:", err);
      setError("Falha ao redefinir a senha. Tente novamente.");
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={sharedStyles.container}
    >
      <ScrollView
        contentContainerStyle={[sharedStyles.content, { paddingVertical: 40 }]}
        showsVerticalScrollIndicator={false}
      >
        <Image
          source={require("../../Assets/icon.png")}
          style={[sharedStyles.logo, { marginTop: theme.spacing.xl }]}
          resizeMode="contain"
        />

        <Text style={sharedStyles.title}>Definir Nova Senha</Text>
        <Text style={sharedStyles.subtitle}>
          Insira sua nova senha para redefinir o acesso.
        </Text>

        {error ? <Text style={sharedStyles.error}>{error}</Text> : null}

        <TextInput
          style={sharedStyles.input}
          placeholder="Nova senha"
          placeholderTextColor={`${theme.colors.text}80`}
          secureTextEntry
          value={newPassword}
          onChangeText={setNewPassword}
        />

        <TextInput
          style={sharedStyles.input}
          placeholder="Confirmar nova senha"
          placeholderTextColor={`${theme.colors.text}80`}
          secureTextEntry
          value={confirmPassword}
          onChangeText={setConfirmPassword}
        />

        <TouchableOpacity
          style={sharedStyles.primaryButton}
          onPress={handleSetNewPassword}
        >
          <Text style={sharedStyles.primaryButtonText}>Redefinir senha</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={onNavigateToLogin}>
          <Text style={sharedStyles.linkText}>
            Lembrei minha senha?{" "}
            <Text style={sharedStyles.linkTextHighlight}>Entrar</Text>
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default NewPasswordScreen;
