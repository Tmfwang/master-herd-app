import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';

export default function App() {

  const [count, setCount] = useState(0)

  const handlePress = () => {
    alert(count+1)
    setCount(count+1)
  }

  return (
    <View style={styles.container}>
      <Text>HELLO WORLD!</Text>
      <Button title="ALERT" onPress={handlePress}></Button>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
