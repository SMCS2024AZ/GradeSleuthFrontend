import React, { useEffect, useState, useCallback } from "react";
import { View, Text, StyleSheet, TouchableOpacity, FlatList, TextInput } from "react-native";
import * as Progress from "react-native-progress";
import DropDownPicker from "react-native-dropdown-picker";
import Modal from "react-native-modal";
import { useNavigation } from "@react-navigation/native";
import * as Font from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { Roboto_400Regular, Roboto_700Bold } from "@expo-google-fonts/roboto";
import { Ionicons } from "@expo/vector-icons"; 

SplashScreen.preventAutoHideAsync();

type AssignmentType = {
    assignmentName: string,
    category: string,
    score: number,
    maxScore: number
}

type AssignmentProps = {
    data: AssignmentType
};

function getGradeLetter(gradePercentage) {
    switch (true) {
        case gradePercentage >= 90:
            return "A";
        case gradePercentage >= 80:
            return "B";
        case gradePercentage >= 70:
            return "C";
        case gradePercentage >= 60:
            return "D";
        case gradePercentage < 60:
            return "E";
    }
}

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

function selectColorString(gradePercentage) {
    switch (true) {
        case gradePercentage >= 90:
            return "#00FF00";
        case gradePercentage >= 80:
            return "#4246FF";
        case gradePercentage >= 70:
            return "#FFFF00";
        case gradePercentage >= 60:
            return "#FF5A00";
        case gradePercentage < 60:
            return "#FF0000";
    }
}

function selectCategoryColor(category) {
    if (category === "All Tasks / Assessments") {
        return styles.allTasksColor;
    } else {
        return styles.practicePrepColor;
    }
}

const Assignment = (props: AssignmentProps) => {
    const gradePercentage = Math.round((props.data.score / props.data.maxScore) * 100);

    return (
        <TouchableOpacity style={styles.assignmentContainer}>
            <View style={styles.infoContainer}>
                <Text style={styles.assignmentName}>{props.data.assignmentName}</Text>
                <Text style={[styles.category, selectCategoryColor(props.data.category)]}>{props.data.category}</Text>
            </View>
            <View style={styles.gradeContainer}>
                <Text style={[styles.gradePoints, selectColor(gradePercentage)]}>{props.data.score}  /  {props.data.maxScore}</Text>
            </View>
            <View style={styles.percentageContainer}>
                <Text style={[styles.gradePercentage, selectColor(gradePercentage)]}>{gradePercentage}%</Text>
            </View>
        </TouchableOpacity>
    );
};

