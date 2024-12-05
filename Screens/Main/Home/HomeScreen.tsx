import { User } from "Types/authTypes";
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  Image,
  ActivityIndicator,
  Modal,
  Button,
} from "react-native";
import { styles } from "./HomeScreenStyle";
import Icon from "react-native-vector-icons/MaterialIcons";
import { Route, RouteLocation } from "Types/routeTypes";
import { api, handleApiError } from "Services/api";

interface HomeScreenProps {
  onNavigate: (screen: string) => void;
  onLogout: () => Promise<void>;
  user: User;
}

const formatRoutes = (routes: Route[]): Route[] => {
  return routes.map((route): Route => {
    let startLocation: RouteLocation = { address: "" };
    let endLocation: RouteLocation = { address: "" };

    if (!route.id) {
      console.warn("Rota inválida encontrada:", route);
      return route;
    }

    if (typeof route.startLocation === "string") {
      try {
        startLocation = JSON.parse(route.startLocation);
      } catch (e) {
        startLocation = {
          address: route.startLocation,
        };
      }
    } else if (route.startLocation && typeof route.startLocation === "object") {
      startLocation = {
        address: route.startLocation.address || "",
      };
    }

    if (typeof route.endLocation === "string") {
      try {
        endLocation = JSON.parse(route.endLocation);
      } catch (e) {
        endLocation = { address: route.endLocation };
      }
    } else if (route.endLocation && typeof route.endLocation === "object") {
      endLocation = {
        address: route.endLocation.address || "",
      };
    }

    return {
      ...route,
      id: route.id,
      distance: route.distance || 0,
      estimatedDuration: route.estimatedDuration || 0,
      status: route.status || "Pendente",
      startLocation: startLocation,
      endLocation: endLocation,
    };
  });
};

