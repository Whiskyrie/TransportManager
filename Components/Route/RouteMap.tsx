import React, { useEffect, useState } from "react";
import MapView, { Marker } from "react-native-maps";
import { View, StyleSheet } from "react-native";
import Geocoder from "react-native-geocoding";
import { Route } from "./Types";

Geocoder.init("AIzaSyA-J5q8YkcWsf3JEXnLSOQgebAlBVAJjPc");

interface RouteMapProps {
  routes: Route[];
}

const RouteMap: React.FC<RouteMapProps> = ({ routes }) => {
  const [coordinates, setCoordinates] = useState<
    {
      start: { latitude: number; longitude: number };
      end: { latitude: number; longitude: number };
    }[]
  >([]);

  useEffect(() => {
    const fetchCoordinates = async () => {
      const coords = await Promise.all(
        routes.map(async (route) => {
          const startCoords = await Geocoder.from(route.startLocation.name);
          const endCoords = await Geocoder.from(route.endLocation.name);
          return {
            start: {
              latitude: startCoords.results[0].geometry.location.lat,
              longitude: startCoords.results[0].geometry.location.lng,
            },
            end: {
              latitude: endCoords.results[0].geometry.location.lat,
              longitude: endCoords.results[0].geometry.location.lng,
            },
          };
        })
      );
      setCoordinates(coords);
    };

    fetchCoordinates();
  }, [routes]);

  const initialRegion = {
    latitude: coordinates.length > 0 ? coordinates[0].start.latitude : 0,
    longitude: coordinates.length > 0 ? coordinates[0].start.longitude : 0,
    latitudeDelta: 0.1,
    longitudeDelta: 0.1,
  };

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={
          initialRegion.latitude !== 0 && initialRegion.longitude !== 0
            ? initialRegion
            : undefined
        }
      >
        {coordinates.map((coord, index) => (
          <Marker
            key={`start-${index}`}
            coordinate={coord.start}
            title={`Início: ${routes[index].startLocation.name}`}
            description={routes[index].startLocation.address}
          />
        ))}
      </MapView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 250,
    borderRadius: 15,
    overflow: "hidden",
    marginVertical: 10,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
});

export default RouteMap;
