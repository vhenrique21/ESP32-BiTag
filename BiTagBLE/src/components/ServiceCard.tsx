import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Characteristic, Descriptor, Service } from 'react-native-ble-plx';
import { CharacteristicCard } from './CharacteristicCard';
import { DescriptorCard } from './DescriptorCard';

type ServiceCardProps = {
  service: Service;
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const SERVICE_UUID = 'ab0828b1-198e-4351-b779-901fa0e0371e';

const ServiceCard = ({ service }: ServiceCardProps) => {
  const [descriptors, setDescriptors] = useState<Descriptor[]>([]);
  const [characteristics, setCharacteristics] = useState<Characteristic[]>([]);
  const [areCharacteristicsVisible, setAreCharacteristicsVisible] = useState(
    false,
  );

console.log(service);

  useEffect(() => {
    const getCharacteristics = async () => {
      const newCharacteristics = await service.characteristics();
      setCharacteristics(newCharacteristics);
      newCharacteristics.forEach(async (characteristic) => {
        const newDescriptors = await characteristic.descriptors();
        setDescriptors((prev) => [...new Set([...prev, ...newDescriptors])]);
      });
    };
    if(service.uuid == "ab0828b1-198e-4351-b779-901fa0e0371e"){
      getCharacteristics();
    }

  }, [service]);

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => {
          setAreCharacteristicsVisible((prev) => !prev);
        }}>
      <Text>{`UUID : ${service.uuid}`}</Text>
      </TouchableOpacity>

      {areCharacteristicsVisible &&
        characteristics &&
        characteristics.map((char) => (
          <CharacteristicCard key={char.id} char={char} />
        ))}
      {descriptors &&
        descriptors.map((descriptor) => (
          <DescriptorCard key={descriptor.id} descriptor={descriptor} />
        ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    marginBottom: 12,
    borderRadius: 16,
    shadowColor: 'rgba(60,64,67,0.3)',
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 4,
    padding: 12,
  },
});

export { ServiceCard };
