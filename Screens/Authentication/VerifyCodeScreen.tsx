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

import { theme, sharedStyles } from "./style"; // Ajuste para combinar com a aparência compartilhada

interface VerifyCodeScreenProps {
  resetCode: string | null; // Código recebido do servidor
  onCodeVerified: () => void; // Navega para a tela de nova senha
  onNavigateBack: () => void; // Volta para a tela anterior
}

const VerifyCodeScreen: React.FC<VerifyCodeScreenProps> = ({
  resetCode,
  onCodeVerified,
  onNavigateBack,
}) => {
  const [inputCode, setInputCode] = useState<string[]>(new Array(6).fill("")); // Supondo que o código tenha 6 dígitos
  const [error, setError] = useState("");

  const handleInputChange = (text: string, index: number) => {
    const newInputCode = [...inputCode];
    newInputCode[index] = text;
    setInputCode(newInputCode);

    // Avança para o próximo campo automaticamente se o usuário inserir um dígito
    if (text && index < inputCode.length - 1) {
      const nextInput = document.querySelector<HTMLInputElement>(`#input-${index + 1}`);
      if (nextInput) {
        nextInput.focus();
      }
    }
  };

  const handleVerifyCode = () => {
    const fullCode = inputCode.join("");
    if (fullCode === resetCode) {
      setError(""); // Limpa erros anteriores
      onCodeVerified(); // Navega para a próxima tela
    } else {
      setError("O código inserido está incorreto. Tente novamente.");
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
          Insira o código que você recebeu para confirmar sua identidade.
        </Text>

        {error ? <Text style={sharedStyles.error}>{error}</Text> : null}

        <View style={styles.codeContainer}>
          {inputCode.map((digit, index) => (
            <TextInput
              key={index}
              id={`input-${index}`}
              style={styles.codeInput}
              value={digit}
              onChangeText={(text) => handleInputChange(text, index)}
              keyboardType="number-pad"
              maxLength={1}
              textAlign="center"
              autoFocus={index === 0} // Foca no primeiro campo ao carregar a tela
            />
          ))}
        </View>

        <TouchableOpacity
          style={sharedStyles.primaryButton}
          onPress={handleVerifyCode}
        >
          <Text style={sharedStyles.primaryButtonText}>Verificar Código</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={onNavigateBack}>
          <Text style={sharedStyles.linkText}>
            {"<"} Voltar para a tela anterior
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  codeContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  codeInput: {
    height: 50,
    width: 50,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    textAlign: "center",
    fontSize: 24,
    marginHorizontal: 5,
  },
});

export default VerifyCodeScreen;
