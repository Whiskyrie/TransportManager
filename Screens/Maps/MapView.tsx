import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Text,
  Platform,
  Linking,
} from "react-native";
import { Route } from "Types/routeTypes";
import Icon from "react-native-vector-icons/MaterialIcons";
import { GeocodingService } from "Services/geocodingService"; // Adjust the path as necessary

interface MapViewProps {
  routes: Route[];
  onMarkerPress?: (routeId: string) => void;
}

interface RouteWithCoordinates {
  id: string;
  startCoords?: { lat: number; lon: number };
  endCoords?: { lat: number; lon: number };
  status: string;
}

const MapView: React.FC<MapViewProps> = ({ routes, onMarkerPress }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [routeCoordinates, setRouteCoordinates] = useState<
    RouteWithCoordinates[]
  >([]);

  useEffect(() => {
    const getRoutesCoordinates = async () => {
      try {
        setLoading(true);
        setError(null);

        const coordsPromises = routes.map(async (route) => {
          const startAddress =
            typeof route.startLocation === "string"
              ? route.startLocation
              : route.startLocation.address;

          const endAddress =
            typeof route.endLocation === "string"
              ? route.endLocation
              : route.endLocation.address;

          try {
            const [startCoords, endCoords] = await Promise.all([
              GeocodingService.getCoordinates(startAddress),
              GeocodingService.getCoordinates(endAddress),
            ]);

            return {
              id: route.id,
              startCoords: startCoords
                ? { lat: startCoords.lat, lon: startCoords.lon }
                : undefined,
              endCoords: endCoords
                ? { lat: endCoords.lat, lon: endCoords.lon }
                : undefined,
              status: route.status,
            };
          } catch (error) {
            console.warn(
              `Failed to get coordinates for route ${route.id}:`,
              error
            );
            return {
              id: route.id,
              status: route.status,
            };
          }
        });

        const results = await Promise.all(coordsPromises);
        setRouteCoordinates(results);
      } catch (error) {
        console.error("Error fetching coordinates:", error);
        setError(
          "Não foi possível carregar o mapa. Toque para ver detalhes da rota."
        );
      } finally {
        setLoading(false);
      }
    };

    getRoutesCoordinates();
  }, [routes]);

  const handleRoutePress = (startAddress: string, endAddress: string) => {
    const url = Platform.select({
      ios: `maps://0,0?q=${endAddress}`,
      android: `geo:0,0?q=${endAddress}`,
    });

    if (url) {
      Linking.canOpenURL(url)
        .then((supported) => {
          if (supported) {
            return Linking.openURL(url);
          }
          // Fallback to Google Maps web URL
          return Linking.openURL(
            `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(
              startAddress
            )}&destination=${encodeURIComponent(endAddress)}`
          );
        })
        .catch((err) => console.error("Error opening maps:", err));
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#a51912" />
      </View>
    );
  }

  if (error || routeCoordinates.length === 0) {
    return (
      <View style={styles.container}>
        <View style={styles.fallbackContent}>
          <Icon name="map" size={32} color="#f5f2e5" />
          <Text style={styles.fallbackText}>
            {error || "Nenhuma rota disponível para exibição"}
          </Text>
          {routes.map((route) => (
            <TouchableOpacity
              key={route.id}
              style={styles.fallbackRoute}
              onPress={() => {
                const startAddr =
                  typeof route.startLocation === "string"
                    ? route.startLocation
                    : route.startLocation.address;
                const endAddr =
                  typeof route.endLocation === "string"
                    ? route.endLocation
                    : route.endLocation.address;
                handleRoutePress(startAddr, endAddr);
              }}
            >
              <View style={styles.fallbackRouteContent}>
                <Icon name="directions" size={24} color="#a51912" />
                <Text style={styles.fallbackRouteText}>
                  Ver rota no mapa externo
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    );
  }

  // Implementation for when map library is properly set up
  return (
    <View style={styles.container}>
      <Text style={styles.fallbackText}>
        Para implementar o mapa, siga as instruções de instalação em:
        https://rnmapbox.github.io/docs/install?rebuild=expo#rebuild
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 200,
    width: "100%",
    backgroundColor: "#1e2525",
    borderRadius: 16,
    marginBottom: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  fallbackContent: {
    padding: 16,
    alignItems: "center",
  },
  fallbackText: {
    color: "#f5f2e5",
    textAlign: "center",
    marginVertical: 8,
  },
  fallbackRoute: {
    backgroundColor: "#2d3333",
    padding: 12,
    borderRadius: 8,
    marginTop: 8,
    width: "100%",
  },
  fallbackRouteContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  fallbackRouteText: {
    color: "#f5f2e5",
    marginLeft: 8,
  },
});

export default MapView;