const HomeScreen: React.FC<HomeScreenProps> = ({
  onNavigate,
  onLogout,
  user,
}) => {
  const [isModalVisible, setIsModalVisible] = useState(false); // Controle do Modal
  const [recentRoutes, setRecentRoutes] = useState<Route[]>([]);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (!user) {
      onLogout();
      return;
    }
    fetchRecentRoutes();
  }, [user]);

  const fetchRecentRoutes = async () => {
    try {
      const response = await api.getAllRoutes();
      const formattedRoutes = Array.isArray(response.data)
        ? formatRoutes(response.data)
        : [];
      setRecentRoutes(formattedRoutes.slice(0, 3));
      setErrorMessage("");
    } catch (error) {
      const errorMsg = handleApiError(error);
      setErrorMessage(errorMsg);
      setRecentRoutes([]);
    }
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
          onPress: () => {
            // Removed async/await since onLogout handles everything
            onLogout().catch((error) => {
              // We don't need to show any error since logout will happen anyway
              console.warn("Erro não crítico durante logout:", error);
            });
          },
          style: "destructive",
        },
      ]
    );
  };

  const ProfilePhoto = () => {
    const imageUrl = user.profilePicture
      ? api.getProfilePictureUrl(user.profilePicture)
      : null;

    return (
      <TouchableOpacity
        style={styles.profilePhotoContainer}
        onPress={() => onNavigate("profile")}
      >
        {imageUrl ? (
          <Image
            source={{ uri: imageUrl, cache: "reload" }}
            style={styles.profilePhoto}
            resizeMode="cover"
          />
        ) : (
          <View style={styles.profilePhotoPlaceholder}>
            <Icon name="person" size={20} color="#f5f2e5" />
          </View>
        )}
      </TouchableOpacity>
    );
  };

  const MenuItem = ({
    icon,
    label,
    onPress,
  }: {
    icon: string;
    label: string;
    onPress: () => void;
  }) => (
    <TouchableOpacity style={styles.menuItem} onPress={onPress}>
      <View style={styles.menuIconContainer}>
        <Icon name={icon} size={32} color="#f5f2e5" />
      </View>
      <Text style={styles.menuLabel}>{label}</Text>
    </TouchableOpacity>
  );

  const RouteItem = ({ route }: { route: Route }) => {
    const getStatusColor = (status: string) => {
      switch (status) {
        case "Em Progresso":
          return "#e66c25";
        case "Pendente":
          return "#2d7ad2";
        case "Concluído":
          return "#19aa0c";
        case "Cancelada":
          return "#ca0d0d";
        default:
          return "#6B7280";
      }
    };

    return (
      <TouchableOpacity
        style={styles.routeItem}
        onPress={() => onNavigate("routeList")}
      >
        <View style={styles.routeHeader}>
          <View style={styles.routeIconContainer}>
            <Icon name="route" size={24} color="#f5f2e5" />
          </View>
          <View style={styles.routeIdContainer}>
            <Text style={styles.routeId}>
              #{route.id.slice(0, 5).toUpperCase()}
            </Text>
          </View>
          <View
            style={[
              styles.statusBadge,
              { backgroundColor: getStatusColor(route.status) },
            ]}
          >
            <Text style={styles.statusText}>{route.status}</Text>
          </View>
        </View>

        <View style={styles.routeDetails}>
          <View style={styles.routePoint}>
            <Icon name="trip-origin" size={20} color="#a51912" />
            <Text style={styles.routeText}>
              {typeof route.startLocation === "object"
                ? route.startLocation.address
                : route.startLocation}
            </Text>
          </View>
          <View style={styles.routeConnector}>
            <View style={styles.connectorLine} />
          </View>
          <View style={styles.routePoint}>
            <Icon name="location-on" size={20} color="#a51912" />
            <Text style={styles.routeText}>
              {typeof route.endLocation === "object"
                ? route.endLocation.address
                : route.endLocation}
            </Text>
          </View>

          <View style={styles.routeInfo}>
            <View style={styles.infoItem}>
              <Icon name="person" size={16} color="#a51912" />
              <Text style={styles.infoText}>{route.driver?.name || "N/A"}</Text>
            </View>
            <View style={styles.infoItem}>
              <Icon name="local-shipping" size={16} color="#a51912" />
              <Text style={styles.infoText}>
                {route.vehicle?.model
                  ? `${route.vehicle.model} - ${route.vehicle.plate}`
                  : "N/A"}
              </Text>
            </View>
            {route.estimatedDuration && (
              <View style={styles.infoItem}>
                <Icon name="schedule" size={16} color="#a51912" />
                <Text style={styles.infoText}>
                  ETA: {Math.floor(route.estimatedDuration / 60)}h{" "}
                  {route.estimatedDuration % 60}m
                </Text>
              </View>
            )}
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
  {user ? (
    <>
      <View style={styles.topBar}>
        <View style={styles.userInfo}>
          <ProfilePhoto />
          <View style={styles.userTextContainer}>
            <Text style={styles.userName}>{user.name}</Text>
            <Text style={styles.userRole}>
              {user.isAdmin ? "Administrador" : "Usuário"}
            </Text>
          </View>
        </View>
      </View>

      <ScrollView style={styles.scrollView}>
        <View style={styles.menuGrid}>
          <MenuItem
            icon="directions"
            label="Rotas"
            onPress={() => onNavigate("routeList")}
          />
          <MenuItem
            icon="directions-car"
            label="Veículos"
            onPress={() => onNavigate("vehicleList")}
          />
          <MenuItem
            icon="person"
            label="Motoristas"
            onPress={() => onNavigate("driverList")}
          />
        </View>

        <View style={styles.recentSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Rotas Recentes</Text>
            <TouchableOpacity onPress={() => onNavigate("routeList")}>
              <Text style={styles.seeAllButton}>Ver Todas</Text>
            </TouchableOpacity>
          </View>

          {errorMessage ? (
            <Text style={styles.errorMessage}>{errorMessage}</Text>
          ) : (
            recentRoutes.map((route) => (
              <RouteItem key={route.id} route={route} />
            ))
          )}
        </View>
      </ScrollView>

      {/* Botões no rodapé */}
      <View style={styles.footer}>
        {/* Botão "Início" */}
        <TouchableOpacity
          style={styles.navButton}
          onPress={() => onNavigate("home")}
        >
          <Icon name="home" size={24} color="#fff" />
          <Text style={styles.navText}>Início</Text>
        </TouchableOpacity>

        {/* Botão "Sair" */}
        <TouchableOpacity
          style={styles.navButton}
          onPress={() => setIsModalVisible(true)}
        >
          <Icon name="logout" size={24} color="#fff" />
          <Text style={styles.navText}>Sair</Text>
        </TouchableOpacity>
      </View>

      {/* Modal de Confirmação */}
      <Modal
        visible={isModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Confirmar Logout</Text>
            <Text style={styles.modalMessage}>
              Você tem certeza que deseja sair?
            </Text>
            <View style={styles.modalButtons}>
              <Button
                title="Cancelar"
                onPress={() => setIsModalVisible(false)}
              />
              <Button
                title="Sair"
                onPress={() => {
                  setIsModalVisible(false);
                  onLogout();
                }}
              />
            </View>
          </View>
        </View>
      </Modal>
    </>
  ) : (
    <ActivityIndicator size="large" color="#000" />
  )}
</View>
);
};
export default HomeScreen;
