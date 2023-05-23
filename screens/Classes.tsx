import React, { useEffect, useState, useCallback } from "react";
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from "react-native";
import Modal from "react-native-modal";
import { useNavigation } from "@react-navigation/native";
import * as Font from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { Roboto_400Regular, Roboto_700Bold } from "@expo-google-fonts/roboto";

SplashScreen.preventAutoHideAsync();

type ClassType = {
    period: number,
    className: string,
    teacher: string,
    gradeLetter: string,
    gradePercentage: number
}

type ClassProps = {
    data: ClassType
};

function selectColor(gradePercentage) {
    switch (true) {
        case gradePercentage >= 90:
            return styles.greenA;
        case gradePercentage >= 80:
            return styles.blueB;
        case gradePercentage >= 70:
            return styles.yellowC;
        case gradePercentage >= 60:
            return styles.orangeD;
        case gradePercentage < 60:
            return styles.redE;
    }
}

const Class = (props: ClassProps) => {
    return (
        <TouchableOpacity style={styles.classContainer}>
            <View style={styles.periodContainer}>
                <Text style={styles.period}>{props.data.period}</Text>
            </View>
            <View style={styles.namesContainer}>
                <Text style={styles.className}>{props.data.className}</Text>
                <Text style={styles.teacher}>{props.data.teacher}</Text>
            </View>
            <View style={styles.gradeContainer}>
                <Text style={[styles.gradeLetter, selectColor(props.data.gradePercentage)]}>{props.data.gradeLetter}</Text>
                <Text style={[styles.gradePercentage, selectColor(props.data.gradePercentage)]}>({props.data.gradePercentage}%)</Text>
            </View>
        </TouchableOpacity>
    );
};

const Classes = () => {
    // Navigation
    const navigation = useNavigation();

    // Load fonts
    const [fontLoaded, setFontLoaded] = useState(false);

    useEffect(() => {
        (async () => {
            try {
                await SplashScreen.preventAutoHideAsync();
                await Font.loadAsync({ Roboto_400Regular, Roboto_700Bold });
            }
            finally { setFontLoaded(true) }
        })();
    }, []);

    const onLayout = useCallback(() => {
        if (fontLoaded) {
            SplashScreen.hideAsync();
        }
    }, [fontLoaded]);

    if (!fontLoaded) {
        return null;
    }

    // Placeholder list of classes
    const classList = [
        { period: 1, className: "Class Uno", teacher: "Teacher Uno", gradeLetter: "A", gradePercentage: 100 },
        { period: 2, className: "Class Dos", teacher: "Teacher Dos", gradeLetter: "A", gradePercentage: 95 },
        { period: 3, className: "Class Tres", teacher: "Teacher Tres", gradeLetter: "B", gradePercentage: 87 },
        { period: 4, className: "Class Cuatro", teacher: "Teacher Cuatro", gradeLetter: "B", gradePercentage: 81 },
        { period: 5, className: "Class Cinco", teacher: "Teacher Cinco", gradeLetter: "C", gradePercentage: 75 },
        { period: 6, className: "Class Seis", teacher: "Teacher Seis", gradeLetter: "C", gradePercentage: 72 },
        { period: 7, className: "Class Siete", teacher: "Teacher Siete", gradeLetter: "D", gradePercentage: 65 },
        { period: 8, className: "Class Ocho", teacher: "Teacher Ocho", gradeLetter: "E", gradePercentage: 30 },

    ]

    return (
        <View style={styles.container} onLayout={onLayout}>
            <View style={styles.studentInfo}>
                <Text style={styles.studentName}>Student Name</Text>
                <Text style={styles.studentGPA}>GPA: 4.00</Text>
                <Text style={styles.studentQuarter}>MP4 Interim</Text>
            </View>
            <FlatList style={{ flex: 1 }}
                data={classList}
                renderItem={({ item, index }) => <Class data={item} />}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: "100%",
        backgroundColor: "#000513", //000513
        alignItems: "center",
        paddingTop: 40
    },
    studentInfo: {
        alignItems: "center",
        marginBottom: 15
    },
    studentName: {
        fontFamily: "Roboto_700Bold",
        fontSize: 20,
        color: "#EEEFF0"
    },
    studentGPA: {
        fontFamily: "Roboto_400Regular",
        fontSize: 15,
        color: "#EEEFF0"
    },
    studentQuarter: {
        fontFamily: "Roboto_400Regular",
        textDecorationLine: "underline",
        fontSize: 15,
        color: "#EEEFF0"
    },
    classContainer: {
        flex: 1,
        flexDirection: "row",
        height: 60,
        backgroundColor: "#0A1C49",
        margin: 2.5,
        borderRadius: 15
    },
    periodContainer: {
        justifyContent: "center",
        alignItems: "center",
        width: "15%"
    },
    period: {
        fontFamily: "Roboto_700Bold",
        fontSize: 24,
        color: "#EEEFF0"
    },
    namesContainer: {
        justifyContent: "center",
        alignContent: "flex-start",
        width: "56%"
    },
    className: {
        fontFamily: "Roboto_700Bold",
        fontSize: 16,
        color: "#EEEFF0"
    },
    teacher: {
        fontFamily: "Roboto_400Regular",
        fontSize: 14,
        color: "#EEEFF0"
    },
    gradeContainer: {
        flex: 1,
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 15
    },
    gradeLetter: {
        fontFamily: "Roboto_700Bold",
        fontSize: 24,
        marginLeft: 10,
        marginRight: 5
    },
    gradePercentage: {
        fontFamily: "Roboto_400Regular",
        fontSize: 14,
        marginRight: 10
    },
    greenA: {
        color: "#00FF00"
    },
    blueB: {
        color: "#4246FF"
    },
    yellowC: {
        color: "#FFFF00"
    },
    orangeD: {
        color: "#FF5A00"
    },
    redE: {
        color: "#FF0000"
    }
});

export default Classes;
