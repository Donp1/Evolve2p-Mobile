import {
  Keyboard,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import React, { useState } from "react";
import { router } from "expo-router";
import { FontAwesome } from "@expo/vector-icons";
import { setItemAsync } from "expo-secure-store";

import { colors } from "@/constants";
import StepOne from "@/components/createAccount/stepone";
import StepTwo from "@/components/createAccount/steptwo";
import StepThree from "@/components/createAccount/stepthree";
import StepFour from "@/components/createAccount/stepfour";
import { DataProp } from "@/components/SelectDropdown";
import { checkToken, createUser, getUser } from "@/utils/countryStore";
import StepFive from "@/components/createAccount/stepfive";
import StepSix from "@/components/createAccount/stepsix";
import { useAlert } from "@/components/AlertService";

const Register = () => {
  const goBack = () => {
    if (router.canGoBack()) router.back();
  };

  const MAX_STEP = 6;
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [stepCount, setStepCount] = useState(1);
  const [selectedCountry, setSelectedCountry] = useState<DataProp | null>(null);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [username, setUsername] = useState("");
  const [regIsLoading, setRegIsLoading] = useState(false);

  const { AlertComponent, showAlert } = useAlert();

  const handlFinalRegistration = async () => {
    setRegIsLoading(true);
    try {
      const res = await createUser({
        email,
        password,
        country: selectedCountry?.name,
        phone: phoneNumber,
        username,
      });
      setRegIsLoading(false);
      if (res?.success) {
        const tokenData = await checkToken(res?.accessToken);
        const parsedUser = await getUser(tokenData?.user?.email);
        await setItemAsync(
          "authToken",
          JSON.stringify({ token: res?.accessToken, user: parsedUser.user })
        );

        showAlert(
          "Congratulations!!!",
          "User registered successfully",
          [{ text: "Next", onPress: () => setStepCount((c) => c + 1) }],
          "success"
        );
        return;
      }

      if (res?.error) {
        showAlert(
          "Error",
          res?.message,
          [{ text: "Next", onPress() {} }],
          "error"
        );
        return;
      }
    } catch (error) {
      showAlert(
        "Error",
        String(error),
        [{ text: "Next", onPress() {} }],
        "error"
      );
      setRegIsLoading(false);
    } finally {
      setRegIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {AlertComponent}
      <View style={styles.topBar}>
        <Pressable onPress={goBack} style={{ padding: 15 }}>
          <FontAwesome name="chevron-left" color={colors.secondary} size={15} />
        </Pressable>
        <View
          style={{
            backgroundColor: colors.gray2,
            borderRadius: 100,
            paddingHorizontal: 15,
            paddingVertical: 5,
            marginHorizontal: 10,
          }}
        >
          <Text style={{ color: colors.secondary, fontWeight: 600 }}>
            Step {stepCount} of {MAX_STEP}
          </Text>
        </View>
      </View>

      {stepCount === 1 && (
        <StepOne
          isReset={false}
          setStepCount={setStepCount}
          setEmail={setEmail}
          email={email}
        />
      )}
      {stepCount === 2 && (
        <StepTwo
          password={password}
          setPassword={setPassword}
          confirmPassword={confirmPassword}
          setConfirmPassword={setConfirmPassword}
          setStepCount={setStepCount}
          email={email}
          isReset={false}
        />
      )}
      {stepCount === 3 && (
        <StepThree isReset={false} email={email} setStepCount={setStepCount} />
      )}
      {stepCount === 4 && (
        <StepFour
          selectedCountry={selectedCountry}
          setSelectedCountry={setSelectedCountry}
          setStepCount={setStepCount}
          phoneNumber={phoneNumber}
          setPhoneNumber={setPhoneNumber}
          username={username}
          setUsername={setUsername}
          handlFinalRegistration={handlFinalRegistration}
          regIsLoading={regIsLoading}
          setRegIsLoading={setRegIsLoading}
        />
      )}

      {stepCount === 5 && <StepFive setStepCount={setStepCount} />}
      {stepCount === 6 && <StepSix />}
    </SafeAreaView>
  );
};

export default Register;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primary,
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  topBar: {
    width: "100%",
    height: "auto",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#1a1a1a",
    flexDirection: "row",
  },
});