const Assignments = () => {
    // Navigation
    const navigation = useNavigation();

    // Assignments list
    const [assignmentList, setAssignmentList] = useState([
        { assignmentName: "Assignment Uno", category: "All Tasks / Assessments", score: 17, maxScore: 19 },
        { assignmentName: "Assignment Dos", category: "All Tasks / Assessments", score: 2, maxScore: 5 },
        { assignmentName: "Assignment Tres", category: "Practice / Preparation", score: 10, maxScore: 10 },
        { assignmentName: "Assignment Cuatro", category: "All Tasks / Assessments", score: 18, maxScore: 20 },
        { assignmentName: "Assignment Cinco", category: "All Tasks / Assessments", score: 31, maxScore: 32 },
        { assignmentName: "Assignment Seis", category: "Practice / Preparation", score: 9, maxScore: 15 },
        { assignmentName: "Assignment Siete", category: "All Tasks / Assessments", score: 30, maxScore: 40 },
        { assignmentName: "Assignment Ocho", category: "Practice / Preparation", score: 20, maxScore: 25 },
    ]);

    // Add Assignment Modal
    const [showAssignmentModal, setShowAssignmentModal] = useState(false);
    const [assignmentName, setAssignmentName] = useState("New Assignment");
    const [categoryDropdownOpen, setCategoryDropdownOpen] = useState(false);
    const [category, setCategory] = useState("All Tasks / Assessments");
    const [categoryList, setCategoryList] = useState([
        {label: "All Tasks / Assessments", value: "All Tasks / Assessments"},
        {label: "Practice / Preparation", value: "Practice / Preparation"}
    ]);
    const [assignmentScore, setAssignmentScore] = useState("0");
    const [assignmentMaxScore, setAssignmentMaxScore] = useState("0");

    function addAssignment(assignmentName, category, score, maxScore) {
        setAssignmentList(prev => {
            return [
                {
                    assignmentName: assignmentName,
                    category: category,
                    score: parseInt(score),
                    maxScore: parseInt(maxScore)
                },
                ...prev
            ];
        });

        setShowAssignmentModal(false);
    }

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

    // Grade data
    var overallGradeLetter = "";
    var overallGradePercentage = 0;

    var allTasksGradePercentage = 0;
    var allTasksScore = 0;
    var allTasksMaxScore = 0;

    var practicePrepGradePercentage = 0;
    var practicePrepScore = 0;
    var practicePrepMaxScore = 0;

    // Calculating
    assignmentList.forEach(item => {
        if (item.category === "All Tasks / Assessments") {
            allTasksScore += item.score;
            allTasksMaxScore += item.maxScore;
        } else {
            practicePrepScore += item.score;
            practicePrepMaxScore += item.maxScore;
        }
    })

    allTasksGradePercentage = Math.round(allTasksScore / allTasksMaxScore * 10000) / 100;
    practicePrepGradePercentage = Math.round(practicePrepScore / practicePrepMaxScore * 10000) / 100;

    overallGradePercentage = Math.round((allTasksGradePercentage * 0.9 + practicePrepGradePercentage * 0.1) * 100) / 100;
    overallGradeLetter = getGradeLetter(overallGradePercentage);

    return (
        <View style={styles.container} onLayout={onLayout}>
            <FlatList
                ListHeaderComponent={
                    <>
                        <View style={styles.classInfo}>
                            <Text style={styles.className}>Class Uno</Text>
                            <Text style={styles.teacherName}>Teacher Uno</Text>
                            <Text style={[styles.grade, selectColor(overallGradePercentage)]}>{overallGradeLetter} ({overallGradePercentage}%)</Text>
                        </View>
                        <View style={styles.circlesContainer}>
                            <View style={styles.allTasksContainer}>
                                <Progress.Circle
                                    animated={false}
                                    progress={allTasksGradePercentage / 100}
                                    size={80}
                                    thickness={5}
                                    borderColor="transparent"
                                    color={selectColorString(allTasksGradePercentage)}
                                    showsText={true}
                                    formatText={(progress) => {
                                        return allTasksGradePercentage + "%";
                                    }}
                                    textStyle={{
                                        fontFamily: "Roboto_700Bold"
                                    }}
                                />
                                <Text style={styles.circlesTitle}>All Tasks /{"\n"}Assessments</Text>
                                <Text style={[styles.circlesScore, selectColor(allTasksGradePercentage)]}>{allTasksScore} / {allTasksMaxScore}</Text>
                            </View>

                            <View style={styles.practicePrepContainer}>
                                <Progress.Circle
                                    animated={false}
                                    progress={practicePrepGradePercentage / 100}
                                    size={80}
                                    thickness={5}
                                    borderColor="transparent"
                                    color={selectColorString(practicePrepGradePercentage)}
                                    showsText={true}
                                    formatText={(progress) => {
                                        return practicePrepGradePercentage + "%";
                                    }}
                                    textStyle={{
                                        fontFamily: "Roboto_700Bold"
                                    }}
                                />
                                <Text style={styles.circlesTitle}>Practice /{"\n"}Preparation</Text>
                                <Text style={[styles.circlesScore, selectColor(practicePrepGradePercentage)]}>{practicePrepScore} / {practicePrepMaxScore}</Text>
                            </View>
                        </View>
                        <Modal
                            isVisible={showAssignmentModal}
                            hasBackdrop={true}
                            backdropColor="white"
                            backdropOpacity={0.75}
                        >
                            <View style={styles.centeredView}>
                                <View style={styles.assignmentNameContainer}>
                                    <Text style={styles.modalSectionTitle}>Assignment Name</Text>
                                    <View style={styles.assignmentNameInput}>
                                        <TextInput
                                            style={styles.TextInput}
                                            value={assignmentName}
                                            onChangeText={(assignmentName) => setAssignmentName(assignmentName)}
                                        />
                                    </View>
                                </View>
                                <View style={styles.categoryContainer}>
                                    <Text style={styles.modalSectionTitle}>Category</Text>
                                    <DropDownPicker
                                            open={categoryDropdownOpen}
                                            value={category}
                                            items={categoryList}
                                            setOpen={setCategoryDropdownOpen}
                                            setValue={setCategory}
                                            setItems={setCategoryList}
                                            theme="DARK"
                                            style={{
                                                backgroundColor: "#191C23",
                                                borderColor: "#191C23",
                                                width: "100%",
                                                minHeight: 35
                                            }}
                                            textStyle={{
                                                fontFamily: "Roboto_400Regular",
                                                color: "#EEEFF0"
                                            }}
                                            dropDownContainerStyle={{
                                                backgroundColor: "#191C23",
                                                borderTopColor: "#657195",
                                                borderBottomColor: "#191C23",
                                                borderLeftColor: "#191C23",
                                                borderRightColor: "#191C23",
                                                width: "100%",
                                            }}
                                            listItemContainerStyle={{
                                                height: 35
                                            }}
                                    />
                                </View>
                                <View style={styles.scoreContainer}>
                                    <Text style={styles.modalSectionTitle}>Score</Text>
                                    <View style={styles.scoreNumbers}>
                                        <View style={styles.score}>
                                            <TextInput
                                                style={styles.TextInput}
                                                keyboardType="numeric"
                                                value={assignmentScore}
                                                onChangeText={(assignmentScore) => setAssignmentScore(assignmentScore)}
                                            />
                                        </View>
                                        <Text style={styles.slash}> / </Text>
                                        <View style={styles.maxScore}>
                                            <TextInput
                                                style={styles.TextInput}
                                                keyboardType="numeric"
                                                value={assignmentMaxScore}
                                                onChangeText={(assignmentMaxScore) => setAssignmentMaxScore(assignmentMaxScore)}
                                            />
                                        </View>
                                    </View>
                                </View>
                                <View style={styles.buttonContainer}>
                                    <View style={styles.exitContainer}>
                                        <TouchableOpacity style={styles.cancelButton} onPress={() => setShowAssignmentModal(false)}>
                                            <Text style={styles.buttonText}>Cancel</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity style={styles.doneButton} onPress={() => addAssignment(assignmentName, category, assignmentScore, assignmentMaxScore)}>
                                            <Text style={styles.buttonText}>Done</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </View>
                        </Modal>

                        <View style={styles.assignmentsTitleContainer}>
                            <Text style={styles.assignmentsTitle}>Assignments</Text>
                            <TouchableOpacity style={styles.addAssignment} onPress={() => {
                                setAssignmentName("New Assignment")
                                setCategory("All Tasks / Assessments")
                                setAssignmentScore("0");
                                setAssignmentMaxScore("0");
                                setShowAssignmentModal(true);
                            }}>
                                <Text style={styles.addAssignmentText}>Add</Text>
                            </TouchableOpacity>
                        </View>
                    </>
                }
                data={assignmentList}
                renderItem={({ item, index }) => <Assignment data={item} />}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: "100%",
        backgroundColor: "#000513",
        alignItems: "center",
        paddingTop: 40
    },
    classInfo: {
        width: "100%",
        alignContent: "flex-start",
        paddingLeft: "5%"
    },
    className: {
        fontFamily: "Roboto_700Bold",
        fontSize: 20,
        color: "#EEEFF0"
    },
    teacherName: {
        fontFamily: "Roboto_400Regular",
        fontSize: 18,
        color: "#EEEFF0"
    },
    grade: {
        fontFamily: "Roboto_700Bold",
        fontSize: 20,
        color: "#EEEFF0"
    },
    circlesContainer: {
        flexDirection: "row",
        paddingVertical: 15,
    },
    allTasksContainer: {
        width: "47%",
        height: "100%",
        backgroundColor: "#0A1C49",
        borderRadius: 15,
        alignItems: "center",
        alignSelf: "flex-start",
        paddingVertical: 10,
        marginLeft: "2%",
        marginRight: "1%"
    },
    practicePrepContainer: {
        width: "47%",
        height: "100%",
        backgroundColor: "#0A1C49",
        borderRadius: 15,
        alignItems: "center",
        alignSelf: "flex-end",
        paddingVertical: 10,
        marginLeft: "1%",
        marginRight: "2%"
    },
    circlesTitle: {
        fontFamily: "Roboto_700Bold",
        textAlign: "center",
        fontSize: 14,
        color: "#EEEFF0",
        marginVertical: 5
    },
    circlesScore: {
        fontFamily: "Roboto_400Regular",
        fontSize: 14,
        color: "#EEEFF0"
    },
    centeredView: {
        flex: 1,
        alignItems: "flex-start",
        justifyContent: "center",
        marginVertical: 170,
        backgroundColor: "#000513",
        paddingLeft: "5%",
        borderRadius: 15,
    },
    assignmentNameContainer: {
        width: "95%",
        marginBottom: 10
    },
    modalSectionTitle: {
        color: "#EEEFF0",
        fontFamily: "Roboto_700Bold",
        fontSize: 16,
        marginBottom: 5
    },
    assignmentNameInput: {
        backgroundColor: "#191C23",
        borderRadius: 5,
        width: "100%",
        height: 35
    },
    categoryContainer: {
        zIndex: 2000,
        width: "95%",
        marginBottom: 10
    },
    scoreContainer: {
        zIndex: 1000,
        width: "95%",
        marginBottom: 14
    },
    scoreNumbers: {
        flexDirection: "row",
        alignItems: "center"
    },
    score: {
        backgroundColor: "#191C23",
        borderRadius: 5,
        width: 45,
        height: 35
    },
    slash: {
        fontFamily: "Roboto_400Regular",
        fontSize: 20,
        color: "#EEEFF0"
    },
    maxScore: {
        backgroundColor: "#191C23",
        borderRadius: 5,
        width: 45,
        height: 35
    },
    TextInput: {
        height: 50,
        flex: 1,
        padding: 10,
        fontFamily: "Roboto_400Regular",
        color: "#EEEFF0"
    },
    buttonContainer: {
        width: "95%",
        flexDirection: "row",
        justifyContent: "flex-end"
    },
    deleteButton: {
        borderRadius: 5,
        width: 45,
        backgroundColor: "#1C52D9",
        height: 40,
        alignItems: "center",
        justifyContent: "center"
    },
    buttonText: {
        fontFamily: "Roboto_700Bold",
        color: "#EEEFF0"
    },
    exitContainer: {
        flexDirection: "row"
    },
    cancelButton: {
        borderRadius: 5,
        backgroundColor: "#1C52D9",
        width: 70,
        height: 40,
        alignItems: "center",
        justifyContent: "center"
    },
    doneButton: {
        borderRadius: 5,
        backgroundColor: "#1C52D9",
        width: 70,
        height: 40,
        alignItems: "center",
        justifyContent: "center",
        marginLeft: 5
    },
    assignmentsTitleContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 10
    },
    assignmentsTitle: {
        fontFamily: "Roboto_700Bold",
        textDecorationLine: "underline",
        fontSize: 20,
        color: "#EEEFF0",
        paddingLeft: "5%"
    },
    addAssignment: {
        borderRadius: 5,
        width: 60,
        backgroundColor: "#1C52D9",
        height: 40,
        marginRight: "2%",
        alignItems: "center",
        justifyContent: "center"
    },
    addAssignmentText: {
        fontFamily: "Roboto_700Bold",
        color: "#EEEFF0"
    },
    assignmentContainer: {
        flex: 1,
        flexDirection: "row",
        height: 60,
        backgroundColor: "#0A1C49",
        margin: 2.5,
        borderRadius: 15,
        marginHorizontal: "2%"
    },
    infoContainer: {
        justifyContent: "center",
        alignContent: "center",
        width: "50%",
        marginHorizontal: 10
    },
    assignmentName: {
        fontFamily: "Roboto_400Regular",
        fontSize: 14,
        color: "#EEEFF0",
        textAlign: "center"
    },
    category: {
        fontFamily: "Roboto_400Regular",
        fontSize: 14,
        color: "#EEEFF0",
        textAlign: "center"
    },
    gradeContainer: {
        justifyContent: "center",
        alignItems: "center",
        width: "25%",
        marginRight: 10
    },
    gradePoints: {
        fontFamily: "Roboto_400Regular",
        fontSize: 16,
        color: "#EEEFF0",
        textAlign: "center"
    },
    percentageContainer: {
        justifyContent: "center"
    },
    gradePercentage: {
        fontFamily: "Roboto_700Bold",
        fontSize: 16,
        color: "#EEEFF0",
        textAlign: "center"
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
    },
    allTasksColor: {
        color: "#878aff"
    },
    practicePrepColor: {
        color: "#ff9359"
    }
});

export default Assignments;
