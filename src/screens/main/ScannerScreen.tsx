import React from 'react';
import {
  Box,
  VStack,
  Heading,
  Text,
  Button,
  ButtonText,
} from '@gluestack-ui/themed';
import { COLORS, SPACING } from '../../constants';

export default function ScannerScreen() {
  return (
    <Box flex={1} bg={COLORS.background} justifyContent="center" alignItems="center">
      <VStack space="lg" alignItems="center" px={SPACING.lg}>
        <Heading size="xl" color={COLORS.primary}>
          QR Scanner
        </Heading>
        <Text textAlign="center" color={COLORS.textSecondary}>
          Scanner component will be implemented here
        </Text>
        <Button bg={COLORS.primary}>
          <ButtonText color="white">Start Scanning</ButtonText>
        </Button>
      </VStack>
    </Box>
  );
}