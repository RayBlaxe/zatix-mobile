import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  VStack,
  HStack,
  Text,
  Button,
  ButtonText,
  Modal,
  ModalBackdrop,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  Input,
  InputField,
  AlertCircleIcon,
  CloseIcon,
} from '@gluestack-ui/themed';
import { Camera, CameraView, BarcodeScanningResult, FlashMode } from 'expo-camera';
import { Dimensions, StyleSheet, Alert, Vibration } from 'react-native';
import { COLORS, SPACING, APP_CONFIG } from '../constants';

const { width, height } = Dimensions.get('window');

interface QRScannerProps {
  onScan: (ticketCode: string) => void;
  onError: (error: string) => void;
  isActive: boolean;
  loading?: boolean;
}

interface ScannerState {
  hasPermission: boolean | null;
  permissionRequested: boolean;
  flashEnabled: boolean;
  showManualInput: boolean;
  manualCode: string;
  lastScannedCode: string | null;
  scanCooldown: boolean;
}

export default function QRScanner({ onScan, onError, isActive, loading = false }: QRScannerProps) {
  const [state, setState] = useState<ScannerState>({
    hasPermission: null,
    permissionRequested: false,
    flashEnabled: false,
    showManualInput: false,
    manualCode: '',
    lastScannedCode: null,
    scanCooldown: false,
  });

  const cameraRef = useRef<CameraView>(null);
  const cooldownTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isActive && !state.permissionRequested) {
      requestCameraPermission();
    }
  }, [isActive, state.permissionRequested]);

  useEffect(() => {
    return () => {
      if (cooldownTimerRef.current) {
        clearTimeout(cooldownTimerRef.current);
        cooldownTimerRef.current = null;
      }
    };
  }, []);

  const requestCameraPermission = async () => {
    setState(prev => ({ ...prev, permissionRequested: true }));
    
    try {
      const result = await Camera.requestCameraPermissionsAsync();
      const { status } = result;
      setState(prev => ({ 
        ...prev, 
        hasPermission: status === 'granted' 
      }));
      
      if (status !== 'granted') {
        onError('Camera permission is required to scan QR codes');
      }
    } catch (error) {
      onError('Failed to request camera permission');
      setState(prev => ({ ...prev, hasPermission: false }));
    }
  };

  const extractTicketCode = (scannedData: string): string | null => {
    // Remove whitespace and convert to uppercase for consistency
    const cleanData = scannedData.trim().toUpperCase();
    
    // Handle different QR code formats
    // Format 1: Direct ticket code (e.g., "ZTX-LIRGSH9MMAUZ")
    const directCodeMatch = cleanData.match(/^ZTX-[A-Z0-9]+$/);
    if (directCodeMatch) {
      return directCodeMatch[0];
    }
    
    // Format 2: JSON format with ticket_code field
    try {
      const parsed = JSON.parse(scannedData);
      if (parsed.ticket_code) {
        return parsed.ticket_code.toUpperCase();
      }
      if (parsed.code) {
        return parsed.code.toUpperCase();
      }
    } catch {
      // Not JSON, continue to other formats
    }
    
    // Format 3: URL format (e.g., "https://zatix.id/validate/ZTX-LIRGSH9MMAUZ")
    const urlMatch = cleanData.match(/\/([A-Z0-9-]+)$/);
    if (urlMatch && urlMatch[1].startsWith('ZTX-')) {
      return urlMatch[1];
    }
    
    // Format 4: Query parameter format
    const queryMatch = cleanData.match(/[?&](?:code|ticket_code)=([A-Z0-9-]+)/i);
    if (queryMatch) {
      return queryMatch[1].toUpperCase();
    }
    
    // Format 5: Contains ZTX- pattern anywhere in the string
    const ztxMatch = cleanData.match(/ZTX-[A-Z0-9]+/);
    if (ztxMatch) {
      return ztxMatch[0];
    }
    
    return null;
  };

  const handleBarCodeScanned = ({ type, data }: BarcodeScanningResult) => {
    if (state.scanCooldown || !isActive || loading) {
      return;
    }

    const ticketCode = extractTicketCode(data);
    
    if (!ticketCode) {
      onError('Invalid QR code format. Please scan a valid ticket QR code.');
      return;
    }

    // Prevent duplicate scans of the same code
    if (ticketCode === state.lastScannedCode) {
      return;
    }

    // Provide haptic feedback
    Vibration.vibrate(100);

    setState(prev => ({ 
      ...prev, 
      lastScannedCode: ticketCode,
      scanCooldown: true 
    }));

    // Set cooldown to prevent rapid multiple scans
    cooldownTimerRef.current = setTimeout(() => {
      setState(prev => ({ ...prev, scanCooldown: false }));
    }, 2000);

    onScan(ticketCode);
  };

  const handleManualSubmit = () => {
    const ticketCode = state.manualCode.trim().toUpperCase();
    
    if (!ticketCode) {
      Alert.alert('Error', 'Please enter a ticket code');
      return;
    }

    // Validate ticket code format
    if (!ticketCode.match(/^ZTX-[A-Z0-9]+$/)) {
      Alert.alert('Error', 'Invalid ticket code format. Expected format: ZTX-XXXXXXXXXX');
      return;
    }

    setState(prev => ({ 
      ...prev, 
      showManualInput: false,
      manualCode: '',
      lastScannedCode: ticketCode 
    }));
    
    onScan(ticketCode);
  };

  const toggleFlash = () => {
    setState(prev => ({ ...prev, flashEnabled: !prev.flashEnabled }));
  };

  if (state.hasPermission === null) {
    return (
      <Box flex={1} justifyContent="center" alignItems="center" bg="rgba(0, 0, 0, 0.9)">
        <VStack space="md" alignItems="center">
          <Text color={COLORS.textLight} fontSize={16}>
            Requesting camera permission...
          </Text>
        </VStack>
      </Box>
    );
  }

  if (state.hasPermission === false) {
    return (
      <Box flex={1} justifyContent="center" alignItems="center" bg="rgba(0, 0, 0, 0.9)" px={SPACING.lg}>
        <VStack space="lg" alignItems="center">
          <Box
            w={80}
            h={80}
            borderRadius={40}
            bg={COLORS.error}
            justifyContent="center"
            alignItems="center"
          >
            <AlertCircleIcon size="xl" color={COLORS.textLight} />
          </Box>
          
          <VStack space="sm" alignItems="center">
            <Text color={COLORS.textLight} fontSize={18} fontWeight="600" textAlign="center">
              Camera Permission Required
            </Text>
            <Text color="rgba(255, 255, 255, 0.8)" fontSize={14} textAlign="center">
              Please enable camera access in your device settings to scan QR codes
            </Text>
          </VStack>

          <VStack space="sm" w="100%">
            <Button
              onPress={requestCameraPermission}
              bg={COLORS.primary}
              borderRadius={12}
              h={48}
            >
              <ButtonText color={COLORS.textLight}>
                Retry Permission
              </ButtonText>
            </Button>

            <Button
              onPress={() => setState(prev => ({ ...prev, showManualInput: true }))}
              variant="outline"
              borderColor="rgba(255, 255, 255, 0.3)"
              borderRadius={12}
              bg="rgba(255, 255, 255, 0.1)"
              h={48}
            >
              <ButtonText color={COLORS.textLight}>
                Enter Code Manually
              </ButtonText>
            </Button>
          </VStack>
        </VStack>
      </Box>
    );
  }

  return (
    <>
      <Box flex={1} position="relative">
        {isActive && (
          <CameraView
            ref={cameraRef}
            style={StyleSheet.absoluteFillObject}
            facing="back"
            flash={state.flashEnabled ? 'on' as FlashMode : 'off' as FlashMode}
            barcodeScannerSettings={{
              barcodeTypes: ['qr', 'code128', 'code39'],
            }}
            onBarcodeScanned={handleBarCodeScanned}
          />
        )}

        {/* Scanning Overlay */}
        <Box style={StyleSheet.absoluteFillObject} justifyContent="center" alignItems="center">
          {/* Dark overlay with transparent center */}
          <Box style={StyleSheet.absoluteFillObject} bg="rgba(0, 0, 0, 0.5)" />
          
          {/* Scanner Frame */}
          <Box
            w={width * 0.8}
            h={width * 0.8}
            borderRadius={20}
            position="relative"
          >
            {/* Transparent center for scanning */}
            <Box
              style={StyleSheet.absoluteFillObject}
              borderRadius={20}
              bg="transparent"
              borderWidth={2}
              borderColor={state.scanCooldown ? COLORS.success : COLORS.accent}
            />

            {/* Corner indicators */}
            <Box position="absolute" top={-2} left={-2}>
              <Box w={40} h={4} bg={COLORS.accent} borderTopLeftRadius={20} />
              <Box w={4} h={40} bg={COLORS.accent} borderTopLeftRadius={20} />
            </Box>
            <Box position="absolute" top={-2} right={-2}>
              <Box w={40} h={4} bg={COLORS.accent} borderTopRightRadius={20} />
              <Box w={4} h={40} bg={COLORS.accent} borderTopRightRadius={20} position="absolute" right={0} />
            </Box>
            <Box position="absolute" bottom={-2} left={-2}>
              <Box w={4} h={40} bg={COLORS.accent} borderBottomLeftRadius={20} position="absolute" bottom={0} />
              <Box w={40} h={4} bg={COLORS.accent} borderBottomLeftRadius={20} position="absolute" bottom={0} />
            </Box>
            <Box position="absolute" bottom={-2} right={-2}>
              <Box w={4} h={40} bg={COLORS.accent} borderBottomRightRadius={20} position="absolute" bottom={0} right={0} />
              <Box w={40} h={4} bg={COLORS.accent} borderBottomRightRadius={20} position="absolute" bottom={0} right={0} />
            </Box>

            {/* Scanning animation line */}
            {isActive && !loading && !state.scanCooldown && (
              <Box
                position="absolute"
                top="50%"
                left={10}
                right={10}
                h={2}
                bg={COLORS.accent}
                opacity={0.8}
                borderRadius={1}
              />
            )}

            {/* Status indicator */}
            <Box position="absolute" bottom={-60} left={0} right={0} alignItems="center">
              {loading ? (
                <Text color={COLORS.textLight} fontSize={14} textAlign="center">
                  Validating ticket...
                </Text>
              ) : state.scanCooldown ? (
                <Text color={COLORS.success} fontSize={14} textAlign="center">
                  Code detected!
                </Text>
              ) : (
                <Text color={COLORS.textLight} fontSize={14} textAlign="center">
                  Position QR code within the frame
                </Text>
              )}
            </Box>
          </Box>
        </Box>

        {/* Controls */}
        <Box position="absolute" bottom={60} left={0} right={0} px={SPACING.lg}>
          <HStack space="md" justifyContent="center">
            <Button
              onPress={toggleFlash}
              bg={state.flashEnabled ? COLORS.warning : "rgba(255, 255, 255, 0.2)"}
              borderRadius={30}
              w={60}
              h={60}
              $pressed={{
                bg: state.flashEnabled ? COLORS.warning : "rgba(255, 255, 255, 0.3)"
              }}
            >
              <Text fontSize={24}>
                {state.flashEnabled ? '🔦' : '💡'}
              </Text>
            </Button>

            <Button
              onPress={() => setState(prev => ({ ...prev, showManualInput: true }))}
              bg="rgba(255, 255, 255, 0.2)"
              borderRadius={30}
              w={60}
              h={60}
              $pressed={{
                bg: "rgba(255, 255, 255, 0.3)"
              }}
            >
              <Text fontSize={24}>⌨️</Text>
            </Button>
          </HStack>
        </Box>
      </Box>

      {/* Manual Input Modal */}
      <Modal
        isOpen={state.showManualInput}
        onClose={() => setState(prev => ({ ...prev, showManualInput: false, manualCode: '' }))}
      >
        <ModalBackdrop />
        <ModalContent>
          <ModalHeader>
            <Text fontSize={18} fontWeight="600">
              Enter Ticket Code Manually
            </Text>
            <ModalCloseButton>
              <CloseIcon />
            </ModalCloseButton>
          </ModalHeader>
          <ModalBody pb={SPACING.lg}>
            <VStack space="md">
              <Text fontSize={14} color={COLORS.textSecondary}>
                Enter the ticket code in the format: ZTX-XXXXXXXXXX
              </Text>
              
              <Input variant="outline" size="md">
                <InputField
                  placeholder="ZTX-LIRGSH9MMAUZ"
                  value={state.manualCode}
                  onChangeText={(text) => setState(prev => ({ ...prev, manualCode: text }))}
                  autoCapitalize="characters"
                  autoCorrect={false}
                />
              </Input>

              <HStack space="md" justifyContent="flex-end">
                <Button
                  variant="outline"
                  onPress={() => setState(prev => ({ ...prev, showManualInput: false, manualCode: '' }))}
                >
                  <ButtonText>Cancel</ButtonText>
                </Button>
                
                <Button
                  onPress={handleManualSubmit}
                  bg={COLORS.primary}
                >
                  <ButtonText color={COLORS.textLight}>
                    Validate
                  </ButtonText>
                </Button>
              </HStack>
            </VStack>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}