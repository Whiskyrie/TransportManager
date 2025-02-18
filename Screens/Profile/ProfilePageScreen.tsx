import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  RefreshControl,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import { User } from "Types/authTypes";
import { ProfilePhotoUpload } from "./ProfilePhotoUpload";
import { getImageUrl } from "Services/api";

interface ProfilePageScreenProps {
  onNavigate: (screen: string) => void;
  user: User;
  onUpdateUser: (updatedUser: User) => void;
}

const ProfilePageScreen: React.FC<ProfilePageScreenProps> = ({
  onNavigate,
  user,
  onUpdateUser,
}) => {
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      // Aqui você pode adicionar a lógica para recarregar os dados do usuário
      // Por exemplo:
      // const updatedUser = await api.getUserProfile();
      // onUpdateUser(updatedUser);
    } finally {
      setRefreshing(false);
    }
  }, []);

  const handlePhotoUpdate = (newPhotoUrl: string) => {
    onUpdateUser({ ...user, profilePicture: newPhotoUrl });
  };

  const handleBackPress = () => {
    onNavigate("home");
  };

  const formatPhoneNumber = (phone: string) => {
    if (!phone) return "Não informado";
    return phone.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3");
  };

  const getJoinDate = () => {
    if (!user.createdAt) return "Data não disponível";
    return new Date(user.createdAt).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  const getLastLogin = () => {
    if (!user.lastLogin) return "Nunca";
    return new Date(user.lastLogin).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const InfoItem = ({
    icon,
    label,
    value,
  }: {
    icon: string;
    label: string;
    value: string;
  }) => (
    <View style={styles.infoItem}>
      <Icon name={icon} size={24} color="#f5f2e5" style={styles.infoIcon} />
      <View style={styles.infoContent}>
        <Text style={styles.infoLabel}>{label}</Text>
        <Text style={styles.infoValue}>{value}</Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={handleBackPress}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Icon name="arrow-back" size={24} color="#f5f2e5" />
          <Text style={styles.backButtonText}>Voltar</Text>
        </TouchableOpacity>
      </View>
      <ScrollView
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={["#f5f2e5"]}
            tintColor="#f5f2e5"
            progressBackgroundColor="#182727"
          />
        }
      >
        <View style={styles.photoSection}>
          <ProfilePhotoUpload
            currentPhotoUrl={
              user.profilePicture ? getImageUrl(user.profilePicture) : null
            }
            onPhotoUpdate={handlePhotoUpdate}
          />
          <Text style={styles.userName}>{user.name}</Text>
          <Text style={styles.userRole}>
            {user.isAdmin ? "Administrador" : "Usuário"}
          </Text>
        </View>
        <View style={styles.infoSection}>
          <InfoItem icon="email" label="E-mail" value={user.email} />
          <InfoItem
            icon="phone"
            label="Telefone"
            value={formatPhoneNumber(user.phoneNumber)}
          />
          <InfoItem
            icon="calendar-today"
            label="Membro desde"
            value={getJoinDate()}
          />
          <InfoItem
            icon="access-time"
            label="Último acesso"
            value={getLastLogin()}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1a2b2b",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 8,
    marginTop: 45,
    backgroundColor: "#1a2b2b",
    borderBottomWidth: 1,
    borderBottomColor: "#1a2b2b",
    height: 60,
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  backButtonText: {
    fontSize: 18,
    color: "#f5f2e5",
    marginLeft: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#f5f2e5",
    marginLeft: 8,
  },
  content: {
    padding: 20,
  },
  photoSection: {
    alignItems: "center",
    marginBottom: 24,
  },
  userName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#f5f2e5",
    marginTop: 16,
  },
  userRole: {
    fontSize: 16,
    color: "#f5f2e5",
    opacity: 0.8,
    marginTop: 4,
  },
  infoSection: {
    backgroundColor: "#182727",
    borderRadius: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  infoItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#1a2b2b",
  },
  infoIcon: {
    marginRight: 16,
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 14,
    color: "#f5f2e5",
    opacity: 0.8,
  },
  infoValue: {
    fontSize: 16,
    color: "#f5f2e5",
    marginTop: 4,
  },
});

export default ProfilePageScreen;
