// import React, { useEffect, useRef, useState } from "react";
// import {
//   Keyboard,
//   StyleSheet,
//   TouchableWithoutFeedback,
//   View,
//   Text,
//   TextInput,
// } from "react-native";
// import PhoneInput from "react-native-phone-number-input";
// import Animated, {
//   useSharedValue,
//   withSpring,
//   useAnimatedStyle,
// } from "react-native-reanimated";
// import BirthdayPicker from "../components/BirthdayPicker";

// export default function LogInPage({ setChange }) {
//   const phoneInput = useRef(null);
//   const [phoneNum, setPhoneNum] = useState("");
//   const [pressed, setPressed] = useState(false);
//   const [name, setName] = useState("");
//   const [surname, setSurname] = useState("");
//   const [warningText, setWarning] = useState("");
//   const [date, setDate] = useState(null);

//   const continueButtonWidth = useSharedValue(200);
//   const continueButtonHeight = useSharedValue(70);
//   const continueButtonOpacity = useSharedValue(1);
//   const warningOpacity = useSharedValue(0);

//   const capitalizeString = (val) => {
//     if (val === undefined) return "";

//     str = val.split(" ");
//     for (var i = 0; i < str.length; i++) {
//       if (str[i][0] !== undefined)
//         str[i] = str[i][0].toUpperCase() + str[i].substring(1);
//     }
//     return str.join(" ");
//   };

//   const animatedContinueButton = useAnimatedStyle(() => ({
//     width: withSpring(continueButtonWidth.value, { duration: 3000 }),
//     height: withSpring(continueButtonHeight.value, { duration: 3000 }),
//     opacity: withSpring(continueButtonOpacity.value),
//     bottom: pressed ? 0 : 60,
//   }));

//   const animatedWarning = useAnimatedStyle(() => ({
//     opacity: withSpring(warningOpacity.value, { duration: 1000 }),
//   }));
//   const onPressed = () => {
//     setSurname(surname.charAt(0).toUpperCase() + surname.substring(1));
//     const phoneValid = phoneInput.current?.isValidNumber(phoneNum);
//     if (!phoneValid) setWarning("PHONE NUMBER NOT VALID!");
//     const surnameValid = surname.length > 0;
//     if (!surnameValid) setWarning("SURNAME NOT VALID!");
//     const nameValid = name.length > 0;
//     if (!nameValid) setWarning("NAME NOT VALID!");
//     const age = new Date().getFullYear() - date.getFullYear();
//     const dateValid = age >= 18 && age <= 99;
//     if (!dateValid) setWarning("YOUR AGE DOES NOT FIT!");

//     warningOpacity.value = 1;
//     setTimeout(() => {
//       warningOpacity.value = 0;
//     }, 2000);

//     if (!pressed) {
//       if (phoneValid && nameValid && surnameValid && dateValid) {
//         setPressed(true);
//         continueButtonWidth.value = 1000;
//         continueButtonHeight.value = 1000;
//         setTimeout(() => {
//           setChange(true);
//         }, 3000);
//       }
//       continueButtonOpacity.value = 1;
//     }
//   };

//   useEffect(() => {
//     continueButtonHeight.value = 70;
//     continueButtonWidth.value = 200;
//     continueButtonOpacity.value = 1;
//   }, []);

//   return (
//     <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
//       <View style={styles.container}>
//         <View style={styles.topBar}>
//           <View
//             style={{
//               position: "absolute",
//               backgroundColor: "#ff85ea",
//               height: 200,
//               width: "100%",
//             }}
//           ></View>
//           <Text style={styles.title}>Welcome to SHIP</Text>
//         </View>
//         <View style={styles.logInContainer}>
//           <View style={styles.nameContainer}>
//             <View style={{ flex: 1 }}>
//               <Text
//                 style={{
//                   color: "white",
//                   width: "82%",
//                   fontWeight: "400",
//                   marginLeft: 15,
//                   marginTop: 25,
//                 }}
//               >
//                 Name:
//               </Text>
//               <TextInput
//                 style={styles.nameInputStyle}
//                 placeholder="Name"
//                 value={name}
//                 onChangeText={(val) => {
//                   const n = capitalizeString(val);
//                   setName(n);
//                 }}
//                 keyboardType="name-phone-pad"
//                 maxLength={10}
//                 placeholderTextColor={"#00000036"}
//               />
//             </View>
//             <View style={{ flex: 1, marginLeft: 15 }}>
//               <Text
//                 style={{
//                   color: "white",
//                   width: "82%",
//                   fontWeight: "400",
//                   marginTop: 25,
//                   marginLeft: 15,
//                 }}
//               >
//                 Surname:
//               </Text>
//               <TextInput
//                 style={styles.nameInputStyle}
//                 placeholder="Surname"
//                 value={surname}
//                 onChangeText={(val) => {
//                   const n = capitalizeString(val);
//                   setSurname(n);
//                 }}
//                 keyboardType="name-phone-pad"
//                 placeholderTextColor={"#00000036"}
//                 maxLength={15}
//               />
//             </View>
//           </View>

