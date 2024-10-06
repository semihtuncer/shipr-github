import React, { useEffect, useState } from "react";
import { View } from "react-native";
import LogInPage from "../pages/LoginPage";
import PhoneNumberPage from "../pages/PhoneNumberPage";
import OTPPage from "../pages/OTPPage";
import UsernamePage from "../pages/UsernamePage";
import BirthdayPage from "../pages/BirthdayPage";
import InterestsPage from "../pages/InterestsPage";
import PhotoPage from "../pages/PhotoPage";
import GenderPage from "../pages/GenderPage";

export default function LogInStack({ navigation }) {
  const [page, setPage] = useState("PHONENUM");

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      setPage("PHONENUM");
    });

    return unsubscribe;
  }, [navigation]);

  return (
    <View>
      {page === "PHONENUM" && (
        <PhoneNumberPage
          setPage={setPage}
          page={page}
          navigation={navigation}
        ></PhoneNumberPage>
      )}
      {page === "OTP" && (
        <OTPPage
          setPage={setPage}
          page={page}
          navigation={navigation}
        ></OTPPage>
      )}
      {page === "USERNAME" && (
        <UsernamePage setPage={setPage} page={page}></UsernamePage>
      )}
      {page === "GENDER" && (
        <GenderPage setPage={setPage} page={page}></GenderPage>
      )}
      {page === "BIRTHDAY" && (
        <BirthdayPage setPage={setPage} page={page}></BirthdayPage>
      )}
      {page === "INTERESTS" && (
        <InterestsPage setPage={setPage} page={page}></InterestsPage>
      )}
      {page === "PHOTO" && (
        <PhotoPage
          setPage={setPage}
          page={page}
          navigation={navigation}
        ></PhotoPage>
      )}
    </View>
  );
}
