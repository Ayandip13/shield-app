import React, { useState } from 'react';
import {
  View,
  TouchableOpacity,
  Modal,
  FlatList,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { Text } from './Text';
import { theme } from '../../theme';
import { Building } from '../../types/building';
import { Ionicons } from '@expo/vector-icons';

interface BuildingPickerProps {
  label?: string;
  selectedBuildingId?: string;
  buildings: Building[];
  onSelect: (buildingId: string) => void;
  error?: string;
}

export const BuildingPicker: React.FC<BuildingPickerProps> = ({
  label = 'Assigned Building *',
  selectedBuildingId,
  buildings,
  onSelect,
  error,
}) => {
  const [modalVisible, setModalVisible] = useState(false);

  const selectedBuilding = buildings.find((b) => b._id === selectedBuildingId);

  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      <TouchableOpacity
        style={[styles.pickerButton, error ? styles.pickerError : undefined]}
        onPress={() => setModalVisible(true)}
        activeOpacity={0.7}
      >
        <Text
          style={selectedBuilding ? styles.selectedText : styles.placeholderText}
          numberOfLines={1}
        >
          {selectedBuilding ? selectedBuilding.name : 'Select a building...'}
        </Text>
        <Ionicons name="chevron-down" size={20} color={theme.colors.textSecondary} />
      </TouchableOpacity>

      {error ? <Text style={styles.errorText}>{error}</Text> : null}

      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={false}
        onRequestClose={() => setModalVisible(false)}
      >
        <SafeAreaView style={styles.modalSafeArea}>
          <View style={styles.modalHeader}>
            <Text variant="heading" style={styles.modalTitle}>
              Select Building
            </Text>
            <TouchableOpacity onPress={() => setModalVisible(false)}>
              <Ionicons name="close" size={24} color={theme.colors.textPrimary} />
            </TouchableOpacity>
          </View>

          {buildings.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Ionicons name="business-outline" size={48} color={theme.colors.textMuted} />
              <Text variant="heading" style={styles.emptyTitle}>
                No Buildings Registered
              </Text>
              <Text variant="caption" style={styles.emptySubtitle}>
                Please create a building first before adding personnel.
              </Text>
            </View>
          ) : (
            <FlatList
              data={buildings}
              keyExtractor={(item) => item._id}
              contentContainerStyle={styles.listPadding}
              renderItem={({ item }) => {
                const isSelected = item._id === selectedBuildingId;
                return (
                  <TouchableOpacity
                    style={[styles.buildingOption, isSelected ? styles.selectedOption : undefined]}
                    onPress={() => {
                      onSelect(item._id);
                      setModalVisible(false);
                    }}
                  >
                    <View style={styles.buildingOptionCol}>
                      <Text variant="heading" style={styles.buildingOptionName}>
                        {item.name}
                      </Text>
                      <Text variant="caption" style={styles.buildingOptionAddress}>
                        📍 {item.address}
                      </Text>
                    </View>
                    {isSelected && (
                      <Ionicons name="checkmark-circle" size={22} color={theme.colors.primary} />
                    )}
                  </TouchableOpacity>
                );
              }}
            />
          )}
        </SafeAreaView>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: theme.spacing.sm,
  },
  label: {
    fontSize: theme.typography.fontSizes.sm,
    fontWeight: theme.typography.fontWeights.medium,
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.xs,
  },
  pickerButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.surfaceBorder,
    borderRadius: theme.borderRadius.md,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
  },
  pickerError: {
    borderColor: theme.colors.danger,
  },
  selectedText: {
    color: theme.colors.textPrimary,
    fontSize: theme.typography.fontSizes.md,
    fontWeight: '500',
  },
  placeholderText: {
    color: theme.colors.textMuted,
    fontSize: theme.typography.fontSizes.md,
  },
  errorText: {
    fontSize: theme.typography.fontSizes.xs,
    color: theme.colors.danger,
    marginTop: theme.spacing.xs,
  },
  modalSafeArea: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: theme.spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.surfaceBorder,
    backgroundColor: theme.colors.surface,
  },
  modalTitle: {
    color: theme.colors.textPrimary,
  },
  listPadding: {
    padding: theme.spacing.lg,
    gap: theme.spacing.md,
  },
  buildingOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.surfaceBorder,
  },
  selectedOption: {
    borderColor: theme.colors.primary,
    backgroundColor: theme.colors.primaryLight,
  },
  buildingOptionCol: {
    flex: 1,
    marginRight: theme.spacing.sm,
  },
  buildingOptionName: {
    color: theme.colors.textPrimary,
    fontWeight: '700',
  },
  buildingOptionAddress: {
    color: theme.colors.textSecondary,
    marginTop: 2,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.xl,
  },
  emptyTitle: {
    marginTop: theme.spacing.md,
    color: theme.colors.textPrimary,
  },
  emptySubtitle: {
    textAlign: 'center',
    marginTop: theme.spacing.xs,
    color: theme.colors.textSecondary,
  },
});
