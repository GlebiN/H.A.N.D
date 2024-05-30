import { DeviceMotion } from 'expo-sensors';
import { View, StyleSheet, Text, Button, Touchable, TouchableOpacity } from 'react-native';
import React, { useState, useEffect } from 'react';

const ws = new WebSocket('ws://192.168.1.83:8080');

var
  displacementX = 0,
  displacementY = 0,
  displacementZ = 0,
  counter = 0,
  samples = 25,
  lowPass = 0.2,
  listening = true,
  toStop = false,
  realMesurment = false;

const MainScreen = ({ navigation }) => {
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

  DeviceMotion.setUpdateInterval(10);

  useEffect(() => {
    DeviceMotion.addListener(onDeviceMotionChange);
    return () => {
      DeviceMotion.removeAllListeners();
    };
  }, []);

  useEffect(() => {
    var s = (currentPosition.x.toString() + "," + currentPosition.y.toString() + "," + currentPosition.z.toString());
    console.log(s);
    try {
      setTimeout(() => {
        ws.send(s);
      },
        500
      )
    } catch (e) { console.log("not conneted")}
  }
  );

  const onDeviceMotionChange = (event) => {
    if (realMesurment) {
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
    } else {
      var mesurmentX = lowPassFilter(event.acceleration.x) / Math.abs(lowPassFilter(event.acceleration.x));
      var mesurmentY = lowPassFilter(event.acceleration.y) / Math.abs(lowPassFilter(event.acceleration.y));
      var mesurmentZ = lowPassFilter(event.acceleration.z) / Math.abs(lowPassFilter(event.acceleration.z));
      setCurrentPosition(
        (currentPosition) => (
          {
            x: currentPosition.x + Math.random() * 0.05 * (isNaN(mesurmentX) ? 0 : mesurmentX),
            y: currentPosition.y + Math.random() * 0.05 * (isNaN(mesurmentY) ? 0 : mesurmentY),
            z: currentPosition.z + Math.random() * 0.05 * (isNaN(mesurmentZ) ? 0 : mesurmentZ)
          })
      )
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
        <Text style={styles.text}>x: {currentPosition.x.toFixed(3)}</Text>
        <Text style={styles.text}>y: {currentPosition.y.toFixed(3)}</Text>
        <Text style={styles.text}>z: {currentPosition.z.toFixed(3)}</Text>
      </View>

      <View
        style={styles.resetButton}>
        <Button
          title='reset'
          onPress={() => { setCurrentPosition({ x: 0, y: 0, z: 0 }) }} />
      </View>
      <Button title='to coordinates screen' onPress={() => { if (!toStop) { toggleListening() }; navigation.navigate("Coordinates"); }} />
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