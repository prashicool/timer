import React, { useContext, useState, useEffect } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
    Modal,
    Animated,
} from 'react-native';
import { TimerContext } from '../context/TimerContext';

const AnimatedProgressBar = ({ progress, duration }) => {
    const animatedWidth = React.useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.timing(animatedWidth, {
            toValue: progress,
            duration: 1000, // Animation time
            useNativeDriver: false,
        }).start();
    }, [animatedWidth, progress]);

    return (
        <View style={styles.progressBar}>
            <Animated.View
                style={[
                    styles.progressFill,
                    {
                        width: animatedWidth.interpolate({
                            inputRange: [0, 100],
                            outputRange: ['0%', '100%'],
                        }),
                    }
                ]}
            />
        </View>
    );
};

export default function TimerList({ navigation }) {
    const {
        timers,
        startTimer,
        pauseTimer,
        resetTimer,
        updateTimer,
        startCategoryTimers,
        pauseCategoryTimers,
        resetCategoryTimers,
    } = useContext(TimerContext);
    const [expandedCategories, setExpandedCategories] = useState([]);
    const [completedTimer, setCompletedTimer] = useState(null);

    // category timers Group
    const timersByCategory = timers.reduce((acc, timer) => {
        if (!acc[timer.category]) {
            acc[timer.category] = [];
        }
        acc[timer.category].push(timer);
        return acc;
    }, {});

    const toggleCategory = (category) => {
        setExpandedCategories(prev =>
            prev.includes(category)
                ? prev.filter(c => c !== category)
                : [...prev, category]
        );
    };

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity
                style={styles.addButton}
                onPress={() => navigation.navigate('Add Timer')}
            >
                <Text style={styles.addButtonText}>Add Timer</Text>
            </TouchableOpacity>

            <ScrollView showsVerticalScrollIndicator={false}>
                {Object.entries(timersByCategory).map(([category, categoryTimers]) => (
                    <View key={category} style={styles.categoryContainer}>
                        <TouchableOpacity
                            style={styles.categoryHeader}
                            onPress={() => toggleCategory(category)}
                        >
                            <Text style={styles.categoryTitle}>{category}</Text>
                            <View style={styles.categoryActions}>
                                <TouchableOpacity
                                    style={[styles.categoryActionButton, styles.startAllButton]}
                                    onPress={() => startCategoryTimers(category)}
                                >
                                    <Text style={styles.categoryActionText}>Start All</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={[styles.categoryActionButton, styles.pauseAllButton]}
                                    onPress={() => pauseCategoryTimers(category)}
                                >
                                    <Text style={styles.categoryActionText}>Pause All</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={[styles.categoryActionButton, styles.resetAllButton]}
                                    onPress={() => resetCategoryTimers(category)}
                                >
                                    <Text style={styles.categoryActionText}>Reset All</Text>
                                </TouchableOpacity>
                            </View>
                        </TouchableOpacity>

                        {expandedCategories.includes(category) && (
                            <View style={styles.timersList}>
                                {categoryTimers.map((timer) => (
                                    <View key={timer.id} style={styles.timerItem}>
                                        <Text style={styles.timerName}>{timer.name}</Text>
                                        <Text style={styles.timerTime}>
                                            {formatTime(timer.remainingTime)}
                                        </Text>

                                        <AnimatedProgressBar
                                            progress={timer.progress}
                                            duration={timer.duration}
                                        />

                                        <View style={styles.controls}>
                                            {timer.status !== 'completed' && (
                                                <>
                                                    {timer.status !== 'running' && (
                                                        <TouchableOpacity
                                                            style={[styles.controlButton, styles.startButton]}
                                                            onPress={() => startTimer(timer.id)}
                                                        >
                                                            <Text style={styles.controlButtonText}>Start</Text>
                                                        </TouchableOpacity>
                                                    )}
                                                    {timer.status === 'running' && (
                                                        <TouchableOpacity
                                                            style={[styles.controlButton, styles.pauseButton]}
                                                            onPress={() => pauseTimer(timer.id)}
                                                        >
                                                            <Text style={styles.controlButtonText}>Pause</Text>
                                                        </TouchableOpacity>
                                                    )}
                                                    <TouchableOpacity
                                                        style={[styles.controlButton, styles.resetButton]}
                                                        onPress={() => resetTimer(timer.id)}
                                                    >
                                                        <Text style={styles.controlButtonText}>Reset</Text>
                                                    </TouchableOpacity>
                                                </>
                                            )}
                                            <Text
                                                style={[
                                                    styles.status,
                                                    timer.status === 'completed' && styles.completedStatus,
                                                    timer.status === 'running' && styles.runningStatus,
                                                    timer.status === 'paused' && styles.pausedStatus,
                                                ]}
                                            >
                                                {timer.status}
                                            </Text>
                                        </View>
                                    </View>
                                ))}
                            </View>
                        )}
                    </View>
                ))}
            </ScrollView>


            <Modal
                visible={!!completedTimer}
                transparent
                animationType="fade"
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Timer Completed!</Text>
                        <Text style={styles.modalText}>
                            Congratulations! {completedTimer?.name} has finished.
                        </Text>
                        <TouchableOpacity
                            style={styles.modalButton}
                            onPress={() => setCompletedTimer(null)}
                        >
                            <Text style={styles.modalButtonText}>OK</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
        backgroundColor: '#fff',
    },
    addButton: {
        backgroundColor: '#000',
        padding: 15,
        borderRadius: 10,
        marginBottom: 10,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    addButtonText: {
        color: 'white',
        textAlign: 'center',
        fontSize: 16,
        fontWeight: '600',
    },
    categoryContainer: {
        marginVertical: 8,
        marginBottom: 15,
        borderRadius: 4,
        backgroundColor: 'white',
        borderWidth: 1,
        borderColor: "#000"
    },
    categoryHeader: {
        padding: 15,
        flexDirection: 'column',
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    categoryTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    categoryActions: {
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
    categoryActionButton: {
        padding: 10,
        borderRadius: 10,
        backgroundColor: '#5dd669',
    },
    categoryActionText: {
        color: '#000',
        fontSize: 14,
        fontWeight: '500',
    },
    startAllButton: {
        backgroundColor: '#5dd669',
    },
    pauseAllButton: {
        backgroundColor: '#f4bb53',
    },
    resetAllButton: {
        backgroundColor: '#e6a4fc',
    },
    timersList: {
        padding: 15,
    },
    timerItem: {
        backgroundColor: '#F6F6F9',
        padding: 15,
        marginBottom: 10,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#eee',
    },
    timerName: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 5,
        color: "#8b8b8b"
    },
    timerTime: {
        fontSize: 14,
        color: '#666',
        marginBottom: 10,
    },
    progressBar: {
        height: 6,
        backgroundColor: '#f0f0f0',
        borderRadius: 3,
        marginVertical: 10,
        overflow: 'hidden',
    },
    progressFill: {
        height: '100%',
        backgroundColor: '#007AFF',
        borderRadius: 3,
    },
    controls: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        marginTop: 10,
        gap: 10,
    },
    controlButton: {
        paddingHorizontal: 15,
        paddingVertical: 8,
        borderRadius: 10,
        marginRight: 10,
    },
    startButton: {
        backgroundColor: '#5dd669',
    },
    pauseButton: {
        backgroundColor: '#f4bb53',
    },
    resetButton: {
        backgroundColor: '#e6a4fc',
    },
    controlButtonText: {
        color: 'white',
        fontWeight: '500',
    },
    status: {
        textTransform: 'capitalize',
        fontSize: 14,
        fontWeight: '500',
    },
    completedStatus: {
        color: '#4CD964',
    },
    runningStatus: {
        color: '#007AFF',
    },
    pausedStatus: {
        color: '#FF9500',
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modalContent: {
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 15,
        width: '80%',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    modalText: {
        fontSize: 16,
        marginBottom: 20,
        textAlign: 'center',
        color: '#666',
    },
    modalButton: {
        backgroundColor: '#007AFF',
        padding: 12,
        borderRadius: 8,
        width: '50%',
    },
    modalButtonText: {
        color: 'white',
        textAlign: 'center',
        fontSize: 16,
        fontWeight: '600',
    },
});