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
  Animated,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { theme, sharedStyles } from "./style"; // Ajuste para combinar com a aparência compartilhada
import BackButton from "../../Components/Common/BackButton";

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
  const [focusedIndex, setFocusedIndex] = useState<number>(-1);
  const inputRefs = useRef<TextInput[]>([]);
  const [scaleAnimations] = useState(() =>
    Array(6)
      .fill(0)
      .map(() => new Animated.Value(1))
  );
  const [shakeAnimation] = useState(new Animated.Value(0));

  useEffect(() => {
    // Recupera o código armazenado do AsyncStorage quando a tela é carregada
    const fetchResetCode = async () => {
      try {
        const storedCode = await AsyncStorage.getItem("resetCode");
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

  const animateInput = (index: number) => {
    Animated.spring(scaleAnimations[index], {
      toValue: 1.1,
      useNativeDriver: true,
      friction: 8,
      tension: 40,
    }).start();
  };

  const resetInputAnimation = (index: number) => {
    Animated.spring(scaleAnimations[index], {
      toValue: 1,
      useNativeDriver: true,
      friction: 8,
      tension: 40,
    }).start();
  };

  const shakeError = () => {
    shakeAnimation.setValue(0);
    Animated.sequence([
      Animated.timing(shakeAnimation, {
        toValue: 10,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnimation, {
        toValue: -10,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnimation, {
        toValue: 10,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnimation, {
        toValue: 0,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
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
      shakeError();
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
          Por favor, insira o código de 6 dígitos que enviamos para o seu
          e-mail.
        </Text>

        {error ? <Text style={sharedStyles.error}>{error}</Text> : null}

        <Animated.View
          style={[
            styles.codeContainer,
            {
              transform: [{ translateX: shakeAnimation }],
            },
          ]}
        >
          {inputCode.map((digit, index) => (
            <Animated.View
              key={index}
              style={[
                styles.codeInputContainer,
                {
                  transform: [{ scale: scaleAnimations[index] }],
                },
              ]}
            >
              <TextInput
                ref={(ref) => (inputRefs.current[index] = ref!)}
                style={[
                  styles.codeInput,
                  focusedIndex === index && styles.focusedCodeInput,
                ]}
                value={digit}
                onChangeText={(text) => handleInputChange(text, index)}
                onFocus={() => {
                  setFocusedIndex(index);
                  animateInput(index);
                }}
                onBlur={() => {
                  setFocusedIndex(-1);
                  resetInputAnimation(index);
                }}
                keyboardType="number-pad"
                maxLength={1}
                textAlign="center"
                autoFocus={index === 0}
              />
              {focusedIndex === index && <View style={styles.codeInputLine} />}
            </Animated.View>
          ))}
        </Animated.View>

        <TouchableOpacity
          style={sharedStyles.primaryButton}
          onPress={handleVerifyCode}
        >
          <Text style={sharedStyles.primaryButtonText}>Verificar Código</Text>
        </TouchableOpacity>

        <BackButton onPress={onNavigateBack} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  codeContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: theme.spacing.xl,
    width: "100%",
    paddingHorizontal: theme.spacing.m,
  },
  codeInputContainer: {
    position: "relative",
    margin: 4,
  },
  codeInput: {
    height: 60,
    width: 50,
    backgroundColor: theme.colors.contrast,
    borderWidth: 2,
    borderColor: theme.colors.inactive,
    borderRadius: 12,
    textAlign: "center",
    fontSize: 24,
    fontWeight: "bold",
    color: theme.colors.text,
    shadowColor: theme.colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  focusedCodeInput: {
    borderColor: theme.colors.primary,
    backgroundColor: `${theme.colors.primary}20`,
  },
  codeInputLine: {
    position: "absolute",
    bottom: -8,
    left: "50%",
    width: 20,
    height: 2,
    backgroundColor: theme.colors.primary,
    transform: [{ translateX: -10 }],
  },
});

export default VerifyCodeScreen;
