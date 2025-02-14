import React, { useState, useRef } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import {
  PanGestureHandler,
  State,
  GestureHandlerRootView,
  ScrollView,
} from "react-native-gesture-handler";
import { theme, sharedStyles } from "./style";

interface OnboardingSlideProps {
  title: string;
  description: string;
  icon: string;
  onFinish: () => void;
}

const OnboardingSlide: React.FC<OnboardingSlideProps> = ({
  title,
  description,
  icon,
}) => (
  <View style={styles.slideContainer}>
    <Icon
      name={icon}
      size={100}
      color={theme.colors.primary}
      style={styles.icon}
    />
    <Text style={[sharedStyles.title, styles.slideTitle]}>{title}</Text>
    <Text style={[sharedStyles.subtitle, styles.slideDescription]}>
      {description}
    </Text>
  </View>
);
("");

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
    <GestureHandlerRootView style={sharedStyles.container}>
      <PanGestureHandler
        ref={panRef}
        onHandlerStateChange={onGestureEvent}
        activeOffsetX={[-20, 20]}
      >
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.contentContainer} // Movido para contentContainerStyle
        >
          <OnboardingSlide {...slides[currentSlide]} onFinish={onFinish} />

          <View style={styles.navigationContainer}>
            <TouchableOpacity
              onPress={handlePrevSlide}
              disabled={currentSlide === 0}
              style={[
                styles.navigationButton,
                currentSlide === 0 && styles.disabledButton,
              ]}
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

            <TouchableOpacity
              onPress={handleNextSlide}
              style={styles.navigationButton}
            >
              <Text style={styles.navigationText}>
                {currentSlide === slides.length - 1 ? "Começar" : "Próximo"}
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </PanGestureHandler>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  contentContainer: {
    // Novo estilo para o contentContainer
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  slideContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: theme.spacing.xl,
  },
  icon: {
    marginBottom: theme.spacing.xl,
  },
  slideTitle: {
    marginBottom: theme.spacing.l,
  },
  slideDescription: {
    marginBottom: 0,
  },
  navigationContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    paddingHorizontal: theme.spacing.xl,
    paddingBottom: theme.spacing.xl,
  },
  navigationButton: {
    padding: theme.spacing.m,
  },
  navigationText: {
    fontSize: 16,
    color: theme.colors.primary,
    fontWeight: "bold",
  },
  disabledButton: {
    opacity: 0.5,
  },
  disabledText: {
    color: theme.colors.inactive,
  },
  paginationContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: theme.colors.inactive,
    marginHorizontal: 4,
  },
  paginationDotActive: {
    backgroundColor: theme.colors.primary,
    width: 24,
  },
});

export default OnboardingScreen;
