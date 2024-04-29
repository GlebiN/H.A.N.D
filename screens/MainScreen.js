import { DeviceMotion } from 'expo-sensors';
import { View, StyleSheet, Text, Button, Touchable, TouchableOpacity } from 'react-native';
import React, { useState, useEffect } from 'react';

var
  displacementX = 0,
  displacementY = 0,
  displacementZ = 0,
  counter = 0,
  samples = 25,
  lowPass = 0.1,
  listening = true,
  toStop = false;

const MainScreen = ({navigation}) => {
  function lowPassFilter(input) {
    if (Math.abs(input) < lowPass) {
      return 0;
    }
    return input;
  }

  function toggleListening() {
    if (listening) { DeviceMotion.removeAllListeners(); }
    else { DeviceMotion.addListener(onDeviceMotionChange); }
    listening = !listening;

    toggleText(
      buttonText => (
        {
          text: toStop ? 'start' : 'stop',
          color: toStop ? 'blue' : 'red'
        }
      )
    )

    toStop = !toStop;
  }

  const [currentPosition, setCurrentPosition] = useState({ x: 0, y: 0, z: 0 });
  const [toggleButton, toggleText] = useState({ text: 'stop', color: 'red' })

  DeviceMotion.setUpdateInterval(1);

  useEffect(() => {
    DeviceMotion.addListener(onDeviceMotionChange);
    return () => {
      DeviceMotion.removeAllListeners();
    };
  }, []);

  const onDeviceMotionChange = (event) => {
    displacementX += lowPassFilter(event.acceleration.x);
    displacementY += lowPassFilter(event.acceleration.y);
    displacementZ += lowPassFilter(event.acceleration.z);
    counter++;
    if (counter >= samples) {
      setCurrentPosition(
        (currentPosition) => (
          {
            x: currentPosition.x + displacementX / samples,
            y: currentPosition.y + displacementY / samples,
            z: currentPosition.z + displacementZ / samples
          })
      )
      displacementX = 0;
      displacementY = 0;
      displacementZ = 0;
      counter = 0;
    }
  }

  return (
    <View style={styles.container}>

      <TouchableOpacity
        style={{ height: 200, width: 200, backgroundColor: toggleButton.color }}
        onPress={() => { toggleListening() }}
        color={toggleButton.color}
      >
        <Text style={styles.toggleText}>{toggleButton.text}</Text>
      </TouchableOpacity>


      <View style={styles.values}>
        <Text style={styles.text}>x: {currentPosition.x.toFixed(2)}</Text>
        <Text style={styles.text}>y: {currentPosition.y.toFixed(2)}</Text>
        <Text style={styles.text}>z: {currentPosition.z.toFixed(2)}</Text>
      </View>

      <View
        style={styles.resetButton}>
        <Button
          title='reset'
          onPress={() => { setCurrentPosition({ x: 0, y: 0, z: 0 }) }} />
      </View>
      <Button title='to coordinates screen' onPress={() => {if(!toStop) {toggleListening()}; navigation.navigate("Coordinates");}} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 25,
    paddingTop: 50
  },
  text: {
    alignContent: 'center',
    margin: 10
  },
  resetButton: {
    width: '100%'
  },
  toggleText: {
    textAlign: 'center',
    marginTop: 100 - 35,
    fontSize: 35,
    color: 'white'
  },
  values: {
    flexDirection: 'row'
  }
});

export default MainScreen;