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
import { Platform, StatusBar } from 'react-native';
import { useAuth } from '../../contexts/AuthContext';
import { COLORS, SPACING, TEST_CREDENTIALS } from '../../constants';
import { LoginRequest } from '../../types';

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

    try {
      await login(formData);
    } catch (err: any) {
      setError(err.message || 'Login failed. Please try again.');
    }
  };

  const useTestCredentials = () => {
    setFormData(TEST_CREDENTIALS);
    setError(null);
  };

  return (
    <KeyboardAvoidingView
      flex={1}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />
      <ScrollView
        flex={1}
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
      >
        <Box flex={1} bg={COLORS.background} justifyContent="center" px={SPACING.lg}>
          <VStack space="xl" alignItems="center">
            {/* Header */}
            <VStack space="md" alignItems="center">
              <Heading size="2xl" color={COLORS.primary}>
                ZaTix Crew
              </Heading>
              <Text size="lg" color={COLORS.textSecondary} textAlign="center">
                Ticket Validation System
              </Text>
            </VStack>

            {/* Login Form */}
            <Box
              w="100%"
              maxWidth={400}
              bg={COLORS.surface}
              p={SPACING.xl}
              borderRadius={12}
              shadowColor={COLORS.text}
              shadowOffset={{ width: 0, height: 2 }}
              shadowOpacity={0.1}
              shadowRadius={4}
              elevation={3}
            >
              <VStack space="lg">
                <Heading size="lg" textAlign="center" mb={SPACING.md}>
                  Sign In
                </Heading>

                {error && (
                  <Alert action="error" variant="solid">
                    <AlertIcon />
                    <AlertText>{error}</AlertText>
                  </Alert>
                )}

                <VStack space="md">
                  <Input>
                    <InputField
                      placeholder="Email"
                      value={formData.email}
                      onChangeText={(text) => handleInputChange('email', text)}
                      keyboardType="email-address"
                      autoCapitalize="none"
                      autoCorrect={false}
                    />
                  </Input>

                  <Input>
                    <InputField
                      placeholder="Password"
                      value={formData.password}
                      onChangeText={(text) => handleInputChange('password', text)}
                      secureTextEntry
                    />
                  </Input>
                </VStack>

                <Button
                  onPress={handleLogin}
                  isDisabled={loading}
                  bg={COLORS.primary}
                  $pressed={{ bg: COLORS.primaryDark }}
                >
                  <HStack space="sm" alignItems="center">
                    {loading && <Spinner color="white" size="small" />}
                    <ButtonText color="white">
                      {loading ? 'Signing In...' : 'Sign In'}
                    </ButtonText>
                  </HStack>
                </Button>

                {/* Test Credentials Section */}
                <VStack space="sm" mt={SPACING.md}>
                  <Button
                    variant="outline"
                    onPress={() => setShowTestCredentials(!showTestCredentials)}
                  >
                    <ButtonText color={COLORS.primary}>
                      {showTestCredentials ? 'Hide' : 'Show'} Test Credentials
                    </ButtonText>
                  </Button>

                  {showTestCredentials && (
                    <Box
                      bg={COLORS.background}
                      p={SPACING.md}
                      borderRadius={8}
                      borderWidth={1}
                      borderColor={COLORS.border}
                    >
                      <VStack space="xs">
                        <Text size="sm" fontWeight="medium">
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
                          mt={SPACING.xs}
                        >
                          <ButtonText color="white">Use Test Credentials</ButtonText>
                        </Button>
                      </VStack>
                    </Box>
                  )}
                </VStack>
              </VStack>
            </Box>

            <Text size="sm" color={COLORS.textSecondary} textAlign="center">
              Scan QR codes to validate event tickets
            </Text>
          </VStack>
        </Box>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}