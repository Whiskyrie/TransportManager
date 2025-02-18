import React, { useState } from "react";
import {
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  RefreshControl, // Adicione esta linha
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { theme, sharedStyles } from "./style"; // Ajuste para combinar com a aparência compartilhada
import BackButton from "../../Components/Common/BackButton"; // Importe o componente BackButton

interface ResetPasswordScreenProps {
  onNavigateToLogin: () => void;
  onResetPassword: (email: string) => Promise<{ code: string }>; // Função passada como prop
}

const ResetPasswordScreen: React.FC<ResetPasswordScreenProps> = ({
  onNavigateToLogin,
  onResetPassword,
}) => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [refreshing, setRefreshing] = useState(false);

  const handleResetPassword = async () => {
    if (!email) {
      setError("Por favor, informe seu e-mail.");
      return;
    }
    try {
      // Chama a função de redefinição passada como prop
      const response = await onResetPassword(email);
      await AsyncStorage.setItem("resetCode", response.code); // Salva o código de redefinição no armazenamento local
      setSuccessMessage(
        "Código de redefinição enviado com sucesso. Verifique seu e-mail."
      );
      setError(""); // Limpa qualquer mensagem de erro anterior
    } catch (err) {
      console.error("Erro inesperado:", err);
      setError("Falha ao enviar o código de redefinição. Tente novamente.");
      setSuccessMessage(""); // Limpa mensagens de sucesso anteriores
    }
  };

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    try {
      setEmail("");
      setError("");
      setSuccessMessage("");
    } finally {
      setRefreshing(false);
    }
  }, []);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={sharedStyles.container}
    >
      <ScrollView
        contentContainerStyle={[sharedStyles.content, { paddingVertical: 40 }]}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={["#a51912"]}
            tintColor="#a51912"
          />
        }
      >
        <Image
          source={require("../../assets/icon.png")}
          style={[sharedStyles.logo, { marginTop: theme.spacing.xl }]}
          resizeMode="contain"
        />

        <Text style={sharedStyles.title}>Redefinir Senha</Text>
        <Text style={sharedStyles.subtitle}>
          Insira seu e-mail para receber um código de redefinição.
        </Text>

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
          <Text style={sharedStyles.primaryButtonText}>Enviar Código</Text>
        </TouchableOpacity>

        {error ? <Text style={sharedStyles.error}>{error}</Text> : null}
        {successMessage ? (
          <Text style={sharedStyles.success}>{successMessage}</Text>
        ) : null}

        <BackButton onPress={onNavigateToLogin} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default ResetPasswordScreen;
