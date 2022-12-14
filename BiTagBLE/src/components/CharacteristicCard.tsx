import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, Vibration } from 'react-native';
import { Characteristic } from 'react-native-ble-plx';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { Base64 } from '../lib/base64';
import SoundPlayer from 'react-native-sound-player'

type CharacteristicCardProps = {
  char: Characteristic;
};

const decodeBleString = (value: string | undefined | null): string => {
  if (!value) {
    return '';
  }
  return Base64.decode(value).charCodeAt(0);
};

const CharacteristicCard = ({ char }: CharacteristicCardProps) => {
  const [measure, setMeasure] = useState('');
  const [descriptor, setDescriptor] = useState<string | null>('');

  useEffect(() => {
    // discover characteristic descriptors
    char.descriptors().then((desc) => {
      desc[0]?.read().then((val) => {
        if (val) {
          setDescriptor((val.value));
        }
      });
    });

    // read on the characteristic 👏
    char.monitor((err, cha) => {
      if (err) {
        console.warn('ERROR');
        return;
      }
      // each received value has to be decoded with a Base64 algorythm you can find on the Internet (or in my repository 😉)
      const decodedValue = Base64.decode(cha?.value);

      setMeasure(decodedValue);
      if (decodedValue == 'find') {
        Vibration.vibrate(2000)
        try {
                SoundPlayer.playSoundFile('ding', 'mp3')
            } catch (e) {
                console.log(`cannot play the sound file`, e)
            }
      }
    });
  }, [char]);
  let valueDisplay: String = '';
  if(char.isWritableWithResponse){
    valueDisplay = 'Click to find your BiTag';
  }
  else{
    valueDisplay = 'Status:';
  }

  // write on a charactestic the number 6 (e.g.)
  const writeCharacteristic = () => {
    // encode the string with the Base64 algorythm
    char
      .writeWithResponse(Base64.encode('F1'))
      .then(() => {
        console.warn('Success');
      })
      .catch((e) => console.log('Error', e));
  };

  return (
    <TouchableOpacity
      //key={char.uuid}
      style={styles.container}
      onPress={writeCharacteristic}>
      <Text style={styles.measure}>{valueDisplay}</Text>
      <Text style={styles.measure}>{measure}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    marginVertical: 12,
    borderRadius: 16,
    shadowColor: 'rgba(60,64,67,0.3)',
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
    padding: 12,
  },
  measure: { color: 'red', fontSize: 24 },
  descriptor: { color: 'blue', fontSize: 24 },
});

export { CharacteristicCard };
