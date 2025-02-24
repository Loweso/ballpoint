import React, { useState } from 'react';
import { SafeAreaView, View, Text, TextInput, TouchableOpacity, Image } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { Link } from 'expo-router';

const LoginPage = () => {
    const [showPassword, setShowPassword] = useState(false);

    return (
        <SafeAreaView className="flex-1 justify-center items-center bg-white">
            <View className="p-3 bg-white rounded-lg shadow-md">

                <View className="items-center">
                    <Image
                        source={require('../assets/images/ballpointLogo.png')}
                        className="w-56 h-32"
                        resizeMode="cover"
                    />
                </View>

                <TextInput
                    placeholder="Username"
                    className="border border-gray-300 p-3 m-2 rounded-md"
                    onChangeText={(text) => console.log('Username Input:', text)}
                />

                <View>
                    <TextInput
                        placeholder="Password"
                        secureTextEntry={!showPassword}
                        className="border border-gray-300 p-3 m-2 rounded-md"
                        onChangeText={(text) => console.log('Password Input:', text)}
                    />
                    <TouchableOpacity
                        className="absolute right-4 top-5"
                        onPress={() => {
                            setShowPassword(!showPassword);
                            console.log('Toggled Password Visibility:', !showPassword);
                        }}
                    >
                        <FontAwesome
                            name={showPassword ? 'eye-slash' : 'eye'}
                            size={20}
                            color="gray"
                        />
                    </TouchableOpacity>
                </View>

                <TouchableOpacity 
                    className="bg-tertiary-buttonGreen p-2 rounded-md m-2"
                    onPress={() => console.log('Sign Up Button Pressed')}
                >
                    <Text className="text-white text-center font-bold">Log In</Text>
                </TouchableOpacity>

                <View className="flex-row items-center m-4">
                    <View className="flex-1 h-px bg-gray-300" />
                    <Text className="px-2 text-gray-500">OR</Text>
                    <View className="flex-1 h-px bg-gray-300" />
                </View>

                <TouchableOpacity 
                    className="p-4 flex-row justify-center items-center"
                    onPress={() => console.log('Log In with Google Button Pressed')}
                >
                    <Image 
                        source={require('../assets/images/googleLogo.png')}
                        className="w-10 h-10"
                        resizeMode="contain"
                    />
                    <Text className="text-tertiary-buttonGreen m-2">
                        Log in with your Google Account
                    </Text>
                </TouchableOpacity>

                <Link href="/signup" asChild>
                    <TouchableOpacity 
                        onPress={() => console.log("Navigating to Sign up Page")}
                    >
                        <Text className="border border-gray-300 text-center text-gray-500 p-3 mt-8">
                            Don't have an account?{' '}
                            <Text className="text-tertiary-buttonGreen font-semibold">Sign up!</Text>
                        </Text>
                    </TouchableOpacity>
                </Link>
            </View>
        </SafeAreaView>
    );
};

export default LoginPage;
