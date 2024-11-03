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
} from "react-native";
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

          <View style={styles.bottomNav}>
            <TouchableOpacity
              style={styles.navButton}
              onPress={() => onNavigate("home")}
            >
              <View style={styles.navIconContainer}>
                <Icon name="home" size={24} color="#f5f2e5" />
              </View>
              <Text style={styles.navText}>Início</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.navButton}
              onPress={handleLogoutPress}
            >
              <View style={styles.navIconContainer}>
                <Icon name="logout" size={24} color="#f5f2e5" />
              </View>
              <Text style={styles.navText}>Sair</Text>
            </TouchableOpacity>
          </View>
        </>
      ) : (
        // Add loading state or null state
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#a51912" />
        </View>
      )}
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1a2b2b",
  },
  scrollView: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    marginTop: 45,
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatarContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#1e2525",
    justifyContent: "center",
    alignItems: "center",
  },
  userTextContainer: {
    marginLeft: 12,
  },
  userName: {
    fontSize: 18,
    fontWeight: "condensed",
    color: "#f5f2e5",
  },
  userRole: {
    fontSize: 14,
    color: "#a51912",
    fontWeight: "semibold",
  },
  menuGrid: {
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 20,
  },
  menuItem: {
    alignItems: "center",
  },
  menuIconContainer: {
    width: 80,
    height: 80,
    backgroundColor: "#1e2525",
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  menuLabel: {
    color: "#f5f2e5",
    fontSize: 16,
    fontWeight: "500",
    marginTop: 4,
  },
  recentSection: {
    padding: 20,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#f5f2e5",
  },
  seeAllButton: {
    color: "#a51912",
    fontSize: 16,
    fontWeight: "500",
  },
  routeItem: {
    backgroundColor: "#1e2525",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 8.85,
  },
  routeHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  routeIconContainer: {
    width: 40,
    height: 40,
    backgroundColor: "#1a2b2b",
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  routeIdContainer: {
    flex: 1,
  },
  routeId: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#f5f2e5",
  },
  routeDate: {
    fontSize: 12,
    color: "#f5f2e5",
    opacity: 0.7,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  statusText: {
    color: "#f5f2e5",
    fontSize: 12,
    fontWeight: "bold",
  },
  routeDetails: {
    marginLeft: 8,
  },
  routePoint: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 4,
  },
  routeText: {
    color: "#f5f2e5",
    fontSize: 14,
    marginLeft: 12,
    flex: 1,
  },
  routeConnector: {
    marginLeft: 10,
    height: 20,
    justifyContent: "center",
  },
  connectorLine: {
    width: 2,
    height: "100%",
    backgroundColor: "#a51912",
    marginLeft: 8,
  },
  bottomNav: {
    flexDirection: "row",
    backgroundColor: "#1e2525",
    paddingVertical: 12,
    paddingHorizontal: 30,
    justifyContent: "space-between",
    borderTopWidth: 1,
    borderTopColor: "rgba(165, 25, 18, 0.3)",
  },
  bottomNavItem: {
    alignItems: "center",
    flex: 1,
  },
  bottomNavText: {
    color: "#f5f2e5",
    fontSize: 12,
    marginTop: 4,
  },
  bottomNavTextActive: {
    color: "#a51912",
    fontWeight: "bold",
  },
  bottomNavItemActive: {
    borderBottomWidth: 0.225,
    borderColor: "#a51912",
  },
  routeInfo: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "rgba(245, 242, 229, 0.1)",
  },
  infoItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  infoText: {
    color: "#f5f2e5",
    fontSize: 12,
    marginLeft: 8,
    opacity: 0.9,
  },
  errorMessage: {
    color: "#5d0000",
    textAlign: "center",
    marginVertical: 10,
  },

  topBar: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
    backgroundColor: "#1e2525",
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  profilePhotoContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    overflow: "hidden",
    backgroundColor: "#182727",
  },
  profilePhoto: {
    width: "100%",
    height: "100%",
  },
  profilePhotoPlaceholder: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#182727",
  },
  navButton: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
  },
  navIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#182727",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 4,
    borderWidth: 1,
    borderColor: "rgba(165, 25, 18, 0.3)",
  },
  navText: {
    color: "#f5f2e5",
    fontSize: 12,
    marginTop: 4,
    fontWeight: "500",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#1a2b2b",
  },
});

export default HomeScreen;
