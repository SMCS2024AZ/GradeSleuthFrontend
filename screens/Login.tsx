
import React, { useEffect, useState, useCallback } from "react";
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from "react-native";
import Modal from "react-native-modal";
import DropDownPicker from "react-native-dropdown-picker";
import { useNavigation } from "@react-navigation/native";
import * as Font from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { Roboto_400Regular, Roboto_700Bold } from "@expo-google-fonts/roboto";

SplashScreen.preventAutoHideAsync();

const Login = () => {
    // Navigation
    const navigation = useNavigation();

    // Login
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    // District modal
    const [showDistrictSelection, setShowDistrictSelection] = useState(false);
    const [zipcode, setZipcode] = useState("");
    const [district, setDistrict] = useState("Montgomery County Public Schools");
    const [districtDropdownOpen, setDistrictDropdownOpen] = useState(false);
    const [districtList, setDistrictList] = useState([
        {label: "Montgomery County Public Schools", value: "Montgomery County Public Schools"},
        {label: "Other School District", value: "Other School District"}
    ]);

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

    return (
        <View style={styles.container} onLayout={onLayout}>
            <Text style={styles.title}>GradeSleuth Login</Text>
            <View style={styles.inputView}>
                <TextInput
                    style={styles.TextInput}
                    placeholder="Username"
                    placeholderTextColor="#657195"
                    onChangeText={(username) => setUsername(username)}
                />
            </View>
            <View style={styles.inputView}>
                <TextInput
                    style={styles.TextInput}
                    placeholder="Password"
                    placeholderTextColor="#657195"
                    secureTextEntry={true}
                    onChangeText={(password) => setPassword(password)}
                />
            </View>
            <Modal
                isVisible={showDistrictSelection}
                hasBackdrop={true}
                backdropColor="black"
                backdropOpacity={0.75}
            >
                <View style={styles.centeredView}>
                    <View style={styles.districtSelection}>
                        <View style={styles.zipcodeView}>
                            <View style={styles.zipcodeInput}>
                                <TextInput
                                    style={styles.TextInput}
                                    placeholder="Zip code"
                                    placeholderTextColor="#657195"
                                    onChangeText={(zipcode) => setZipcode(zipcode)}
                                />
                            </View>
                            <TouchableOpacity style={[styles.zipcodeButton]}>
                                <Text style={styles.buttonText}>Search</Text>
                            </TouchableOpacity>
                        </View>
                        <DropDownPicker
                            open={districtDropdownOpen}
                            value={district}
                            items={districtList}
                            setOpen={setDistrictDropdownOpen}
                            setValue={setDistrict}
                            setItems={setDistrictList}
                            theme="DARK"
                            style={{
                                backgroundColor: "#191C23",
                                borderColor: "#191C23"
                            }}
                            textStyle={{
                                color: "#EEEFF0"
                            }}
                            dropDownContainerStyle={{
                                backgroundColor: "#191C23",
                                borderTopColor: "#657195",
                                borderBottomColor: "#191C23",
                                borderLeftColor: "#191C23",
                                borderRightColor: "#191C23"
                            }}
                            listItemLabelStyle={{
                                marginTop: 6
                            }}
                        />
                        <TouchableOpacity style={[styles.closeDistrictSelectionButton]} onPress={() => setShowDistrictSelection(false)}>
                            <Text style={styles.buttonText}>Done</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
            <TouchableOpacity style={[styles.districtButton, styles.button]} onPress={() => setShowDistrictSelection(true)}>
                <Text style={styles.buttonText}>{district}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.loginButton, styles.button]}>
                <Text style={styles.buttonText}>Login</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#000513",
        alignItems: "center",
        justifyContent: "center",
    },
    title: {
        color: "#EEEFF0",
        fontFamily: "Roboto_700Bold",
        fontSize: 26,
        margin: 10
    },
    inputView: {
        backgroundColor: "#191C23",
        borderRadius: 5,
        width: "70%",
        height: 45,
        margin: 5
    },
    TextInput: {
        height: 50,
        flex: 1,
        padding: 10,
        fontFamily: "Roboto_400Regular",
        color: "#EEEFF0"
    },
    button: {
        borderRadius: 5,
        width: "70%",
        height: 45,
        margin: 5,
        alignItems: "center",
        justifyContent: "center"
    },
    districtButton: {
        backgroundColor: "#657195"
    },
    loginButton: {
        backgroundColor: "#1C52D9"
    },
    buttonText: {
        fontFamily: "Roboto_700Bold",
        color: "#EEEFF0"
    },
    centeredView: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        marginVertical: 200
    },
    districtSelection: {
        backgroundColor: "#000513",
        padding: 30,
        borderRadius: 15,
    },
    zipcodeView: {
        display: "flex",
        flexDirection: "row",
        marginBottom: 10
    },
    zipcodeInput: {
        backgroundColor: "#191C23",
        borderRadius: 5,
        width: "65%",
        height: 45,
        marginRight: 5
    },
    zipcodeButton: {
        backgroundColor: "#1C52D9",
        borderRadius: 5,
        width: "30%",
        alignItems: "center",
        justifyContent: "center",
        flexGrow: 1,
        height: 45
    },
    closeDistrictSelectionButton: {
        borderRadius: 5,
        height: 45,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#1C52D9",
        marginTop: 10
    }
});

export default Login;
