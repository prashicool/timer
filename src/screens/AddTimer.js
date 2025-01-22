import React, { useState, useContext } from 'react';
import { View, TextInput, StyleSheet, Text, KeyboardAvoidingView, TouchableOpacity } from 'react-native';
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
    <KeyboardAvoidingView style={styles.container} behavior="padding">
      <View style={styles.form}>
        <TextInput
          style={styles.input}
          placeholder="Timer Name"
           placeholderTextColor="black"
          value={name}
          onChangeText={setName}
        />

        <TextInput
          style={styles.input}
          placeholder="Duration (seconds)"
           placeholderTextColor="black"
          value={duration}
          onChangeText={setDuration}
          keyboardType="numeric"
        />

        <CategorySelector
          selectedCategory={category}
          onSelectCategory={setCategory}
        />
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[
            styles.button,
            (!name || !duration || !category) && styles.disabledButton,
          ]}
          onPress={handleSubmit}
          disabled={!name || !duration || !category}
        >
          <Text style={styles.buttonText}>Add Timer</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    justifyContent: 'space-between',
  },
  form: {
    flex: 1,
    padding: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 15,
    marginBottom: 10,
    borderRadius: 5,
    fontSize: 16,
    color:'#000',
  },
  buttonContainer: {
    padding: 20,
    backgroundColor: 'white',
  },
  button: {
    backgroundColor: 'black',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 8,
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
