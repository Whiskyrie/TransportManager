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
import { api } from "Services/api"; // Corrija o caminho de importação de acordo com a estrutura do seu projeto

interface VerifyCodeScreenProps {
  email: string;
  onNavigateToNewPassword: () => void; // Função para navegar para a tela de nova senha
  onNavigateBack: () => void;

}

const VerifyCodeScreen: React.FC<VerifyCodeScreenProps> = ({ email, onNavigateToNewPassword }) => {
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleVerifyCode = async () => {
    if (!code) {
      setError("Por favor, informe o código de verificação.");
      return;
    }

    try {
      // Chama a API para verificar o código
      await api.verifyResetPasswordCode({ email, code });
      setSuccessMessage("Código verificado com sucesso.");
      setError(""); // Limpa qualquer mensagem de erro anterior

      // Navega para a tela de redefinição de senha
      onNavigateToNewPassword();
    } catch (err: any) {
      if (err && err.response && err.response.data) {
        console.error("Erro da API:", err.response.data);
        setError("Código inválido ou expirado. Tente novamente.");
      } else {
        console.error("Erro inesperado:", err);
        setError("Falha na verificação do código. Tente novamente.");
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

        <Text style={sharedStyles.title}>Verificar Código</Text>
        <Text style={sharedStyles.subtitle}>
          Insira o código de verificação enviado para seu e-mail.
        </Text>

        {error ? <Text style={sharedStyles.error}>{error}</Text> : null}
        {successMessage ? <Text style={[sharedStyles.success, { marginBottom: theme.spacing.m }]}>{successMessage}</Text> : null}

        <TextInput
          style={sharedStyles.input}
          placeholder="Código de verificação"
          placeholderTextColor={`${theme.colors.text}80`}
          value={code}
          onChangeText={setCode}
          keyboardType="numeric"
        />

        <TouchableOpacity
          style={sharedStyles.primaryButton}
          onPress={handleVerifyCode}
        >
          <Text style={sharedStyles.primaryButtonText}>Verificar Código</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default VerifyCodeScreen;
