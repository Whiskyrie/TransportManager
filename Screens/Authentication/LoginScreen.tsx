import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { ValidationList } from "Components/ValidationList/ValidationList";
import { useValidation } from "../../Hooks/useValidation";
import { theme, sharedStyles } from "./style";

interface LoginScreenProps {
  onLogin: (email: string, password: string) => void;
  onNavigateToRegister: () => void;
  onNavigateToResetPassword: () => void; // Função para navegação para redefinir senha
}

const LoginScreen: React.FC<LoginScreenProps> = ({
  onLogin,
  onNavigateToRegister,
  onNavigateToResetPassword, // Recebe a função de navegação
}) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [attemptCount, setAttemptCount] = useState(0);

  // Adicionar estados de controle
  const [focusedField, setFocusedField] = useState<string>("");
  const [touchedFields, setTouchedFields] = useState({
    email: false,
    password: false,
  });

  const handleFieldFocus = (fieldName: string) => {
    setFocusedField(fieldName);
  };

  const handleFieldBlur = (fieldName: string) => {
    setFocusedField("");
    setTouchedFields((prev) => ({
      ...prev,
      [fieldName]: true,
    }));
  };

  const {
    emailValidations,
    passwordValidations,
    validateEmail,
    validatePassword,
    isEmailValid,
    isPasswordValid,
  } = useValidation();

  useEffect(() => {
    validateEmail(email);
  }, [email]);

  useEffect(() => {
    validatePassword(password);
  }, [password]);

  const handleLogin = async () => {
    setError("");

    if (!isEmailValid() || !isPasswordValid()) {
      setError("Por favor, corrija os erros de validação");
      return;
    }

    try {
      await onLogin(email, password);
      setAttemptCount(0); // Reseta as tentativas em caso de sucesso
    } catch (err) {
      setAttemptCount((prev) => prev + 1);

      if (attemptCount >= 2) {
        setError("Muitas tentativas incorretas. Tente redefinir sua senha.");
        return;
      }

      setError(`Credenciais inválidas. Tentativa ${attemptCount + 1} de 3.`);
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
          onFocus={() => handleFieldFocus("email")}
          onBlur={() => handleFieldBlur("email")}
        />
        <ValidationList
          items={emailValidations}
          isFieldFocused={focusedField === "email"}
          fieldTouched={touchedFields.email}
        />

        <TextInput
          style={sharedStyles.input}
          placeholder="Senha"
          placeholderTextColor={`${theme.colors.text}80`}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          onFocus={() => handleFieldFocus("password")}
          onBlur={() => handleFieldBlur("password")}
        />
        <ValidationList
          items={passwordValidations}
          isFieldFocused={focusedField === "password"}
          fieldTouched={touchedFields.password}
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
