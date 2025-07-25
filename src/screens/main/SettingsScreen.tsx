import React from 'react';
import {
  Box,
  VStack,
  HStack,
  Heading,
  Text,
  Button,
  ButtonText,
  Divider,
} from '@gluestack-ui/themed';
import { useAuth } from '../../contexts/AuthContext';
import { COLORS, SPACING } from '../../constants';

export default function SettingsScreen() {
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <Box flex={1} bg={COLORS.background}>
      <VStack space="lg" p={SPACING.lg}>
        <Heading size="xl" color={COLORS.primary}>
          Settings
        </Heading>

        {/* User Info */}
        <Box
          bg={COLORS.surface}
          p={SPACING.lg}
          borderRadius={12}
          shadowColor={COLORS.text}
          shadowOffset={{ width: 0, height: 2 }}
          shadowOpacity={0.1}
          shadowRadius={4}
          elevation={3}
        >
          <VStack space="md">
            <Heading size="md">User Information</Heading>
            <Divider />
            <VStack space="sm">
              <HStack justifyContent="space-between">
                <Text fontWeight="medium">Name:</Text>
                <Text color={COLORS.textSecondary}>{user?.name}</Text>
              </HStack>
              <HStack justifyContent="space-between">
                <Text fontWeight="medium">Email:</Text>
                <Text color={COLORS.textSecondary}>{user?.email}</Text>
              </HStack>
              <HStack justifyContent="space-between">
                <Text fontWeight="medium">Role:</Text>
                <Text color={COLORS.textSecondary}>
                  {user?.roles?.join(', ') || 'Crew'}
                </Text>
              </HStack>
            </VStack>
          </VStack>
        </Box>

        {/* App Info */}
        <Box
          bg={COLORS.surface}
          p={SPACING.lg}
          borderRadius={12}
          shadowColor={COLORS.text}
          shadowOffset={{ width: 0, height: 2 }}
          shadowOpacity={0.1}
          shadowRadius={4}
          elevation={3}
        >
          <VStack space="md">
            <Heading size="md">App Information</Heading>
            <Divider />
            <VStack space="sm">
              <HStack justifyContent="space-between">
                <Text fontWeight="medium">Version:</Text>
                <Text color={COLORS.textSecondary}>1.0.0</Text>
              </HStack>
              <HStack justifyContent="space-between">
                <Text fontWeight="medium">Framework:</Text>
                <Text color={COLORS.textSecondary}>Expo</Text>
              </HStack>
            </VStack>
          </VStack>
        </Box>

        {/* Logout Button */}
        <Button
          onPress={handleLogout}
          bg={COLORS.error}
          $pressed={{ bg: '#b91c1c' }}
          mt={SPACING.lg}
        >
          <ButtonText color="white">Logout</ButtonText>
        </Button>
      </VStack>
    </Box>
  );
}