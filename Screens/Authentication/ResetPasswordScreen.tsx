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

interface ResetPasswordScreenProps {
  onNavigateToLogin: () => void;
  onResetPassword: (email: string) => Promise<void>;
  onNavigateBack: () => void;

}

const ResetPasswordScreen: React.FC<ResetPasswordScreenProps> = ({ onNavigateToLogin }) => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleResetPassword = async () => {
    if (!email) {
      setError("Por favor, informe seu e-mail.");
      return;
    }
  
    try {
      // Chama a função de envio de código de redefinição de senha
      await api.sendResetPasswordCode(email);
      setSuccessMessage("Código de redefinição enviado com sucesso. Verifique seu e-mail.");
      setError(""); // Limpa qualquer mensagem de erro anterior
    } catch (err: any) {
      if (err && err.response && err.response.data) {
        console.error("Erro da API:", err.response.data);
        setError("Falha ao enviar o código de redefinição. Tente novamente.");
      } else {
        console.error("Erro inesperado:", err);
        setError("Falha ao enviar o código de redefinição. Tente novamente.");
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
          Insira seu e-mail para receber um código de redefinição.
        </Text>

        {error ? <Text style={sharedStyles.error}>{error}</Text> : null}
        {successMessage ? <Text style={[sharedStyles.success, { marginBottom: theme.spacing.m }]}>{successMessage}</Text> : null}

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
          <Text style={sharedStyles.primaryButtonText}>Enviar código de redefinição</Text>
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
