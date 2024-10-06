import React, { createContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import * as Location from "expo-location";

export const UserContext = createContext({});

export function UserContextProvider({ children }) {
  const [user, setUser] = useState(null);
  const [registeryUser, setRegisteryUser] = useState({});
  const [registeryToken, setRegisteryToken] = useState(null);

  const [swipeOnShip, setSwipeOnShip] = useState(true);

  const host = "http://192.168.68.103:5000/api/";
  const config = {
    headers: { token: `Bearer ${user ? user.accessToken : ""}` },
  };

  const getLocation = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();

    if (status !== "granted") {
      return;
    }

    let l = await Location.getCurrentPositionAsync({});
    axios
      .get(
        `http://api.geonames.org/findNearbyJSON?lat=${l.coords.latitude}&lng=${l.coords.longitude}&username=semihtuncher`
      )
      .then((res) => {
        const a = res.data.geonames[0];
        // a.toponymName + ", " +
        const loc = a.adminName1 + ", " + a.countryName;

        axios
          .post(
            host + "user/set_location/" + user._id,
            { location: loc },
            config
          )
          .then((result) => {
            if (result.status === 200) {
              setUser(result.data);
              saveUserLocal(result.data);
            }
          });
      });
  };

  const saveUserLocal = async (user) => {
    await AsyncStorage.setItem("user", JSON.stringify(user));
  };
  const getUserLocal = async () => {
    const a = await AsyncStorage.getItem("user");
    const jsonA = JSON.parse(a);
    return jsonA;
  };

  return (
    <UserContext.Provider
      value={{
        user,
        setUser,
        host,
        config,
        setRegisteryUser,
        registeryUser,
        setRegisteryToken,
        registeryToken,
        saveUserLocal,
        getUserLocal,
        getLocation,
        setSwipeOnShip,
        swipeOnShip,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}
