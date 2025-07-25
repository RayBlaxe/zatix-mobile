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
  
  ScrollView,
} from '@gluestack-ui/themed';
import { StatusBar } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
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
    <Box flex={1}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />
      
      {/* Background gradient */}
      <LinearGradient
        colors={[COLORS.primary, COLORS.primaryDark, COLORS.backgroundDark]}
        locations={[0, 0.7, 1]}
        style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
      />

      <ScrollView flex={1} showsVerticalScrollIndicator={false}>
        <VStack space="xl" p={SPACING.lg} pt={60}>
          {/* Header */}
          <VStack space="md" alignItems="center" mb={SPACING.lg}>
            <Box
              bg="rgba(255, 255, 255, 0.1)"
              p={SPACING.md}
              borderRadius={16}
              borderWidth={1}
              borderColor="rgba(255, 255, 255, 0.2)"
            >
              <Text fontSize={32}>⚙️</Text>
            </Box>
            <Heading size="2xl" color={COLORS.textLight} textAlign="center">
              Settings
            </Heading>
            <Text size="md" color="rgba(255, 255, 255, 0.8)" textAlign="center">
              Manage your account and preferences
            </Text>
          </VStack>

          {/* User Profile Card */}
          <Box
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
              <HStack space="md" alignItems="center">
                <Box
                  w={60}
                  h={60}
                  bg={COLORS.primary}
                  borderRadius={30}
                  justifyContent="center"
                  alignItems="center"
                >
                  <Text fontSize={24} color="white">👤</Text>
                </Box>
                <VStack flex={1}>
                  <Heading size="lg" color={COLORS.primary}>
                    {user?.name || 'Crew Member'}
                  </Heading>
                  <Text size="md" color={COLORS.textSecondary}>
                    {user?.email || 'crew@zatix.id'}
                  </Text>
                </VStack>
              </HStack>

              <Divider bg={COLORS.border} />

              <VStack space="md">
                <Text size="lg" fontWeight="600" color={COLORS.primary}>
                  Account Details
                </Text>
                <VStack space="sm">
                  <HStack justifyContent="space-between" alignItems="center">
                    <Text fontWeight="500" color={COLORS.text}>Role:</Text>
                    <Box
                      bg={COLORS.secondary}
                      px={SPACING.sm}
                      py={2}
                      borderRadius={8}
                    >
                      <Text color="white" fontSize={12} fontWeight="600">
                        {user?.roles?.join(', ') || 'CREW'}
                      </Text>
                    </Box>
                  </HStack>
                  <HStack justifyContent="space-between" alignItems="center">
                    <Text fontWeight="500" color={COLORS.text}>Status:</Text>
                    <Box
                      bg={COLORS.success}
                      px={SPACING.sm}
                      py={2}
                      borderRadius={8}
                    >
                      <Text color="white" fontSize={12} fontWeight="600">
                        ACTIVE
                      </Text>
                    </Box>
                  </HStack>
                </VStack>
              </VStack>
            </VStack>
          </Box>

          {/* App Information Card */}
          <Box
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
              <HStack space="md" alignItems="center">
                <Box
                  w={50}
                  h={50}
                  bg={COLORS.info}
                  borderRadius={12}
                  justifyContent="center"
                  alignItems="center"
                >
                  <Text fontSize={20}>📱</Text>
                </Box>
                <VStack flex={1}>
                  <Heading size="md" color={COLORS.primary}>
                    ZaTix Crew App
                  </Heading>
                  <Text size="sm" color={COLORS.textSecondary}>
                    Professional ticket validation
                  </Text>
                </VStack>
              </HStack>

              <Divider bg={COLORS.border} />

              <VStack space="sm">
                <HStack justifyContent="space-between">
                  <Text fontWeight="500" color={COLORS.text}>Version:</Text>
                  <Text color={COLORS.textSecondary} fontWeight="600">1.0.0</Text>
                </HStack>
                <HStack justifyContent="space-between">
                  <Text fontWeight="500" color={COLORS.text}>Framework:</Text>
                  <Text color={COLORS.textSecondary} fontWeight="600">Expo SDK 53</Text>
                </HStack>
                <HStack justifyContent="space-between">
                  <Text fontWeight="500" color={COLORS.text}>Build:</Text>
                  <Text color={COLORS.textSecondary} fontWeight="600">Development</Text>
                </HStack>
              </VStack>
            </VStack>
          </Box>

          {/* Quick Actions */}
          <VStack space="md">
            <Text size="lg" fontWeight="600" color={COLORS.textLight} textAlign="center">
              Quick Actions
            </Text>
            
            <VStack space="sm">
              <Button
                variant="outline"
                borderColor="rgba(255, 255, 255, 0.3)"
                borderRadius={16}
                bg="rgba(255, 255, 255, 0.1)"
                h={50}
                $pressed={{
                  bg: "rgba(255, 255, 255, 0.2)"
                }}
              >
                <HStack space="sm" alignItems="center">
                  <Text fontSize={18}>🔔</Text>
                  <ButtonText color={COLORS.textLight} fontSize={16} fontWeight="500">
                    Notifications
                  </ButtonText>
                </HStack>
              </Button>

              <Button
                variant="outline"
                borderColor="rgba(255, 255, 255, 0.3)"
                borderRadius={16}
                bg="rgba(255, 255, 255, 0.1)"
                h={50}
                $pressed={{
                  bg: "rgba(255, 255, 255, 0.2)"
                }}
              >
                <HStack space="sm" alignItems="center">
                  <Text fontSize={18}>📊</Text>
                  <ButtonText color={COLORS.textLight} fontSize={16} fontWeight="500">
                    Statistics
                  </ButtonText>
                </HStack>
              </Button>

              <Button
                variant="outline"
                borderColor="rgba(255, 255, 255, 0.3)"
                borderRadius={16}
                bg="rgba(255, 255, 255, 0.1)"
                h={50}
                $pressed={{
                  bg: "rgba(255, 255, 255, 0.2)"
                }}
              >
                <HStack space="sm" alignItems="center">
                  <Text fontSize={18}>❓</Text>
                  <ButtonText color={COLORS.textLight} fontSize={16} fontWeight="500">
                    Help & Support
                  </ButtonText>
                </HStack>
              </Button>
            </VStack>
          </VStack>

          {/* Logout Button */}
          <Button
            onPress={handleLogout}
            bg={COLORS.error}
            borderRadius={16}
            h={56}
            shadowColor={COLORS.error}
            shadowOffset={{ width: 0, height: 4 }}
            shadowOpacity={0.3}
            shadowRadius={8}
            elevation={4}
            $pressed={{ 
              bg: '#b91c1c',
              transform: [{ scale: 0.98 }]
            }}
            mt={SPACING.lg}
            mb={SPACING.xxl}
          >
            <HStack space="sm" alignItems="center">
              <Text fontSize={18}>🚪</Text>
              <ButtonText color="white" fontSize={16} fontWeight="600">
                Sign Out
              </ButtonText>
            </HStack>
          </Button>
        </VStack>
      </ScrollView>
    </Box>
  );
}