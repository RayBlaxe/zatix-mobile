import React, { useState } from 'react';
import {
  Box,
  VStack,
  HStack,
  Heading,
  Text,
  Input,
  InputField,
  Button,
  ButtonText,
  Alert,
  AlertIcon,
  AlertText,
  KeyboardAvoidingView,
  ScrollView,
  Spinner,
} from '@gluestack-ui/themed';
import { LinearGradient } from 'expo-linear-gradient';
import { Platform, StatusBar, Dimensions } from 'react-native';
import { useAuth } from '../../contexts/AuthContext';
import { COLORS, SPACING, TEST_CREDENTIALS, API_CONFIG } from '../../constants';
import { LoginRequest } from '../../types';

const { height } = Dimensions.get('window');

export default function LoginScreen() {
  const { login, loading } = useAuth();
  const [formData, setFormData] = useState<LoginRequest>({
    email: '',
    password: '',
  });
  const [error, setError] = useState<string | null>(null);
  const [showTestCredentials, setShowTestCredentials] = useState(false);

  const handleInputChange = (field: keyof LoginRequest, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (error) setError(null);
  };

  const handleLogin = async () => {
    if (!formData.email.trim() || !formData.password.trim()) {
      setError('Please fill in all fields');
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email.trim())) {
      setError('Please enter a valid email address');
      return;
    }

    // Check minimum password length
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    console.log('Login attempt with:', { 
      email: formData.email, 
      passwordLength: formData.password.length,
      baseURL: 'https://api.zatix.id/api',
      endpoint: '/login'
    });

    try {
      await login(formData);
      console.log('Login successful');
    } catch (err: any) {
      console.error('Login error:', err);
      
      // Handle different types of errors
      if (err.code === 'NETWORK_ERROR') {
        setError('Network error. Please check your internet connection and try again.');
      } else if (err.response?.status === 401) {
        setError('Invalid email or password. Please check your credentials.');
      } else if (err.response?.status === 404) {
        setError('Login service unavailable. Please try again later.');
      } else if (err.response?.status === 429) {
        setError('Too many login attempts. Please wait a moment and try again.');
      } else if (err.message) {
        setError(err.message);
      } else {
        setError('Login failed. Please try again.');
      }
    }
  };

  const useTestCredentials = () => {
    setFormData(TEST_CREDENTIALS);
    setError(null);
  };

  return (
    <Box flex={1} bg={COLORS.primary}>
      <KeyboardAvoidingView
        flex={1}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />
        
        {/* Background with gradient */}
        <LinearGradient
          colors={[COLORS.primary, COLORS.primaryDark, COLORS.backgroundDark]}
          locations={[0, 0.6, 1]}
          style={{ 
            position: 'absolute', 
            left: 0, 
            right: 0, 
            top: 0, 
            bottom: 0,
            width: '100%',
            height: '100%',
            zIndex: 0
          }}
        />
        
        <ScrollView
          flex={1}
          contentContainerStyle={{ flexGrow: 1, minHeight: height }}
          keyboardShouldPersistTaps="handled"
          style={{ flex: 1, zIndex: 1 }}
        >
        <Box flex={1} justifyContent="center" px={SPACING.lg} py={SPACING.xxl}>
          {/* Development Mode Indicator */}
          {API_CONFIG.DEV_MODE && (
            <Box
              position="absolute"
              top={50}
              right={SPACING.md}
              bg={COLORS.warning}
              px={SPACING.sm}
              py={SPACING.xs}
              borderRadius={8}
              zIndex={100}
            >
              <Text size="xs" color={COLORS.text} fontWeight="600">
                DEV MODE
              </Text>
            </Box>
          )}
          
          <VStack space="xl" alignItems="center">
            {/* Header with enhanced styling */}
            <VStack space="md" alignItems="center" mb={SPACING.xl}>
              <Box
                bg="rgba(255, 255, 255, 0.1)"
                p={SPACING.lg}
                borderRadius={20}
                borderWidth={1}
                borderColor="rgba(255, 255, 255, 0.2)"
              >
                <Heading size="3xl" color={COLORS.textLight} textAlign="center">
                  ZaTix
                </Heading>
                <Heading size="xl" color={COLORS.secondary} textAlign="center">
                  Crew
                </Heading>
              </Box>
              <Text size="lg" color="rgba(255, 255, 255, 0.8)" textAlign="center">
                Professional Ticket Validation
              </Text>
            </VStack>

            {/* Enhanced Login Form */}
            <Box
              w="100%"
              maxWidth={400}
              bg="rgba(255, 255, 255, 0.95)"
              p={SPACING.xl}
              borderRadius={20}
              shadowColor={COLORS.shadow}
              shadowOffset={{ width: 0, height: 8 }}
              shadowOpacity={0.3}
              shadowRadius={12}
              elevation={8}
              borderWidth={1}
              borderColor="rgba(255, 255, 255, 0.3)"
            >
              <VStack space="lg">
                <VStack space="xs" alignItems="center" mb={SPACING.md}>
                  <Heading size="xl" color={COLORS.primary} textAlign="center">
                    Welcome Back
                  </Heading>
                  <Text size="md" color={COLORS.textSecondary} textAlign="center">
                    Sign in to continue
                  </Text>
                </VStack>

                {error && (
                  <Alert action="error" variant="solid" borderRadius={12}>
                    <AlertIcon />
                    <AlertText color="white">{error}</AlertText>
                  </Alert>
                )}

                <VStack space="md">
                  <VStack space="xs">
                    <Text size="sm" fontWeight="500" color={COLORS.primary}>
                      Email Address
                    </Text>
                    <Input
                      borderRadius={12}
                      borderWidth={1}
                      borderColor={COLORS.border}
                      bg="white"
                      h={50}
                      $focus={{
                        borderColor: COLORS.primary,
                        borderWidth: 2,
                        shadowColor: COLORS.primary,
                        shadowOffset: { width: 0, height: 0 },
                        shadowOpacity: 0.2,
                        shadowRadius: 4,
                      }}
                    >
                      <InputField
                        placeholder="Enter your email"
                        value={formData.email}
                        onChangeText={(text) => handleInputChange('email', text)}
                        keyboardType="email-address"
                        autoCapitalize="none"
                        autoCorrect={false}
                        fontSize={16}
                        color={COLORS.text}
                        placeholderTextColor={COLORS.textSecondary}
                      />
                    </Input>
                  </VStack>

                  <VStack space="xs">
                    <Text size="sm" fontWeight="500" color={COLORS.primary}>
                      Password
                    </Text>
                    <Input
                      borderRadius={12}
                      borderWidth={1}
                      borderColor={COLORS.border}
                      bg="white"
                      h={50}
                      $focus={{
                        borderColor: COLORS.primary,
                        borderWidth: 2,
                        shadowColor: COLORS.primary,
                        shadowOffset: { width: 0, height: 0 },
                        shadowOpacity: 0.2,
                        shadowRadius: 4,
                      }}
                    >
                      <InputField
                        placeholder="Enter your password"
                        value={formData.password}
                        onChangeText={(text) => handleInputChange('password', text)}
                        secureTextEntry
                        fontSize={16}
                        color={COLORS.text}
                        placeholderTextColor={COLORS.textSecondary}
                      />
                    </Input>
                  </VStack>
                </VStack>

                <Button
                  onPress={handleLogin}
                  isDisabled={loading}
                  bg={COLORS.primary}
                  borderRadius={12}
                  h={52}
                  $pressed={{ 
                    bg: COLORS.primaryDark,
                    transform: [{ scale: 0.98 }]
                  }}
                  $disabled={{
                    bg: COLORS.textSecondary,
                    opacity: 0.6
                  }}
                  shadowColor={COLORS.primary}
                  shadowOffset={{ width: 0, height: 4 }}
                  shadowOpacity={0.3}
                  shadowRadius={8}
                  elevation={4}
                >
                  <HStack space="sm" alignItems="center">
                    {loading && <Spinner color="white" size="small" />}
                    <ButtonText color="white" fontSize={16} fontWeight="600">
                      {loading ? 'Signing In...' : 'Sign In'}
                    </ButtonText>
                  </HStack>
                </Button>

                {/* Enhanced Test Credentials Section */}
                <VStack space="sm" mt={SPACING.md}>
                  <Button
                    variant="outline"
                    borderColor={COLORS.secondary}
                    borderRadius={12}
                    borderWidth={1}
                    bg="transparent"
                    onPress={() => setShowTestCredentials(!showTestCredentials)}
                    $pressed={{
                      bg: "rgba(0, 180, 216, 0.1)"
                    }}
                  >
                    <ButtonText color={COLORS.secondary} fontSize={14} fontWeight="500">
                      {showTestCredentials ? 'Hide' : 'Show'} Test Credentials
                    </ButtonText>
                  </Button>

                  {showTestCredentials && (
                    <Box
                      bg="rgba(0, 180, 216, 0.05)"
                      p={SPACING.md}
                      borderRadius={12}
                      borderWidth={1}
                      borderColor="rgba(0, 180, 216, 0.2)"
                    >
                      <VStack space="xs">
                        <Text size="sm" fontWeight="600" color={COLORS.primary}>
                          Test Account:
                        </Text>
                        <Text size="sm" color={COLORS.textSecondary}>
                          Email: {TEST_CREDENTIALS.email}
                        </Text>
                        <Text size="sm" color={COLORS.textSecondary}>
                          Password: {TEST_CREDENTIALS.password}
                        </Text>
                        <Button
                          size="sm"
                          onPress={useTestCredentials}
                          bg={COLORS.secondary}
                          borderRadius={8}
                          mt={SPACING.xs}
                          $pressed={{
                            bg: COLORS.info
                          }}
                        >
                          <ButtonText color="white" fontSize={12} fontWeight="500">
                            Use Test Credentials
                          </ButtonText>
                        </Button>
                      </VStack>
                    </Box>
                  )}
                </VStack>
              </VStack>
            </Box>

            <Text size="sm" color="rgba(255, 255, 255, 0.7)" textAlign="center">
              Secure • Fast • Reliable QR Code Validation
            </Text>
          </VStack>
        </Box>
      </ScrollView>
    </KeyboardAvoidingView>
    </Box>
  );
}