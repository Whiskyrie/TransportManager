import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

interface OnboardingSlideProps {
  title: string;
  description: string;
}

const OnboardingSlide: React.FC<OnboardingSlideProps> = ({
  title,
  description,
}) => (
  <View style={styles.slideContainer}>
    <Text style={styles.slideTitle}>{title}</Text>
    <Text style={styles.slideDescription}>{description}</Text>
  </View>
);

interface OnboardingScreenProps {
  onFinish: () => void;
}

const OnboardingScreen: React.FC<OnboardingScreenProps> = ({ onFinish }) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      title: "Bem-vindo ao RubiRide!",
      description:
        "Nosso aplicativo ajuda a gerenciar suas rotas de transporte com facilidade.",
    },
    {
      title: "Gerencie suas rotas",
      description:
        "Crie, edite e acompanhe todas as suas rotas de transporte em um só lugar.",
    },
    {
      title: "Aumente sua eficiência",
      description:
        "Economize tempo e melhore sua produtividade com nossas ferramentas avançadas.",
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

  return (
    <View style={styles.container}>
      <OnboardingSlide
        title={slides[currentSlide].title}
        description={slides[currentSlide].description}
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
  },
  slideContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
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
    bottom: 30,
  },
  navigationText: {
    fontSize: 18,
    color: "#007bff",
  },
  disabledText: {
    color: "#ccc",
  },
});

export default OnboardingScreen;
