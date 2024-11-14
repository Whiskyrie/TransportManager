import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { theme, sharedStyles } from "./style";

interface LoginScreenProps {
  onLogin: (email: string, password: string) => void;
  onNavigateToRegister: () => void;
  onNavigateToResetPassword: () => void;  // Função para navegação para redefinir senha
}

const LoginScreen: React.FC<LoginScreenProps> = ({
  onLogin,
  onNavigateToRegister,
  onNavigateToResetPassword,  // Recebe a função de navegação
}) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async () => {
    if (!email || !password) {
      setError("Por favor, preencha todos os campos");
      return;
    }

    try {
      onLogin(email, password);
    } catch (err) {
      setError("Credenciais inválidas");
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={sharedStyles.container}
    >
      <View style={sharedStyles.content}>
        <Image
          source={require("../../Assets/icon.png")}
          style={sharedStyles.logo}
          resizeMode="contain"
        />
        <Text style={sharedStyles.title}>Bem-vindo de volta!</Text>
        <Text style={sharedStyles.subtitle}>
          Entre com suas credenciais para continuar
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

        <TextInput
          style={sharedStyles.input}
          placeholder="Senha"
          placeholderTextColor={`${theme.colors.text}80`}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <TouchableOpacity
          style={sharedStyles.primaryButton}
          onPress={handleLogin}
        >
          <Text style={sharedStyles.primaryButtonText}>Entrar</Text>
        </TouchableOpacity>

        {/* Link para "Esqueceu a senha?" */}
        <TouchableOpacity onPress={onNavigateToResetPassword}>
          <Text style={sharedStyles.linkText}>
            Esqueceu a senha?{" "}
            <Text style={sharedStyles.linkTextHighlight}>Clique aqui</Text>
          </Text>
        </TouchableOpacity>

        {/* Link para a página de registro */}
        <TouchableOpacity onPress={onNavigateToRegister}>
          <Text style={sharedStyles.linkText}>
            Não possui uma conta ainda?{" "}
            <Text style={sharedStyles.linkTextHighlight}>Registre-se</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

export default LoginScreen;
