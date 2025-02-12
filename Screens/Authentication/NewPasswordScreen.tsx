import React, { useState } from "react";
import {
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { sharedStyles } from "./style";

interface NewPasswordScreenProps {
  onSetNewPassword: (email: string, newPassword: string) => Promise<void>;
  onNavigateToLogin: () => void;
  email: string; // Email fornecido como prop
}

const NewPasswordScreen: React.FC<NewPasswordScreenProps> = ({
  onSetNewPassword,
  onNavigateToLogin,
  email,
}) => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSetNewPassword = async () => {
    // Validações de entrada
    if (!newPassword || !confirmPassword) {
      setError("Por favor, preencha todos os campos.");
      return;
    }

    if (newPassword.length < 6) {
      setError("A senha deve ter pelo menos 6 caracteres.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("As senhas não coincidem.");
      return;
    }

    try {
      setIsLoading(true);
      setError("");
      console.log(
        `Chamando onSetNewPassword com email: ${email} e newPassword: ${newPassword}`
      );
      // Chamada à função passada por props
      await onSetNewPassword(email, newPassword);
      onNavigateToLogin(); // Navegar para a tela de login após redefinir
    } catch (err: any) {
      console.error("Erro ao redefinir senha:", err);

      // Mensagem de erro baseada no status do erro
      if (err.response?.status === 401) {
        setError("Email não encontrado ou inválido.");
      } else {
        setError("Falha ao redefinir a senha. Tente novamente.");
      }
    } finally {
      setIsLoading(false);
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
        <Text style={sharedStyles.title}>Definir Nova Senha</Text>
        <Text style={sharedStyles.subtitle}>
          Insira sua nova senha para redefinir o acesso.
        </Text>
        {error && <Text style={{ color: "red" }}>{error}</Text>}
        <TextInput
          style={sharedStyles.input}
          placeholder="Nova Senha"
          secureTextEntry
          value={newPassword}
          onChangeText={setNewPassword}
        />
        <TextInput
          style={sharedStyles.input}
          placeholder="Confirmar Nova Senha"
          secureTextEntry
          value={confirmPassword}
          onChangeText={setConfirmPassword}
        />

        {/* Botão para redefinir senha */}
        <TouchableOpacity
          style={sharedStyles.primaryButton}
          onPress={handleSetNewPassword}
          disabled={isLoading}
        >
          <Text style={sharedStyles.primaryButtonText}>
            {isLoading ? "Redefinindo..." : "Redefinir senha"}
          </Text>
        </TouchableOpacity>

        {/* Link para tela de login */}
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
