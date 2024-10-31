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

interface RegisterScreenProps {
  onRegister: (
    name: string,
    email: string,
    password: string,
    phoneNumber: string
  ) => void;
  onNavigateToLogin: () => void;
}

const RegisterScreen: React.FC<RegisterScreenProps> = ({
  onRegister,
  onNavigateToLogin,
}) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [error, setError] = useState("");

  const handleRegister = async () => {
    if (!name || !email || !password || !confirmPassword || !phoneNumber) {
      setError("Por favor, preencha todos os campos");
      return;
    }

    if (password !== confirmPassword) {
      setError("As senhas não coincidem");
      return;
    }

    try {
      await onRegister(name, email, password, phoneNumber);
    } catch (err) {
      setError("Falha no registro. Por favor, tente novamente.");
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
          source={require("/Users/evand/OneDrive/Documentos/TransportManager/TransportManager/Assets/icon.png")}
          style={[sharedStyles.logo, { marginTop: theme.spacing.xl }]}
          resizeMode="contain"
        />

        <Text style={sharedStyles.title}>Criar uma conta</Text>
        <Text style={sharedStyles.subtitle}>
          Preencha seus dados para começar
        </Text>

        {error ? <Text style={sharedStyles.error}>{error}</Text> : null}

        <TextInput
          style={sharedStyles.input}
          placeholder="Nome completo"
          placeholderTextColor={`${theme.colors.text}80`}
          value={name}
          onChangeText={setName}
          autoCapitalize="words"
        />

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
          placeholder="Telefone"
          placeholderTextColor={`${theme.colors.text}80`}
          value={phoneNumber}
          onChangeText={setPhoneNumber}
          keyboardType="phone-pad"
        />

        <TextInput
          style={sharedStyles.input}
          placeholder="Senha"
          placeholderTextColor={`${theme.colors.text}80`}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <TextInput
          style={sharedStyles.input}
          placeholder="Confirmar senha"
          placeholderTextColor={`${theme.colors.text}80`}
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
        />

        <TouchableOpacity
          style={sharedStyles.primaryButton}
          onPress={handleRegister}
        >
          <Text style={sharedStyles.primaryButtonText}>Registrar</Text>
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

export default RegisterScreen;
