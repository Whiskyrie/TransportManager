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
}

const LoginScreen: React.FC<LoginScreenProps> = ({
  onLogin,
  onNavigateToRegister,
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
      await onLogin(email, password);
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
          source={require("/Users/evand/OneDrive/Documentos/TransportManager/TransportManager/Assets/icon.png")}
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
