import React, { useState, useEffect } from "react";
import {
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { ValidationList } from "Components/ValidationList/ValidationList";
import { useValidation } from "../../Hooks/useValidation";
import { theme, sharedStyles } from "./style";

interface LoginScreenProps {
  onLogin: (email: string, password: string) => void;
  onNavigateToRegister: () => void;
  onNavigateToResetPassword: () => void;
}

const LoginScreen: React.FC<LoginScreenProps> = ({
  onLogin,
  onNavigateToRegister,
  onNavigateToResetPassword,
}) => {
  // Estados
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [attemptCount, setAttemptCount] = useState(0);
  const [focusedField, setFocusedField] = useState<string>("");
  const [touchedFields, setTouchedFields] = useState({
    email: false,
    password: false,
  });

  // Hooks
  const {
    emailValidations,
    passwordValidations,
    validateEmail,
    validatePassword,
    isEmailValid,
    isPasswordValid,
  } = useValidation();

  // Effects
  useEffect(() => {
    validateEmail(formData.email);
  }, [formData.email]);

  useEffect(() => {
    validatePassword(formData.password);
  }, [formData.password]);

  // Handlers
  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

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

  const handleLogin = async () => {
    setError("");

    if (!isEmailValid() || !isPasswordValid()) {
      setError("Por favor, corrija os erros de validação");
      return;
    }

    try {
      await onLogin(formData.email, formData.password);
      setAttemptCount(0);
    } catch (err) {
      setAttemptCount((prev) => prev + 1);

      if (attemptCount >= 2) {
        setError("Muitas tentativas incorretas. Tente redefinir sua senha.");
        return;
      }

      setError(`Credenciais inválidas. Tentativa ${attemptCount + 1} de 3.`);
    }
  };

  // Componentes de renderização
  const renderHeader = () => (
    <>
      <Image
        source={require("../../assets/icon.png")}
        style={sharedStyles.logo}
        resizeMode="contain"
      />
      <Text style={sharedStyles.title}>Bem-vindo de volta!</Text>
      <Text style={sharedStyles.subtitle}>
        Entre com suas credenciais para continuar
      </Text>
      {error ? <Text style={sharedStyles.error}>{error}</Text> : null}
    </>
  );

  const renderInputs = () => (
    <>
      <TextInput
        style={sharedStyles.input}
        placeholder="Email"
        placeholderTextColor={`${theme.colors.text}80`}
        value={formData.email}
        onChangeText={(value) => handleInputChange("email", value)}
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
        value={formData.password}
        onChangeText={(value) => handleInputChange("password", value)}
        secureTextEntry
        onFocus={() => handleFieldFocus("password")}
        onBlur={() => handleFieldBlur("password")}
      />
      <ValidationList
        items={passwordValidations}
        isFieldFocused={focusedField === "password"}
        fieldTouched={touchedFields.password}
      />
    </>
  );

  const renderButtons = () => (
    <>
      <TouchableOpacity
        style={sharedStyles.primaryButton}
        onPress={handleLogin}
      >
        <Text style={sharedStyles.primaryButtonText}>Entrar</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={onNavigateToResetPassword}>
        <Text style={sharedStyles.linkText}>
          Esqueceu a senha?{" "}
          <Text style={sharedStyles.linkTextHighlight}>Clique aqui</Text>
        </Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={onNavigateToRegister}>
        <Text style={sharedStyles.linkText}>
          Não possui uma conta ainda?{" "}
          <Text style={sharedStyles.linkTextHighlight}>Registre-se</Text>
        </Text>
      </TouchableOpacity>
    </>
  );

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={sharedStyles.container}
    >
      <ScrollView contentContainerStyle={sharedStyles.content}>
        {renderHeader()}
        {renderInputs()}
        {renderButtons()}
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default LoginScreen;
