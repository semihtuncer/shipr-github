import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { getCountryCallingCode, AsYouType } from "libphonenumber-js";
import { CountryPicker } from "react-native-country-codes-picker";

export default function PhoneInput({ setPhone }) {
  const [dialCode, setDialCode] = useState("+90");
  const [isoCode, setIsoCode] = useState("TR");
  const [phoneNum, setPhoneNum] = useState("");
  const [showPicker, setShowPicker] = useState(false);

  const getFlagEmoji = (countryCode) => {
    const codePoints = countryCode
      .toUpperCase()
      .split("")
      .map((char) => 127397 + char.charCodeAt());
    return String.fromCodePoint(...codePoints);
  };

  const handleCountryCodePress = () => {
    setShowPicker(true);
  };

  useEffect(() => {
    setPhone(dialCode + phoneNum);
  }, [phoneNum]);

  return (
    <View style={styles.main}>
      <CountryPicker
        style={{
          modal: {
            height: 600,
          },
        }}
        show={showPicker}
        pickerButtonOnPress={(item) => {
          setIsoCode(item.code);
          setDialCode(item.dial_code);
          setShowPicker(false);
        }}
        searchMessage={"Not an existing country!"}
        onBackdropPress={() => setShowPicker(false)}
      />
      <TouchableOpacity
        style={styles.areaCode}
        onPress={handleCountryCodePress}
      >
        <Text style={styles.areaEmoji}>{getFlagEmoji(isoCode)}</Text>
        <Text style={styles.areaLabel}>{dialCode}</Text>
      </TouchableOpacity>
      <View style={styles.phoneNum}>
        <TextInput
          autoFocus
          style={styles.input}
          keyboardType="phone-pad"
          selectionColor={"whitesmoke"}
          value={phoneNum}
          autoComplete="tel"
          onChangeText={(val) => {
            setPhoneNum(new AsYouType(isoCode).input(val));
          }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  main: {
    width: 375,
    height: 75,
    marginTop: 25,
    display: "flex",
    alignItems: "center",
    flexDirection: "row",
  },
  areaCode: {
    flex: 1,
    borderWidth: 2,
    borderStyle: "solid",
    borderColor: "rgba(255,255,255,0.45)",
    borderRadius: 10,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-evenly",
    flexDirection: "row",
    paddingVertical: 10,
    paddingHorizontal: 8,
    marginRight: 10,
  },
  phoneNum: {
    flex: 5,
  },
  areaEmoji: {
    fontSize: 22,
  },
  areaLabel: {
    fontSize: 15,
    color: "whitesmoke",
    fontWeight: "700",
    marginLeft: 5,
  },
  input: {
    height: "100%",
    fontSize: 32,
    color: "whitesmoke",
    fontWeight: "700",
    marginLeft: 5,
  },
});
