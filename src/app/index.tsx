import { useEffect, useRef, useState } from 'react';

import {
  ActivityIndicator,
  Alert,
  Animated,
  Easing,
  Image,
  ImageBackground,
  Pressable,
  StatusBar,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';

import LottieView from 'lottie-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import {
  CinzelDecorative_700Bold,
  useFonts,
} from '@expo-google-fonts/cinzel-decorative';

import {
  DEFAULT_GAME_INFO,
  loadGameInfo,
  type GameInfo,
} from '../utils/gameInfo';

const backgroundImage = require('../../assets/backgrounds/medieval_wood.jpg');
const torchAnimation = require('../../assets/animations/torch.json');
const dragonImage = require('../../assets/images/dragon.png');

const DRAGON_WIDTH = 180;
const DRAGON_HEIGHT = 125;
const FLIGHT_DURATION = 3000;
const FLIGHT_INTERVAL = 5000;
const FLIGHT_AREA_HEIGHT = 180;

export default function MedievalStartScreen() {
  const { width: screenWidth } = useWindowDimensions();

  const [gameInfo, setGameInfo] = useState<GameInfo>(
    DEFAULT_GAME_INFO
  );
  const [loading, setLoading] = useState(true);
  const [torchError, setTorchError] = useState(false);

  const [fontsLoaded, fontError] = useFonts({
    Medieval: CinzelDecorative_700Bold,
  });

  // Dragon animation values
  const dragonX = useRef(
    new Animated.Value(-DRAGON_WIDTH)
  ).current;

  const dragonY = useRef(
    new Animated.Value(20)
  ).current;

  const dragonRotation = useRef(
    new Animated.Value(0)
  ).current;

  // Load game information
  useEffect(() => {
    let active = true;

    async function initializeGame() {
      try {
        const info = await loadGameInfo();

        if (active) {
          setGameInfo(info);
        }
      } catch (error) {
        console.warn('Game initialization failed:', error);
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    initializeGame();

    return () => {
      active = false;
    };
  }, []);

  // Flying dragon animation
  useEffect(() => {
    let active = true;
    let timeout: ReturnType<typeof setTimeout> | undefined;

    const flyDragon = () => {
      if (!active) return;

      // Generate a new random trajectory for every flight
      const maxY = FLIGHT_AREA_HEIGHT - DRAGON_HEIGHT;
      const startY = Math.random() * maxY;
      const endY = Math.random() * maxY;

      const tilt = Math.random() * 12 - 6;

      dragonX.setValue(-DRAGON_WIDTH);
      dragonY.setValue(startY);
      dragonRotation.setValue(0);

      Animated.parallel([
        Animated.timing(dragonX, {
          toValue: screenWidth + DRAGON_WIDTH,
          duration: FLIGHT_DURATION,
          easing: Easing.linear,
          useNativeDriver: true,
        }),

        Animated.timing(dragonY, {
          toValue: endY,
          duration: FLIGHT_DURATION,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),

        Animated.sequence([
          Animated.timing(dragonRotation, {
            toValue: tilt,
            duration: FLIGHT_DURATION / 2,
            useNativeDriver: true,
          }),

          Animated.timing(dragonRotation, {
            toValue: 0,
            duration: FLIGHT_DURATION / 2,
            useNativeDriver: true,
          }),
        ]),
      ]).start();

      // Start a new flight every five seconds
      timeout = setTimeout(flyDragon, FLIGHT_INTERVAL);
    };

    flyDragon();

    return () => {
      active = false;

      if (timeout) {
        clearTimeout(timeout);
      }

      dragonX.stopAnimation();
      dragonY.stopAnimation();
      dragonRotation.stopAnimation();
    };
  }, [screenWidth, dragonX, dragonY, dragonRotation]);

  const isReady = !loading && (fontsLoaded || !!fontError);

  const medievalFont =
    fontsLoaded && !fontError ? 'Medieval' : undefined;

  const rotation = dragonRotation.interpolate({
    inputRange: [-10, 10],
    outputRange: ['-10deg', '10deg'],
  });

  const handleStartGame = () => {
    Alert.alert(
      'Adventure Begins!',
      'The Lost Realm is waiting for you!'
    );
  };

  return (
    <ImageBackground
      source={backgroundImage}
      resizeMode="cover"
      style={styles.background}
    >
      <StatusBar barStyle="light-content" />

      <SafeAreaView style={styles.safeArea}>
        <View style={styles.overlay}>

          {/* HEADER */}
          <View style={styles.header}>
            <Text style={styles.symbol}>⚔️</Text>

            {!isReady ? (
              <ActivityIndicator
                size="large"
                color="#D4AF37"
              />
            ) : (
              <>
                <Text
                  style={[
                    styles.title,
                    { fontFamily: medievalFont },
                  ]}
                >
                  {gameInfo.title}
                </Text>

                <Text style={styles.version}>
                  VERSION {gameInfo.version}
                </Text>
              </>
            )}

            <View style={styles.divider} />

            <Text style={styles.subtitle}>
              Enter a world of magic, dragons, and legends.
            </Text>
          </View>

          {/* BURNING TORCHES */}
          <View style={styles.torchContainer}>
            {torchError ? (
              <Text style={styles.torchFallback}>🔥</Text>
            ) : (
              <LottieView
                source={torchAnimation}
                autoPlay
                loop
                resizeMode="contain"
                onAnimationFailure={(error) => {
                  console.warn('Torch animation failed:', error);
                  setTorchError(true);
                }}
                style={styles.torch}
              />
            )}

            <Text
              style={[
                styles.adventureText,
                { fontFamily: medievalFont },
              ]}
            >
              Your Adventure Awaits
            </Text>

            {torchError ? (
              <Text style={styles.torchFallback}>🔥</Text>
            ) : (
              <LottieView
                source={torchAnimation}
                autoPlay
                loop
                resizeMode="contain"
                onAnimationFailure={(error) => {
                  console.warn('Torch animation failed:', error);
                  setTorchError(true);
                }}
                style={styles.torch}
              />
            )}
          </View>

          {/* FLYING DRAGON AREA */}
          <View style={styles.flightArea}>
            <Animated.View
              style={[
                styles.dragonContainer,
                {
                  transform: [
                    { translateX: dragonX },
                    { translateY: dragonY },
                    { rotate: rotation },
                  ],
                },
              ]}
            >
              <Image
                source={dragonImage}
                resizeMode="contain"
                style={styles.dragon}
              />
            </Animated.View>
          </View>

          {/* DESCRIPTION */}
          <View style={styles.centerArea}>
            <Text style={styles.dragonSymbol}>🐉</Text>

            <Text style={styles.description}>
              Your destiny awaits beyond the castle gates.
            </Text>
          </View>

          {/* START BUTTON */}
          <View style={styles.footer}>
            <Pressable
              onPress={handleStartGame}
              disabled={!isReady}
              style={({ pressed }) => [
                styles.startButton,
                pressed && styles.buttonPressed,
                !isReady && styles.buttonDisabled,
              ]}
            >
              <Text
                style={[
                  styles.buttonText,
                  { fontFamily: medievalFont },
                ]}
              >
                START GAME
              </Text>
            </Pressable>

            <Text style={styles.footerText}>
              THE LOST REALM
            </Text>
          </View>

        </View>
      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
  },

  safeArea: {
    flex: 1,
  },

  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.58)',
    paddingHorizontal: 16,
    paddingVertical: 15,
    justifyContent: 'space-between',
  },

  header: {
    alignItems: 'center',
    marginTop: 12,
  },

  symbol: {
    fontSize: 40,
    marginBottom: 12,
  },

  title: {
    color: '#D4AF37',
    fontSize: 29,
    textAlign: 'center',
    marginBottom: 12,
  },

  version: {
    color: '#E8D4A5',
    fontSize: 12,
    letterSpacing: 3,
  },

  divider: {
    height: 2,
    width: 150,
    backgroundColor: '#D4AF37',
    marginVertical: 18,
  },

  subtitle: {
    color: '#F5DEB3',
    fontSize: 15,
    textAlign: 'center',
    lineHeight: 24,
  },

  torchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    minHeight: 150,
  },

  torch: {
    width: 90,
    height: 150,
  },

  torchFallback: {
    fontSize: 45,
  },

  adventureText: {
    flex: 1,
    color: '#D4AF37',
    fontSize: 13,
    textAlign: 'center',
    paddingHorizontal: 4,
  },

  flightArea: {
    width: '100%',
    height: FLIGHT_AREA_HEIGHT,
    overflow: 'visible',
  },

  dragonContainer: {
    position: 'absolute',
    left: 0,
    top: 0,
    width: DRAGON_WIDTH,
    height: DRAGON_HEIGHT,
  },

  dragon: {
    width: DRAGON_WIDTH,
    height: DRAGON_HEIGHT,
  },

  centerArea: {
    alignItems: 'center',
    justifyContent: 'center',
  },

  dragonSymbol: {
    fontSize: 50,
    marginBottom: 12,
  },

  description: {
    color: '#F5DEB3',
    fontSize: 15,
    textAlign: 'center',
    fontStyle: 'italic',
    lineHeight: 24,
  },

  footer: {
    alignItems: 'center',
    marginBottom: 20,
  },

  startButton: {
    backgroundColor: '#8B5A2B',
    borderWidth: 2,
    borderColor: '#D4AF37',
    borderRadius: 12,
    paddingVertical: 18,
    paddingHorizontal: 35,
    minWidth: 240,
    alignItems: 'center',
    elevation: 6,
  },

  buttonPressed: {
    opacity: 0.7,
    transform: [{ scale: 0.96 }],
  },

  buttonDisabled: {
    opacity: 0.5,
  },

  buttonText: {
    color: '#FFF1CF',
    fontSize: 17,
    textAlign: 'center',
  },

  footerText: {
    color: '#C6AA72',
    fontSize: 11,
    letterSpacing: 3,
    marginTop: 22,
  },
});
