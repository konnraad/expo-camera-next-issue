import {
  Image,
  StyleSheet,
  Text,
  View,
  Alert,
  TextInput,
  Button,
  ImageBackground,
  TouchableOpacity,
  Share,
  Pressable,
  Modal,
  ActivityIndicator,
  StatusBar,
  SafeAreaView,
} from "react-native";
import * as MediaLibrary from "expo-media-library";
import React, { useState, useEffect, useRef } from "react";

import { Camera, CameraView, useCameraPermissions } from "expo-camera/next";
import { Audio } from "expo-av";
import AsyncStorage from "@react-native-async-storage/async-storage";

function App() {
  const [permission, requestPermission] = useCameraPermissions();
  const [type, setType] = React.useState("back");
  function toggleCameraFacing() {
    setType((current) => (current === "back" ? "front" : "back"));
  }
  const cameraRef = React.useRef(null); // Using React.useRef to create a ref
  const [isRecording, setIsRecording] = React.useState(false);
  const startRecording = async () => {
    if (cameraRef.current) {
      try {
        setIsRecording(true);
        //cameraRef.current.recordAsync({});
        const videoRecordPromise = cameraRef.current
          .recordAsync
          // Set the video quality
          ();

        if (videoRecordPromise) {
          setIsRecording(true);
          const data = await videoRecordPromise;
          console.log("Video recording completed", data.uri);
          await MediaLibrary.createAssetAsync(data.uri);
          AsyncStorage.setItem("recordedVideo", data.uri);

          // navigation.navigate("Upload", {  });
        }
      } catch (error) {
        console.error("Error recording video:", error);
      }
    }
  };

  const stopRecording = () => {
    // Accessing the ref with .current
    cameraRef.current.stopRecording();
    setIsRecording(false);
  };

  //checkMediaLibraryPermissions();

  if (!permission) {
    // Camera permissions are still loading
    return <View />;
  }

  if (!permission.granted) {
    // Camera permissions are not granted yet
    return (
      <View
        style={{
          backgroundColor: "black",
          flex: 1,
          alignContent: "center",
          alignItems: "center",

          justifyContent: "center",
        }}
      >
        <Text
          style={{
            textAlign: "center",
            alignSelf: "center",
            color: "white",
            fontWeight: "600",
          }}
        >
          We need your permission to show the camera
        </Text>
        <TouchableOpacity
          onPress={() => {
            Audio.requestPermissionsAsync();
            MediaLibrary.requestPermissionsAsync();
            requestPermission();
          }}
          style={{
            textAlign: "center",
            alignSelf: "center",
            backgroundColor: "white",
            paddingTop: 12,
            paddingBottom: 12,
            paddingLeft: 23,
            paddingRight: 23,
            marginTop: 10,
            borderRadius: 25,
          }}
        >
          <Text style={{ fontSize: 18, fontWeight: "600" }}>
            grant permission
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <CameraView
        //CameraMode={"video"}

        // videoQuality={"720p"}
        style={{ flex: 1 }}
        facing={type}
        // ratio={"16:9"}
        ref={cameraRef}
      >
        <StatusBar animated={true} backgroundColor="transparent" />
        <SafeAreaView style={{ flex: 1 }}>
          <TouchableOpacity
            onPress={() => {
              stopRecording();
              navigation.goBack();
            }}
            style={{
              height: 26,
              width: 60,
              //paddingTop: StatusBar.currentHeight,
              paddingLeft: 30,
              backgroundColor: "transparent",
            }}
          >
            <Image
              source={require("./assets/arrow.png")}
              style={{
                height: "100%",
                width: "100%",

                // padding: 50,
                borderRadius: 18,
              }}
            />
          </TouchableOpacity>

          <View
            style={{
              alignSelf: "flex-end",
              alignContent: "flex-end",
              height: "95%",

              alignItems: "baseline",
              justifyContent: "flex-end",
              padding: 10,
            }}
          >
            <TouchableOpacity onPress={toggleCameraFacing}>
              <Image
                source={require("./assets/turn.png")}
                style={{
                  alignSelf: "center",
                  alignItems: "center",
                  right: 25,
                  height: 50,
                  width: 50,
                }}
              />
            </TouchableOpacity>
          </View>
          <View
            style={{
              width: "100%",
              height: "20%",
              backgroundColor: "transparent",
              zIndex: 4,
            }}
          >
            <Pressable
              onPress={isRecording ? stopRecording : startRecording}
              style={{
                //backgroundColor: "red",
                height: 72,
                width: 72,
                alignSelf: "center",
                top: -70,
                //backgroundColor: "red",
              }}
            >
              <Image
                source={
                  isRecording
                    ? require("./assets/reccircle.png")
                    : require("./assets/circle.png")
                }
                //id RecordButton
                style={{
                  alignSelf: "center",
                  alignItems: "baseline",
                  padding: 10,

                  height: 72,
                  width: 72,
                }}
              ></Image>
              <Text
                style={{
                  fontSize: 18,
                  color: "white",
                  top: -100,
                  alignSelf: "center",
                }}
              ></Text>
            </Pressable>
          </View>
        </SafeAreaView>
      </CameraView>
    </View>
  );
}
export default App;
