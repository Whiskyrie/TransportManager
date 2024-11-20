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

interface ResetPasswordScreenProps {
  onResetPassword: (email: string) => void;
  onNavigateToLogin: () => void;
}

const ResetPasswordScreen: React.FC<ResetPasswordScreenProps> = ({
  onResetPassword,
  onNavigateToLogin,
}) => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  const handleResetPassword = async () => {
    if (!email) {
      setError("Por favor, informe seu e-mail.");
      return;
    }
  
    try {
      await onResetPassword(email);
    } catch (err: any) {
      if (err && err.response && err.response.data) {
        console.error("Erro da API:", err.response.data);
        setError("Falha ao enviar o link de redefinição. Tente novamente.");
      } else {
        console.error("Erro inesperado:", err);
        setError("Falha ao enviar o link de redefinição. Tente novamente.");
      }
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

        <Text style={sharedStyles.title}>Redefinir Senha</Text>
        <Text style={sharedStyles.subtitle}>
          Insira seu e-mail para receber um link de redefinição.
        </Text>

        {error ? <Text style={sharedStyles.error}>{error}</Text> : null}

        <TextInput
          style={sharedStyles.input}
          placeholder="Email"
          placeholderTextColor={`${theme.colors.text}80`}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <TouchableOpacity
          style={sharedStyles.primaryButton}
          onPress={handleResetPassword}
        >
          <Text style={sharedStyles.primaryButtonText}>Enviar link de redefinição</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={onNavigateToLogin}>
          <Text style={sharedStyles.linkText}>
            Já tem uma conta?{" "}
            <Text style={sharedStyles.linkTextHighlight}>Entrar</Text>
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default ResetPasswordScreen;
