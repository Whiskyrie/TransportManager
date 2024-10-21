import React, { useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Animated,
  ScrollView,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";

const { width } = Dimensions.get("window");

interface HomeScreenProps {
  onNavigate: (screen: string) => void;
}

const HomeScreen: React.FC<HomeScreenProps> = ({ onNavigate }) => {
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
        <Icon name={icon} size={60} color="#007bff" />
        <Text style={styles.cardText}>{label}</Text>
        <Text style={styles.cardDescription}>{description}</Text>
      </TouchableOpacity>
    </Animated.View>
  );

  return (
    <ScrollView contentContainerStyle={styles.container}>
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
          screen="vehicles"
          description="Verifique e gerencie seus veículos"
        />
        <Card
          icon="person"
          label="Motoristas"
          screen="drivers"
          description="Encontre e se conecte com motoristas"
        />
      </View>
      <TouchableOpacity style={styles.settingsButton}>
        <Icon name="settings" size={30} color="#007bff" />
        <Text style={styles.settingsText}>Configurações</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f8f9fa",
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 18,
    color: "#555",
    marginBottom: 20,
    textAlign: "center",
  },
  cardsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    flexWrap: "wrap",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    justifyContent: "center",
    alignItems: "center",
    width: width * 0.8,
    margin: 10,
    shadowColor: "#000",
    shadowOpacity: 0.125,
    shadowOffset: { width: 0, height: 2.225 },
    shadowRadius: 8,
    elevation: 8,
  },
  cardContent: {
    alignItems: "center",
  },
  cardText: {
    fontSize: 16,
    color: "#007bff",
    marginTop: 10,
    fontWeight: "bold",
  },
  cardDescription: {
    fontSize: 12,
    color: "#555",
    marginTop: 5,
    textAlign: "center",
  },
  settingsButton: {
    position: "absolute",
    bottom: 30,
    flexDirection: "row",
    alignItems: "center",
  },
  settingsText: {
    fontSize: 16,
    color: "#007bff",
    marginLeft: 5,
    fontWeight: "bold",
  },
});

export default HomeScreen;
