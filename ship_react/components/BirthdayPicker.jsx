// import React, { useEffect, useState } from "react";
// import { View, StyleSheet, Text } from "react-native";
// import DateTimePickerModal from "react-native-modal-datetime-picker";

// export default function BirthdayPicker({ setDate }) {
//   const [lastDate, setLastDate] = useState(null);
//   const [day, setDay] = useState(0);
//   const [month, setMonth] = useState(0);
//   const [monthName, setMonthName] = useState("June");
//   const [year, setYear] = useState(0);
//   const [datePickerVisible, setDatePickerVisible] = useState(false);

//   useEffect(() => {
//     const months = [
//       "January",
//       "February",
//       "March",
//       "April",
//       "May",
//       "June",
//       "July",
//       "August",
//       "September",
//       "October",
//       "November",
//       "December",
//     ];
//     setMonthName(month === -1 ? "Month" : months[month]);
//   }, [month]);

//   useEffect(() => {
//     setDate(new Date(year, month, day));
//   }, [month, day, year]);

//   useEffect(() => {
//     const lb = lastBirthday();
//     setLastDate(lb);
//   }, []);

//   const lastBirthday = () => {
//     const lastYear = new Date();
//     lastYear.setFullYear(lastYear.getFullYear() - 18);
//     return lastYear;
//   };
//   return (
//     <View style={styles.mainContainer}>
//       <View
//         style={styles.dayContainer}
//         onTouchEnd={() => setDatePickerVisible(true)}
//       >
//         <Text style={styles.pickerItem}>{day === 0 ? "Day" : day - 1}</Text>
//       </View>
//       <View
//         style={styles.monthContainer}
//         onTouchEnd={() => setDatePickerVisible(true)}
//       >
//         <Text style={styles.pickerItem}>{monthName}</Text>
//       </View>
//       <View
//         style={styles.yearContainer}
//         onTouchEnd={() => setDatePickerVisible(true)}
//       >
//         <Text style={styles.pickerItem}>{year === 0 ? "Year" : year}</Text>
//       </View>
//       <DateTimePickerModal
//         maximumDate={lastDate}
//         isVisible={datePickerVisible}
//         mode="date"
//         date={new Date(year === 0 ? 2001 : year, month, day)}
//         onConfirm={(date) => {
//           setDay(date.getDate());
//           setMonth(date.getMonth());
//           setYear(date.getFullYear());
//           setDatePickerVisible(false);
//         }}
//         onCancel={() => {
//           setDatePickerVisible(false);
//         }}
//       />
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   mainContainer: {
//     display: "flex",
//     width: "90%",
//     height: 70,
//     alignItems: "center",
//     flexDirection: "row",
//   },
//   dayContainer: {
//     width: "30%",
//     height: 70,
//     flex: 1,
//     borderRadius: 25,
//     backgroundColor: "#fff",
//     display: "flex",
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   monthContainer: {
//     width: "30%",
//     height: 70,
//     margin: 10,
//     flex: 1,
//     borderRadius: 25,
//     backgroundColor: "#fff",
//     display: "flex",
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   yearContainer: {
//     width: "30%",
//     height: 70,
//     flex: 1,
//     borderRadius: 25,
//     backgroundColor: "#fff",
//     display: "flex",
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   pickerItem: {
//     color: "#080b10",
//     fontSize: 24,
//     fontWeight: "400",
//   },
// });
