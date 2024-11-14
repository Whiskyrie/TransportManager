import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
} from "react-native";

interface ResetPasswordScreenProps {
  onResetPassword: (email: string) => void;
  onNavigateToLogin: () => void; // Função para navegar de volta ao login
}

const ResetPasswordScreen: React.FC<ResetPasswordScreenProps> = ({
  onResetPassword,
  onNavigateToLogin,
}) => {
  const [email, setEmail] = useState("");

  const handleResetPassword = () => {
    if (!email) {
      Alert.alert("Por favor, informe seu e-mail.");
      return;
    }

    onResetPassword(email);
  };

  return (
    <View>
      <Text>Redefinir Senha</Text>

      <TextInput
        placeholder="Digite seu e-mail"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <TouchableOpacity onPress={handleResetPassword}>
        <Text>Enviar link de redefinição</Text>
      </TouchableOpacity>

      {/* Link para voltar para a tela de Login */}
      <TouchableOpacity onPress={onNavigateToLogin}>
        <Text>Voltar para o Login</Text>
      </TouchableOpacity>
    </View>
  );
};

export default ResetPasswordScreen;
