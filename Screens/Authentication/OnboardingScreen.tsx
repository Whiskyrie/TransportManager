import React, { useState, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import {
  PanGestureHandler,
  State,
  GestureHandlerRootView,
} from "react-native-gesture-handler";

const { width } = Dimensions.get("window");

interface OnboardingSlideProps {
  title: string;
  description: string;
  icon: string;
}

const OnboardingSlide: React.FC<OnboardingSlideProps> = ({
  title,
  description,
  icon,
}) => (
  <View style={styles.slideContainer}>
    <Icon name={icon} size={80} color="#007bff" style={styles.icon} />
    <Text style={styles.slideTitle}>{title}</Text>
    <Text style={styles.slideDescription}>{description}</Text>
  </View>
);

interface OnboardingScreenProps {
  onFinish: () => void;
}

const OnboardingScreen: React.FC<OnboardingScreenProps> = ({ onFinish }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const panRef = useRef(null);

  const slides = [
    {
      title: "Bem-vindo ao RubiRide!",
      description:
        "Nosso aplicativo ajuda a gerenciar suas rotas de transporte com facilidade.",
      icon: "directions-bus",
    },
    {
      title: "Gerencie suas rotas",
      description:
        "Crie, edite e acompanhe todas as suas rotas de transporte em um só lugar.",
      icon: "map",
    },
    {
      title: "Aumente sua eficiência",
      description:
        "Economize tempo e melhore sua produtividade com nossas ferramentas avançadas.",
      icon: "trending-up",
    },
  ];

  const handleNextSlide = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    } else {
      onFinish();
    }
  };

  const handlePrevSlide = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
    }
  };

  const onGestureEvent = ({ nativeEvent }) => {
    if (nativeEvent.state === State.END) {
      if (nativeEvent.translationX > 50 && currentSlide > 0) {
        handlePrevSlide();
      } else if (
        nativeEvent.translationX < -50 &&
        currentSlide < slides.length - 1
      ) {
        handleNextSlide();
      }
    }
  };

  return (
    <GestureHandlerRootView style={styles.container}>
      <PanGestureHandler
        ref={panRef}
        onHandlerStateChange={onGestureEvent}
        activeOffsetX={[-20, 20]}
      >
        <View style={styles.content}>
          <OnboardingSlide
            title={slides[currentSlide].title}
            description={slides[currentSlide].description}
            icon={slides[currentSlide].icon}
          />
          <View style={styles.navigationContainer}>
            <TouchableOpacity
              onPress={handlePrevSlide}
              disabled={currentSlide === 0}
            >
              <Text
                style={[
                  styles.navigationText,
                  currentSlide === 0 && styles.disabledText,
                ]}
              >
                Anterior
              </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleNextSlide}>
              <Text style={styles.navigationText}>
                {currentSlide === slides.length - 1 ? "Finalizar" : "Próximo"}
              </Text>
            </TouchableOpacity>
          </View>
          <View style={styles.paginationContainer}>
            {slides.map((_, index) => (
              <View
                key={index}
                style={[
                  styles.paginationDot,
                  index === currentSlide && styles.paginationDotActive,
                ]}
              />
            ))}
          </View>
        </View>
      </PanGestureHandler>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  content: {
    flex: 1,
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  slideContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  icon: {
    marginBottom: 20,
  },
  slideTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  slideDescription: {
    fontSize: 18,
    textAlign: "center",
    color: "#555",
  },
  navigationContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "80%",
    position: "absolute",
    bottom: 60,
  },
  navigationText: {
    fontSize: 18,
    color: "#007bff",
  },
  disabledText: {
    color: "#ccc",
  },
  paginationContainer: {
    flexDirection: "row",
    position: "absolute",
    bottom: 30,
  },
  paginationDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#ccc",
    marginHorizontal: 5,
  },
  paginationDotActive: {
    backgroundColor: "#007bff",
  },
});

export default OnboardingScreen;
