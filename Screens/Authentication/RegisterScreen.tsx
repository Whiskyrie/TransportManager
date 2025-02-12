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

  const [focusedField, setFocusedField] = useState<string>("");
  const [touchedFields, setTouchedFields] = useState({
    name: false,
    email: false,
    phone: false,
    password: false,
    confirmPassword: false,
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
    nameValidations,
    phoneValidations,
    validateEmail,
    validatePassword,
    validateName,
    validatePhone,
    isEmailValid,
    isPasswordValid,
    isNameValid,
    isPhoneValid,
  } = useValidation();

  useEffect(() => {
    validateName(name);
  }, [name]);

  useEffect(() => {
    validateEmail(email);
  }, [email]);

  useEffect(() => {
    validatePassword(password);
  }, [password]);

  useEffect(() => {
    validatePhone(phoneNumber);
  }, [phoneNumber]);

  const formatPhoneNumber = (text: string) => {
    const cleaned = text.replace(/\D/g, "");
    let formatted = cleaned;
    if (cleaned.length >= 2) {
      formatted = `(${cleaned.slice(0, 2)}`;
      if (cleaned.length >= 7) {
        formatted += `) ${cleaned.slice(2, 7)}-${cleaned.slice(7, 11)}`;
      } else if (cleaned.length > 2) {
        formatted += `) ${cleaned.slice(2)}`;
      }
    }
    return formatted;
  };

  const handlePhoneNumberChange = (text: string) => {
    const formatted = formatPhoneNumber(text);
    setPhoneNumber(formatted);
  };

  const handleRegister = async () => {
    setError("");

    if (
      !isNameValid() ||
      !isEmailValid() ||
      !isPasswordValid() ||
      !isPhoneValid()
    ) {
      setError("Por favor, corrija os erros de validação");
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
          source={require("../../assets/icon.png")}
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
          value={name}
          onChangeText={setName}
          autoCapitalize="words"
          onFocus={() => handleFieldFocus("name")}
          onBlur={() => handleFieldBlur("name")}
        />
        <ValidationList
          items={nameValidations}
          isFieldFocused={focusedField === "name"}
          fieldTouched={touchedFields.name}
        />

        <TextInput
          style={sharedStyles.input}
          placeholder="Email"
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
          placeholder="Telefone"
          value={phoneNumber}
          onChangeText={handlePhoneNumberChange}
          keyboardType="phone-pad"
          onFocus={() => handleFieldFocus("phone")}
          onBlur={() => handleFieldBlur("phone")}
        />
        <ValidationList
          items={phoneValidations}
          isFieldFocused={focusedField === "phone"}
          fieldTouched={touchedFields.phone}
        />

        <TextInput
          style={sharedStyles.input}
          placeholder="Senha"
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

        <TextInput
          style={sharedStyles.input}
          placeholder="Confirmar senha"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
          onFocus={() => handleFieldFocus("confirmPassword")}
          onBlur={() => handleFieldBlur("confirmPassword")}
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
