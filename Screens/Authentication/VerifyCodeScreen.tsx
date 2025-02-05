import React, { useEffect, useState, useRef } from "react";
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
import AsyncStorage from "@react-native-async-storage/async-storage";
import { theme, sharedStyles } from "./style"; // Ajuste para combinar com a aparência compartilhada

interface VerifyCodeScreenProps { 
  onCodeVerified: () => void; // Navega para a tela de nova senha
  onNavigateBack: () => void; // Volta para a tela anterior
}

const VerifyCodeScreen: React.FC<VerifyCodeScreenProps> = ({
  onCodeVerified,
  onNavigateBack,
}) => {
  const [inputCode, setInputCode] = useState<string[]>(new Array(6).fill("")); // Supondo que o código tenha 6 dígitos
  const [error, setError] = useState("");
  const [resetCode, setResetCode] = useState<string | null>(null);
  const inputRefs = useRef<TextInput[]>([]);

  useEffect(() => {
    // Recupera o código armazenado do AsyncStorage quando a tela é carregada
    const fetchResetCode = async () => {
      try {
        const storedCode = await AsyncStorage.getItem('resetCode');
        if (storedCode) {
          console.log("Código recuperado do AsyncStorage:", storedCode);
          setResetCode(storedCode); // Atualiza o estado com o código recuperado
        } else {
          console.log("Nenhum código encontrado no AsyncStorage");
        }
      } catch (error) {
        console.error("Erro ao buscar o código de redefinição:", error);
      }
    };
    fetchResetCode();
  }, []);
  
  const handleInputChange = (text: string, index: number) => {
    // Limita o input para apenas números e 1 caractere
    const sanitizedText = text.replace(/[^0-9]/g, "").slice(0, 1);
    setInputCode((prevInputCode) => {
      const newInputCode = [...prevInputCode];
      newInputCode[index] = sanitizedText;
      return newInputCode;
    });

    // Foca na próxima caixa de entrada se o caractere foi inserido
    if (sanitizedText && index < inputRefs.current.length - 1) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleVerifyCode = () => {
    if (!resetCode) {
      setError("Erro interno: código de redefinição não encontrado.");
      return;
    }
    const fullCode = inputCode.join("").trim();
    console.log("Código digitado:", fullCode);
    console.log("Código esperado:", resetCode);

    if (fullCode.length !== 6) {
      setError("O código deve ter 6 dígitos.");
      return;
    }
    if (fullCode === String(resetCode).trim()) {
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
              ref={(ref) => (inputRefs.current[index] = ref!)}
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