import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Linking,
} from 'react-native';
import { theme, sharedStyles } from './style';

interface NewPasswordScreenProps {
  onSetNewPassword: (newPassword: string, confirmPassword: string) => Promise<void>;
  onNavigateToLogin: () => void;

  code: string;
}

const NewPasswordScreen: React.FC<NewPasswordScreenProps> = ({ onSetNewPassword, onNavigateToLogin }) => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isTokenValid, setIsTokenValid] = useState(false);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const getTokenFromURL = async () => {
      const url = await Linking.getInitialURL();
      if (url) {
        const tokenMatch = url.match(/token=([^&]+)/);
        if (tokenMatch) {
          setToken(tokenMatch[1]);
        }
      }
    };

    getTokenFromURL();
  }, []);

  useEffect(() => {
    if (token) {
      // Verifique a validade do token com uma chamada ao backend
      fetch(`/api/reset-password?token=${token}`)
        .then(response => {
          if (response.ok) {
            setIsTokenValid(true);
          } else {
            throw new Error('Token inválido ou expirado');
          }
        })
        .catch(error => {
          setError('Token inválido ou expirado');
        });
    }
  }, [token]);

  const handleSetNewPassword = async () => {
    if (!newPassword || !confirmPassword) {
      setError('Por favor, preencha todos os campos.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('As senhas não coincidem.');
      return;
    }

    try {
      await onSetNewPassword(newPassword, confirmPassword);
      onNavigateToLogin();
    } catch (err: any) {
      console.error('Erro ao redefinir senha:', err);
      setError('Falha ao redefinir a senha. Tente novamente.');
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={sharedStyles.container}>
      <ScrollView contentContainerStyle={[sharedStyles.content, { paddingVertical: 40 }]} showsVerticalScrollIndicator={false}>
        <Text style={sharedStyles.title}>Definir Nova Senha</Text>
        <Text style={sharedStyles.subtitle}>Insira sua nova senha para redefinir o acesso.</Text>

        {error ? <Text style={sharedStyles.error}>{error}</Text> : null}

        {isTokenValid ? (
          <>
            <TextInput
              style={sharedStyles.input}
              placeholder="Nova senha"
              placeholderTextColor={`${theme.colors.text}80`}
              secureTextEntry
              value={newPassword}
              onChangeText={setNewPassword}
            />
            <TextInput
              style={sharedStyles.input}
              placeholder="Confirmar nova senha"
              placeholderTextColor={`${theme.colors.text}80`}
              secureTextEntry
              value={confirmPassword}
              onChangeText={setConfirmPassword}
            />
            <TouchableOpacity style={sharedStyles.primaryButton} onPress={handleSetNewPassword}>
              <Text style={sharedStyles.primaryButtonText}>Redefinir senha</Text>
            </TouchableOpacity>
          </>
        ) : (
          <Text>Verificando token...</Text>
        )}

        <TouchableOpacity onPress={onNavigateToLogin}>
          <Text style={sharedStyles.linkText}>
            Lembrei minha senha? <Text style={sharedStyles.linkTextHighlight}>Entrar</Text>
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default NewPasswordScreen;
