import { View, StyleSheet, Text, Button } from "react-native"
import Slider from "@react-native-community/slider"
import { useState } from "react"

var baseDiameter = 50;

export default function CoordinatesScreen() {
    const [valueX, setX] = useState(0);
    const [valueY, setY] = useState(0);
    const [valueZ, setZ] = useState(0);

    return (
        <View style={styles.container}>
            <View style={{ flex: 10, alignItems: 'center' }}>

                <View style={{flexDirection: 'row', height: '100%'}}>

                    <View style={{ flex: valueX < 0 ? valueX + 1 : 1 }}/>
                    {/* left */}

                    <View style={{flexDirection: 'column'}}>
                        <View style={{ flex: valueY < 0 ? valueY + 1 : 1 }} />
                        {/* top */}

                        <View
                            style={{
                                width: baseDiameter + valueZ * 20,
                                height: baseDiameter + valueZ * 20,
                                borderRadius: (baseDiameter + valueZ * 20) / 2,
                                backgroundColor: 'red'
                            }}
                        >
                        </View>
                        {/* circle it self */}

                        <View style={{ flex: valueY > 0 ? 1 - valueY : 1 }} />
                        {/* bottom */}
                        
                    </View>

                    <View style={{ flex: valueX > 0 ? 1 - valueX : 1 }} />
                    {/* right */}

                </View>
            </View>
            {/* CIRCLECIRCLECIRCLECIRCLECIRCLECIRCLECIRCLECIRCLECIRCLECIRCLE */}

            <View style={{ flex: 3 }}>
                <Text>
                    x: {valueX.toFixed(3)}
                </Text>
                <Slider
                    value={valueX}
                    minimumValue={-1}
                    maximumValue={1}
                    minimumTrackTintColor='#0000'
                    onValueChange={(newValue) => setX(newValue)}
                />
                {/* XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX */}

                <Text>
                    y: {valueY.toFixed(3)}
                </Text>
                <Slider
                    value={valueY}
                    minimumValue={-1}
                    maximumValue={1}
                    minimumTrackTintColor='#0000'
                    onValueChange={(newValue) => setY(newValue)}
                />
                {/* YYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYY */}

                <Text>
                    z: {valueZ.toFixed(3)}
                </Text>
                <Slider
                    value={valueZ}
                    minimumValue={-1}
                    maximumValue={1}
                    minimumTrackTintColor='#0000'
                    onValueChange={(newValue) => setZ(newValue)}
                />
                {/* ZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZ */}
            <Button style={{}} title='set position' onPress={() => {console.log('sent?')}} />
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-end',
        padding: 25,
        paddingTop: 50
    }
})