import React, { useState, useContext } from 'react';
import { View, TextInput, Button, StyleSheet, Text } from 'react-native';
import { TimerContext } from '../context/TimerContext';
import { CategorySelector } from '../components/CategorySelector';

export default function AddTimer({ navigation }) {
  const { addTimer } = useContext(TimerContext);
  const [name, setName] = useState('');
  const [duration, setDuration] = useState('');
  const [category, setCategory] = useState('');

  const handleSubmit = () => {
    if (name && duration && category) {
      addTimer({
        name,
        duration: parseInt(duration),
        category,
      });
      navigation.goBack();
    } else {
      alert('Please fill in all fields');
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Timer Name"
        value={name}
        onChangeText={setName}
      />
      
      <TextInput
        style={styles.input}
        placeholder="Duration (seconds)"
        value={duration}
        onChangeText={setDuration}
        keyboardType="numeric"
      />
      
      <CategorySelector
        selectedCategory={category}
        onSelectCategory={setCategory}
      />

      <Button 
        title="Add Timer" 
        onPress={handleSubmit}
        disabled={!name || !duration || !category}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: 'white',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 15,
    marginBottom: 10,
    borderRadius: 5,
    fontSize: 16,
  },
});
