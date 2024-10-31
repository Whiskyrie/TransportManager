import { User } from "Types/authTypes";
import React, { useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Animated,
  ScrollView,
  Alert,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";

const { width } = Dimensions.get("window");

interface HomeScreenProps {
  onNavigate: (screen: string) => void;
  onLogout: () => Promise<void>;
  user: User;
}

const HomeScreen: React.FC<HomeScreenProps> = ({
  onNavigate,
  onLogout,
  user,
}) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 1.05,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  const handleLogoutPress = () => {
    Alert.alert(
      "Confirmar Logout",
      "Tem certeza que deseja sair da sua conta?",
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "Sim, sair",
          onPress: onLogout,
          style: "destructive",
        },
      ]
    );
  };

  const Card = ({
    icon,
    label,
    screen,
    description,
  }: {
    icon: string;
    label: string;
    screen: string;
    description: string;
  }) => (
    <Animated.View style={[styles.card, { transform: [{ scale: scaleAnim }] }]}>
      <TouchableOpacity
        style={styles.cardContent}
        onPress={() => onNavigate(screen)}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
      >
        <Icon name={icon} size={60} color="#a51912" />
        <Text style={styles.cardText}>{label}</Text>
        <Text style={styles.cardDescription}>{description}</Text>
      </TouchableOpacity>
    </Animated.View>
  );

  return (
    <View style={styles.mainContainer}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.profileButton}
            onPress={() => onNavigate("profile")}
          >
            <Icon name="person" size={30} color="#a51912" />
          </TouchableOpacity>
        </View>
        <Text style={styles.title}>Bem-vindo ao RubiRide!</Text>
        <Text style={styles.subtitle}>Escolha uma opção para começar:</Text>
        <View style={styles.cardsContainer}>
          <Card
            icon="directions"
            label="Rotas"
            screen="routeList"
            description="Planeje e visualize suas rotas de viagem"
          />
          <Card
            icon="directions-car"
            label="Veículos"
            screen="vehicleList"
            description="Verifique e gerencie seus veículos"
          />
          <Card
            icon="person"
            label="Motoristas"
            screen="driverList"
            description="Gerencie e monitore seus motoristas"
          />
        </View>
      </ScrollView>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogoutPress}>
        <Icon name="logout" size={24} color="#dc3545" />
        <Text style={styles.logoutText}>Sair da Conta</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: "#1a2b2b",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 12,
    backgroundColor: "#1e2525",
    borderBottomWidth: 1,
    borderRadius: 40,
    borderBottomColor: "#1a2b2b",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#f5f2e5",
  },
  profileButton: {
    padding: 8,
  },
  container: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    paddingBottom: 80,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#f5f2e5",
    marginBottom: 10,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 18,
    color: "#f5f2e5",
    opacity: 0.8,
    marginBottom: 20,
    textAlign: "center",
  },
  cardsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    flexWrap: "wrap",
  },
  card: {
    backgroundColor: "#1e2525",
    borderRadius: 12,
    padding: 20,
    justifyContent: "center",
    alignItems: "center",
    width: width * 0.8,
    margin: 10,
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 8,
    elevation: 5,
    borderWidth: 1,
    borderColor: "#1a2b2b",
  },
  cardContent: {
    alignItems: "center",
  },
  cardText: {
    fontSize: 16,
    color: "#f5f2e5",
    marginTop: 10,
    fontWeight: "bold",
  },
  cardDescription: {
    fontSize: 12,
    color: "#f5f2e5",
    opacity: 0.8,
    marginTop: 5,
    textAlign: "center",
  },
  logoutButton: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#1e2525",
    padding: 15,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderTopWidth: 1,
    borderTopColor: "#1a2b2b",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  logoutText: {
    fontSize: 16,
    color: "#ff4545",
    marginLeft: 8,
    fontWeight: "bold",
  },
});

export default HomeScreen;
