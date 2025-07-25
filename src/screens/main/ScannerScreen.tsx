import React, { useState } from 'react';
import {
  Box,
  VStack,
  HStack,
  Heading,
  Text,
  Button,
  ButtonText,
  AlertCircleIcon,
  CheckCircleIcon,
} from '@gluestack-ui/themed';
import { StatusBar, Dimensions, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, SPACING } from '../../constants';
import QRScanner from '../../components/QRScanner';
import { apiService } from '../../services/api';
import { ValidationResponse } from '../../types';

const { width, height } = Dimensions.get('window');

interface ScannerState {
  isScanning: boolean;
  loading: boolean;
  lastResult: ValidationResponse | null;
  error: string | null;
}

export default function ScannerScreen() {
  const [state, setState] = useState<ScannerState>({
    isScanning: false,
    loading: false,
    lastResult: null,
    error: null,
  });

  const handleStartScanning = () => {
    setState(prev => ({ 
      ...prev, 
      isScanning: !prev.isScanning,
      error: null,
      lastResult: null 
    }));
  };

  const handleScan = async (ticketCode: string) => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const result = await apiService.validateTicket({ ticket_code: ticketCode });
      
      setState(prev => ({ 
        ...prev, 
        loading: false,
        lastResult: result,
        isScanning: false 
      }));
      
      // Show success alert
      Alert.alert(
        'Validation Successful',
        `Ticket ${ticketCode} has been validated for ${result.data.event_name}`,
        [{ text: 'OK', onPress: () => setState(prev => ({ ...prev, lastResult: null })) }]
      );
      
    } catch (error: any) {
      setState(prev => ({ 
        ...prev, 
        loading: false,
        error: error.message || 'Failed to validate ticket',
        isScanning: false 
      }));
      
      Alert.alert(
        'Validation Failed',
        error.message || 'Failed to validate ticket. Please try again.',
        [{ text: 'OK', onPress: () => setState(prev => ({ ...prev, error: null })) }]
      );
    }
  };

  const handleError = (error: string) => {
    setState(prev => ({ ...prev, error, loading: false }));
    Alert.alert('Scanner Error', error);
  };

  if (state.isScanning) {
    return (
      <Box flex={1} bg="black">
        <StatusBar barStyle="light-content" backgroundColor="black" />
        <QRScanner
          onScan={handleScan}
          onError={handleError}
          isActive={state.isScanning}
          loading={state.loading}
        />
        
        {/* Close Scanner Button */}
        <Box position="absolute" top={60} right={SPACING.lg} zIndex={10}>
          <Button
            onPress={handleStartScanning}
            bg="rgba(255, 255, 255, 0.2)"
            borderRadius={25}
            w={50}
            h={50}
            $pressed={{
              bg: "rgba(255, 255, 255, 0.3)"
            }}
          >
            <Text fontSize={20} color={COLORS.textLight}>✕</Text>
          </Button>
        </Box>
      </Box>
    );
  }

  return (
    <Box flex={1}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />
      
      {/* Background gradient */}
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

      <VStack flex={1} justifyContent="space-between">
        {/* Header */}
        <Box pt={60} px={SPACING.lg}>
          <VStack space="md" alignItems="center">
            <Heading size="2xl" color={COLORS.textLight} textAlign="center">
              QR Scanner
            </Heading>
            <Text size="md" color="rgba(255, 255, 255, 0.8)" textAlign="center">
              Scan ticket QR codes to validate entry
            </Text>
          </VStack>
        </Box>

        {/* Status Display */}
        {(state.error || state.lastResult) && (
          <Box px={SPACING.lg}>
            <Box
              bg={state.error ? "rgba(239, 71, 111, 0.1)" : "rgba(6, 214, 160, 0.1)"}
              borderColor={state.error ? COLORS.error : COLORS.success}
              borderWidth={1}
              borderRadius={12}
              p={SPACING.md}
            >
              <HStack space="sm" alignItems="center">
                {state.error ? (
                  <AlertCircleIcon size="md" color={COLORS.error} />
                ) : (
                  <CheckCircleIcon size="md" color={COLORS.success} />
                )}
                <VStack flex={1}>
                  <Text color={COLORS.textLight} fontSize={14} fontWeight="600">
                    {state.error ? 'Error' : 'Success'}
                  </Text>
                  <Text color="rgba(255, 255, 255, 0.8)" fontSize={12}>
                    {state.error || (state.lastResult && `Validated: ${state.lastResult.data.ticket_code}`)}
                  </Text>
                </VStack>
              </HStack>
            </Box>
          </Box>
        )}

        {/* Scanner Preview Area */}
        <Box flex={1} justifyContent="center" alignItems="center" px={SPACING.lg}>
          <Box
            w={width * 0.8}
            h={width * 0.8}
            borderWidth={3}
            borderColor={COLORS.secondary}
            borderRadius={20}
            bg="rgba(255, 255, 255, 0.1)"
            justifyContent="center"
            alignItems="center"
            position="relative"
          >
            {/* Corner borders for scanner frame */}
            <Box position="absolute" top={-3} left={-3}>
              <Box w={40} h={3} bg={COLORS.accent} />
              <Box w={3} h={40} bg={COLORS.accent} />
            </Box>
            <Box position="absolute" top={-3} right={-3}>
              <Box w={40} h={3} bg={COLORS.accent} />
              <Box w={3} h={40} bg={COLORS.accent} position="absolute" right={0} />
            </Box>
            <Box position="absolute" bottom={-3} left={-3}>
              <Box w={3} h={40} bg={COLORS.accent} position="absolute" bottom={0} />
              <Box w={40} h={3} bg={COLORS.accent} position="absolute" bottom={0} />
            </Box>
            <Box position="absolute" bottom={-3} right={-3}>
              <Box w={3} h={40} bg={COLORS.accent} position="absolute" bottom={0} right={0} />
              <Box w={40} h={3} bg={COLORS.accent} position="absolute" bottom={0} right={0} />
            </Box>

            <VStack space="md" alignItems="center">
              <Box
                w={80}
                h={80}
                borderRadius={40}
                bg="rgba(255, 255, 255, 0.2)"
                justifyContent="center"
                alignItems="center"
              >
                <Text fontSize={32}>📷</Text>
              </Box>
              <Text color="rgba(255, 255, 255, 0.7)" textAlign="center" fontSize={14}>
                Tap start to begin scanning
              </Text>
            </VStack>
          </Box>
        </Box>

        {/* Controls */}
        <Box px={SPACING.lg} pb={60}>
          <VStack space="md">
            <Button
              onPress={handleStartScanning}
              bg={COLORS.surface}
              borderRadius={12}
              h={56}
              shadowColor={COLORS.surface}
              shadowOffset={{ width: 0, height: 4 }}
              shadowOpacity={0.3}
              shadowRadius={8}
              elevation={4}
              outlineColor='#003d7a'
              $pressed={{
                transform: [{ scale: 0.98 }]
              }}
              disabled={state.loading}
            >
              <HStack space="sm" alignItems="center">
                <Text fontSize={20}>📱</Text>
                <ButtonText color="#003d7a" fontSize={16} fontWeight="600">
                  {state.loading ? 'Validating...' : 'Start Scanning'}
                </ButtonText>
              </HStack>
            </Button>

            <HStack space="md" justifyContent="space-between">
              <Button
                flex={1}
                variant="outline"
                borderColor="rgba(255, 255, 255, 0.3)"
                borderRadius={12}
                bg="rgba(255, 255, 255, 0.1)"
                $pressed={{
                  bg: "rgba(255, 255, 255, 0.2)"
                }}
                disabled={state.loading}
              >
                <ButtonText color={COLORS.textLight} fontSize={14}>
                  Manual Entry
                </ButtonText>
              </Button>

              <Button
                flex={1}
                variant="outline"
                borderColor="rgba(255, 255, 255, 0.3)"
                borderRadius={12}
                bg="rgba(255, 255, 255, 0.1)"
                $pressed={{
                  bg: "rgba(255, 255, 255, 0.2)"
                }}
                disabled={state.loading}
              >
                <ButtonText color={COLORS.textLight} fontSize={14}>
                  History
                </ButtonText>
              </Button>
            </HStack>
          </VStack>
        </Box>
      </VStack>
    </Box>
  );
}