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
  Badge,
  BadgeText,
} from '@gluestack-ui/themed';
import { COLORS, SPACING } from '../../constants';
import { TicketValidation } from '../../types';

interface ValidationResultScreenProps {
  result: TicketValidation;
  ticketCode: string;
  onClose: () => void;
  onScanAnother: () => void;
}

export default function ValidationResultScreen({
  result,
  ticketCode,
  onClose,
  onScanAnother,
}: ValidationResultScreenProps) {
  const isValid = result.status === 'valid';
  const statusColor = isValid ? COLORS.success : COLORS.error;
  const statusBg = isValid ? '#dcfce7' : '#fee2e2';

  const formatDateTime = (timestamp?: number | string) => {
    if (!timestamp) return 'N/A';
    const date = new Date(timestamp);
    return date.toLocaleString();
  };

  return (
    <Box flex={1} bg={COLORS.background} p={SPACING.lg}>
      <VStack space="lg" flex={1}>
        {/* Header */}
        <HStack justifyContent="space-between" alignItems="center">
          <Heading size="xl" color={COLORS.primary}>
            Validation Result
          </Heading>
          <Button
            variant="ghost"
            onPress={onClose}
            size="sm"
          >
            <ButtonText color={COLORS.primary}>Close</ButtonText>
          </Button>
        </HStack>

        {/* Status Card */}
        <Box
          bg={statusBg}
          p={SPACING.xl}
          borderRadius={12}
          borderWidth={2}
          borderColor={statusColor}
        >
          <VStack space="md" alignItems="center">
            <Box
              w={80}
              h={80}
              borderRadius={40}
              bg={statusColor}
              justifyContent="center"
              alignItems="center"
            >
              <Text fontSize={40} color="white">
                {isValid ? '✓' : '✗'}
              </Text>
            </Box>
            
            <VStack space="xs" alignItems="center">
              <Heading size="lg" color={statusColor}>
                {isValid ? 'VALID TICKET' : 'INVALID TICKET'}
              </Heading>
              <Text textAlign="center" color={COLORS.textSecondary}>
                {result.message || (isValid ? 'Ticket validated successfully' : 'Ticket validation failed')}
              </Text>
            </VStack>
          </VStack>
        </Box>

        {/* Ticket Details */}
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
            <Heading size="md">Ticket Information</Heading>
            <Divider />
            
            <VStack space="sm">
              {/* Event Name - Priority display */}
              {result.event_name && (
                <HStack justifyContent="space-between" alignItems="flex-start">
                  <Text fontWeight="medium" color={COLORS.primary}>Event:</Text>
                  <Text 
                    flex={1} 
                    textAlign="right" 
                    numberOfLines={3}
                    fontSize={16}
                    fontWeight="medium"
                    ml={SPACING.sm}
                  >
                    {result.event_name}
                  </Text>
                </HStack>
              )}

              {/* Ticket Type - Priority display */}
              {result.ticket_type && (
                <HStack justifyContent="space-between" alignItems="center">
                  <Text fontWeight="medium" color={COLORS.primary}>Ticket Type:</Text>
                  <Badge
                    size="md"
                    variant="solid"
                    bg={COLORS.secondary}
                  >
                    <BadgeText color="white" fontSize={14}>
                      {result.ticket_type}
                    </BadgeText>
                  </Badge>
                </HStack>
              )}

              {/* Attendee Name - Priority display */}
              {result.holder_name && (
                <HStack justifyContent="space-between" alignItems="center">
                  <Text fontWeight="medium" color={COLORS.primary}>Attendee:</Text>
                  <Text 
                    fontSize={16} 
                    fontWeight="medium"
                    textAlign="right"
                    flex={1}
                    ml={SPACING.sm}
                  >
                    {result.holder_name}
                  </Text>
                </HStack>
              )}

              {/* Checked In At - Priority display */}
              <HStack justifyContent="space-between" alignItems="center">
                <Text fontWeight="medium" color={COLORS.primary}>Checked In At:</Text>
                <Text fontSize={14} fontWeight="medium" color={COLORS.success}>
                  {formatDateTime(result.validated_at || Date.now())}
                </Text>
              </HStack>

              <Divider my={SPACING.xs} />

              {/* Secondary Information */}
              <HStack justifyContent="space-between" alignItems="center">
                <Text fontWeight="medium">Ticket Code:</Text>
                <Text fontFamily="monospace" color={COLORS.textSecondary} fontSize={12}>
                  {ticketCode}
                </Text>
              </HStack>

              {result.holder_email && (
                <HStack justifyContent="space-between" alignItems="center">
                  <Text fontWeight="medium">Email:</Text>
                  <Text fontSize={12} color={COLORS.textSecondary}>
                    {result.holder_email}
                  </Text>
                </HStack>
              )}

              <HStack justifyContent="space-between" alignItems="center">
                <Text fontWeight="medium">Status:</Text>
                <Badge
                  size="sm"
                  variant="solid"
                  bg={statusColor}
                >
                  <BadgeText color="white">
                    {result.status?.toUpperCase()}
                  </BadgeText>
                </Badge>
              </HStack>

              {result.previous_validations && result.previous_validations > 0 && (
                <HStack justifyContent="space-between" alignItems="center">
                  <Text fontWeight="medium">Previous Scans:</Text>
                  <Badge
                    size="sm"
                    variant="solid"
                    bg={COLORS.warning}
                  >
                    <BadgeText color="white">
                      {result.previous_validations}
                    </BadgeText>
                  </Badge>
                </HStack>
              )}
            </VStack>
          </VStack>
        </Box>

        {/* Additional Info */}
        {(result.event_date || result.venue) && (
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
              <Heading size="md">Event Details</Heading>
              <Divider />
              
              <VStack space="sm">
                {result.event_date && (
                  <HStack justifyContent="space-between" alignItems="center">
                    <Text fontWeight="medium">Date:</Text>
                    <Text>{formatDateTime(result.event_date)}</Text>
                  </HStack>
                )}

                {result.venue && (
                  <HStack justifyContent="space-between" alignItems="center">
                    <Text fontWeight="medium">Venue:</Text>
                    <Text flex={1} textAlign="right" numberOfLines={2}>
                      {result.venue}
                    </Text>
                  </HStack>
                )}
              </VStack>
            </VStack>
          </Box>
        )}

        {/* Action Buttons */}
        <VStack space="md" mt="auto">
          <Button
            onPress={onScanAnother}
            bg={COLORS.primary}
            $pressed={{ bg: COLORS.primaryDark }}
            size="lg"
          >
            <ButtonText color="white" fontSize={16}>
              Scan Another Ticket
            </ButtonText>
          </Button>

          <Button
            variant="outline"
            onPress={onClose}
            size="lg"
          >
            <ButtonText color={COLORS.primary} fontSize={16}>
              Back to Scanner
            </ButtonText>
          </Button>
        </VStack>
      </VStack>
    </Box>
  );
}