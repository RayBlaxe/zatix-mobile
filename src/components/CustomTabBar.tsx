import React from 'react';
import { View, TouchableOpacity, Image } from 'react-native';
import { Box, Text } from '@gluestack-ui/themed';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING } from '../constants';

interface CustomTabBarProps {
  state: any;
  descriptors: any;
  navigation: any;
}

export default function CustomTabBar({ state, descriptors, navigation }: CustomTabBarProps) {
  return (
    <Box
      bg={COLORS.surface}
      borderTopColor={COLORS.border}
      borderTopWidth={1}
      paddingBottom={8}
      paddingTop={8}
      shadowColor={COLORS.shadow}
      shadowOffset={{ width: 0, height: -2 }}
      shadowOpacity={0.1}
      shadowRadius={8}
      elevation={8}
    >
      <View style={{ 
        flexDirection: 'row', 
        alignItems: 'center',
        justifyContent: 'space-around',
        paddingHorizontal: SPACING.lg 
      }}>
        {state.routes.map((route: any, index: number) => {
          const { options } = descriptors[route.key];
          const label = options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
            ? options.title
            : route.name;

          const isFocused = state.index === index;

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          // Get the appropriate icon
          let iconName = 'apps-outline';
          if (route.name === 'Scanner') {
            iconName = isFocused ? 'qr-code' : 'qr-code-outline';
          } else if (route.name === 'ManualEntry') {
            iconName = isFocused ? 'keypad' : 'keypad-outline';
          } else if (route.name === 'Settings') {
            iconName = isFocused ? 'settings' : 'settings-outline';
          }

          return (
            <TouchableOpacity
              key={route.key}
              onPress={onPress}
              style={{
                flex: 1,
                alignItems: 'center',
                paddingVertical: 8,
              }}
            >
              <View style={{
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: isFocused ? `${COLORS.primary}15` : 'transparent',
                borderRadius: 20,
                paddingHorizontal: 16,
                paddingVertical: 8,
                minWidth: 60,
              }}>
                <Ionicons
                  name={iconName as any}
                  size={isFocused ? 26 : 24}
                  color={isFocused ? COLORS.primary : COLORS.textSecondary}
                />
                <Text
                  fontSize={12}
                  fontWeight="600"
                  color={isFocused ? COLORS.primary : COLORS.textSecondary}
                  mt={4}
                >
                  {label}
                </Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
      
      {/* Center Logo */}
      <View style={{
        position: 'absolute',
        top: -15,
        left: '50%',
        transform: [{ translateX: -30 }],
        backgroundColor: COLORS.surface,
        borderRadius: 30,
        padding: 8,
        borderWidth: 2,
        borderColor: COLORS.border,
        shadowColor: COLORS.shadow,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 4,
      }}>
        <Image
          source={require('../../assets/zatix-putih-trans.png')}
          style={{
            width: 44,
            height: 20,
            resizeMode: 'contain',
            tintColor: COLORS.primary,
          }}
        />
      </View>
    </Box>
  );
}
