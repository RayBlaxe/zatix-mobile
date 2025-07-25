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
import { Platform } from 'react-native';
import { validationService } from '../../services/validation';
import { COLORS, SPACING } from '../../constants';
import { TicketValidation } from '../../types';

interface ManualEntryScreenProps {
  onClose: () => void;
  onValidation: (result: TicketValidation, ticketCode: string) => void;
}

export default function ManualEntryScreen({ onClose, onValidation }: ManualEntryScreenProps) {
  const [ticketCode, setTicketCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const validateTicketCode = (code: string): boolean => {
    // Check if it matches ZTX-XXXXXXXXXX format
    const ticketRegex = /^ZTX-[A-Z0-9]{10}$/;
    return ticketRegex.test(code.toUpperCase());
  };

  const handleValidation = async () => {
    const cleanCode = ticketCode.trim().toUpperCase();
    
    if (!cleanCode) {
      setError('Please enter a ticket code');
      return;
    }

    if (!validateTicketCode(cleanCode)) {
      setError('Invalid ticket code format. Expected: ZTX-XXXXXXXXXX');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const result = await validationService.validateTicket(cleanCode);
      onValidation(result, cleanCode);
      setTicketCode('');
    } catch (err: any) {
      setError(err.message || 'Validation failed');
    } finally {
      setLoading(false);
    }
  };

  const handleCodeChange = (text: string) => {
    // Remove any non-alphanumeric characters and convert to uppercase
    const cleanText = text.replace(/[^A-Z0-9-]/gi, '').toUpperCase();
    setTicketCode(cleanText);
    if (error) setError(null);
  };

  const formatTicketCode = (code: string): string => {
    // Auto-format as user types: ZTX-XXXXXXXXXX
    const cleanCode = code.replace(/[^A-Z0-9]/gi, '');
    if (cleanCode.length <= 3) {
      return cleanCode;
    }
    return `${cleanCode.slice(0, 3)}-${cleanCode.slice(3, 13)}`;
  };

  return (
    <KeyboardAvoidingView
      flex={1}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        flex={1}
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
      >
        <Box flex={1} bg={COLORS.background} p={SPACING.lg}>
          <VStack space="lg" flex={1}>
            {/* Header */}
            <HStack justifyContent="space-between" alignItems="center">
              <Heading size="xl" color={COLORS.primary}>
                Manual Entry
              </Heading>
              <Button
                variant="ghost"
                onPress={onClose}
                size="sm"
              >
                <ButtonText color={COLORS.primary}>Cancel</ButtonText>
              </Button>
            </HStack>

            <Text color={COLORS.textSecondary}>
              Enter the ticket code manually if QR scanning is not available
            </Text>

            {/* Input Form */}
            <Box
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
                {error && (
                  <Alert action="error" variant="solid">
                    <AlertIcon />
                    <AlertText>{error}</AlertText>
                  </Alert>
                )}

                <VStack space="sm">
                  <Text fontWeight="medium">Ticket Code</Text>
                  <Input size="lg">
                    <InputField
                      placeholder="ZTX-XXXXXXXXXX"
                      value={formatTicketCode(ticketCode)}
                      onChangeText={handleCodeChange}
                      autoCapitalize="characters"
                      autoCorrect={false}
                      maxLength={13} // ZTX-XXXXXXXXXX = 13 characters
                      fontSize={16}
                      letterSpacing={1}
                      fontFamily="monospace"
                    />
                  </Input>
                  <Text size="sm" color={COLORS.textSecondary}>
                    Format: ZTX-XXXXXXXXXX (e.g., ZTX-LIRGSH9MMA)
                  </Text>
                </VStack>

                <Button
                  onPress={handleValidation}
                  isDisabled={loading || !ticketCode.trim()}
                  bg={COLORS.primary}
                  $pressed={{ bg: COLORS.primaryDark }}
                  size="lg"
                >
                  <HStack space="sm" alignItems="center">
                    {loading && <Spinner color="white" size="small" />}
                    <ButtonText color="white" fontSize={16}>
                      {loading ? 'Validating...' : 'Validate Ticket'}
                    </ButtonText>
                  </HStack>
                </Button>
              </VStack>
            </Box>

            {/* Instructions */}
            <Box
              bg={COLORS.surface}
              p={SPACING.lg}
              borderRadius={12}
              borderLeftWidth={4}
              borderLeftColor={COLORS.secondary}
            >
              <VStack space="sm">
                <Text fontWeight="medium">Instructions:</Text>
                <Text size="sm" color={COLORS.textSecondary}>
                  • Enter the complete ticket code including the ZTX- prefix
                </Text>
                <Text size="sm" color={COLORS.textSecondary}>
                  • Ticket codes are 13 characters long (ZTX-XXXXXXXXXX)
                </Text>
                <Text size="sm" color={COLORS.textSecondary}>
                  • All letters should be uppercase
                </Text>
                <Text size="sm" color={COLORS.textSecondary}>
                  • If validation fails due to network issues, the ticket will be queued for later processing
                </Text>
              </VStack>
            </Box>

            {/* Sample codes for testing */}
            <Box
              bg={COLORS.surface}
              p={SPACING.lg}
              borderRadius={12}
              borderWidth={1}
              borderColor={COLORS.border}
            >
              <VStack space="sm">
                <Text fontWeight="medium" size="sm">Sample Test Codes:</Text>
                <HStack flexWrap="wrap" space="sm">
                  {['ZTX-LIRGSH9MMA', 'ZTX-TEST123456', 'ZTX-SAMPLE7890'].map((code) => (
                    <Button
                      key={code}
                      size="xs"
                      variant="outline"
                      onPress={() => setTicketCode(code)}
                    >
                      <ButtonText fontSize={12} fontFamily="monospace">
                        {code}
                      </ButtonText>
                    </Button>
                  ))}
                </HStack>
              </VStack>
            </Box>
          </VStack>
        </Box>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}