//           <Text
//             style={{
//               color: "white",
//               width: "82%",
//               fontWeight: "400",
//               marginTop: 27,
//               marginBottom: -5,
//             }}
//           >
//             Enter phone:
//           </Text>
//           <PhoneInput
//             ref={phoneInput}
//             defaultValue={phoneNum}
//             defaultCode="TR"
//             layout="first"
//             onChangeFormattedText={(text) => {
//               setPhoneNum(text);
//             }}
//             withDarkTheme
//             autoFocus
//             containerStyle={styles.containerInput}
//             textContainerStyle={styles.textContainerStyle}
//             textInputStyle={styles.textInputStyle}
//           />
//           <Text
//             style={{
//               color: "white",
//               width: "82%",
//               fontWeight: "400",
//               marginTop: 27,
//               marginBottom: 2,
//             }}
//           >
//             Enter birthday:
//           </Text>
//           <BirthdayPicker setDate={setDate}></BirthdayPicker>
//         </View>
//         <Animated.Text
//           style={[
//             {
//               position: "absolute",
//               bottom: 0,
//               color: "#fff",
//               width: "100%",
//               textAlign: "center",
//               marginBottom: 140,
//               fontSize: 15,
//               fontWeight: "400",
//             },
//             animatedWarning,
//           ]}
//         >
//           {warningText}
//         </Animated.Text>
//         <Animated.View
//           style={[styles.button, animatedContinueButton]}
//           onTouchStart={() => {
//             if (!pressed) {
//               continueButtonOpacity.value = 0.6;
//             }
//           }}
//           onTouchEnd={onPressed}
//         >
//           {!pressed ? (
//             <Text
//               style={{
//                 color: "#fff",
//                 fontSize: 23,
//                 fontWeight: "500",
//               }}
//             >
//               CONTINUE
//             </Text>
//           ) : null}
//         </Animated.View>
//       </View>
//     </TouchableWithoutFeedback>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     height: "100%",
//     width: "100%",
//     backgroundColor: "#ff85ea",
//   },
//   nameContainer: {
//     width: "90%",
//     display: "flex",
//     justifyContent: "center",
//     flexDirection: "row",
//   },
//   topBar: {
//     height: 200,
//     display: "flex",
//     zIndex: -25,
//     alignItems: "center",
//   },
//   title: {
//     marginTop: 100,
//     width: "100%",
//     textAlign: "center",
//     color: "#fff",
//     fontWeight: "600",
//     fontSize: 35,
//   },
//   logInContainer: {
//     display: "flex",
//     width: "100%",
//     height: "100%",
//     alignItems: "center",
//     backgroundColor: "#080b10",
//     borderRadius: 30,
//   },
//   containerInput: {
//     borderRadius: 25,
//     width: "90%",
//     marginTop: 5,
//   },
//   textContainerStyle: {
//     borderRadius: 25,
//     height: 70,
//     backgroundColor: "#fff",
//     zIndex: 99,
//   },
//   textInputStyle: {
//     height: "190%",
//   },
//   nameInputStyle: {
//     padding: 25,
//     fontSize: 20,
//     height: 70,
//     backgroundColor: "#fff",
//     borderRadius: 25,
//   },
//   button: {
//     position: "absolute",
//     backgroundColor: "#ff85ea",
//     bottom: 60,
//     borderRadius: 25,
//     alignSelf: "center",
//     alignItems: "center",
//     justifyContent: "center",
//   },
// });
