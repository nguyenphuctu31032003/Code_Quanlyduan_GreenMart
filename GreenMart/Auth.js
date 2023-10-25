import {createBottomTabNavigator, useBottomTabBarHeight} from '@react-navigation/bottom-tabs';
import Ionic from "react-native-vector-icons/Ionicons";
import {NavigationContainer} from "@react-navigation/native";
import FavouriteScreen from "./Screens/FavouriteScreen"
import AccountScreen from "./Screens/AccountScreen"
import {Button, TouchableOpacity, View} from "react-native";
import {StyleSheet} from "react-native";
import CustomDialog from "./Screens/CustomDialog";
import BeveragesScreens from "./Screens/BeveragesScreens";
import OrderSuccess from "./Screens/OrderSuccess";
import FilterScreen from "./Screens/FilterScreen";
import {createNativeStackNavigator} from "@react-navigation/native-stack";
import Login from "./Login";
import Signup from "./Signup";
import {ChevronLeftIcon} from "react-native-heroicons/mini";
import Code from "./Code";
import Cart from "./Cart";
import ProductDetail from "./Screens/ProductDetail";
import Home from "./Screens/Home";
import CartScreen from "./Screens/CartScreen";
import CheckOut from "./Screens/CheckOut";
import UpdateUser from "./Screens/UpdateUser";
import MyOrder from "./Screens/MyOrder";
import AllProduct from "./Screens/AllProduct";
const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function Homefu() {
    return (

        <Tab.Navigator
                        screenOptions={({route},) => ({
                            tabBarIcon: ({focused, size, tintColor}) => {
                                let iconName, iconColor;
                                if (route.name === "Home") {
                                    iconName = focused ? "home" : "home-outline"
                                    iconColor = focused ? 'green' : 'grey'
                                } else if (route.name === "Cart") {
                                    iconName = focused ? "cart" : "cart-sharp"
                                    iconColor = focused ? 'green' : 'grey';
                                } else if (route.name === "Favourite") {
                                    iconName = focused ? "heart-circle" : "heart-circle-outline"
                                    iconColor = focused ? 'green' : 'grey';
                                } else if (route.name === "Account") {
                                    iconName = focused ? "person-circle-sharp" : "person-circle-outline"
                                    iconColor = focused ? 'green' : 'grey';
                                }

                                return <Ionic name={iconName} size={size} color={iconColor}/>;
                            },
                            headerShown: false,
                            tabBarLabelStyle: {
                                position: 'relative', // Đặt vị trí của chữ thành relative
                                bottom: 20,
                                marginTop: 10// Điều chỉnh vị trí chữ theo ý muốn
                            },
                            tabBarStyle: {

                                height: 100,
                                borderTopRightRadius: 30,
                                borderTopLeftRadius: 30,
                                borderWidth: 1,
                                borderTopWidth: 1,
                                borderTopColor: '#b5b5b5',
                                borderRightColor: '#b5b5b5',
                                borderLeftColor: '#b5b5b5',

                            },

                        })}


                    >

                        <Tab.Screen name={"Home"} component={Home}/>
                        <Tab.Screen name={"Cart"} component={CartScreen}/>
                        <Tab.Screen name={"Favourite"} component={FavouriteScreen}/>
                        <Tab.Screen name={"Account"} component={AccountScreen}/>
                    </Tab.Navigator>
    )
}
function Auth(props){
    const Tab=createBottomTabNavigator();
    return (
        <NavigationContainer>
            <Stack.Navigator>
                <Stack.Screen name="Login" component={Login} options={{ headerShown: false, tabBarStyle: { display: 'none' } }} />
                <Stack.Screen name="Signup" component={Signup} options={{ headerShown: false, tabBarVisible: false }} />
                <Stack.Screen name="HomeScreen" component={Homefu} options={{ headerShown: false, tabBarVisible: false }} />
                <Stack.Screen name="OrderSuccess" component={OrderSuccess} options={{ headerShown: false, tabBarVisible: false }} />
                <Stack.Screen name="MyOrder" component={MyOrder}/>
                <Stack.Screen name="AllProduct" component={AllProduct}/>
                <Stack.Screen name="ProductDetail" component={ProductDetail}/>
                <Stack.Screen name="CheckOut" component={CheckOut}/>
                <Stack.Screen name="UpdateUser" component={UpdateUser} options={{ headerShown: false, tabBarVisible: false }} />
                <Stack.Screen name="Mobile number verification" component={Code}
                              options={({ navigation }) => ({
                                  title: 'Mobile number verification',
                                  headerLeft: () => (
                                      <TouchableOpacity onPress={() => navigation.goBack()}>
                                          <ChevronLeftIcon size={20} />
                                      </TouchableOpacity>
                                  ),
                              })} />
                <Stack.Screen name="Cart" component={Cart} options={{ headerShown: false, tabBarVisible: false }} />
                <Stack.Screen name="BeveragesScreens" component={BeveragesScreens}
                              options={{ headerShown: false }}
                />
                <Stack.Screen name="Filter" component={FilterScreen}
                              options={{ headerTitleAlign:'center',
                                  tabBarStyle: { display: "none" },
                              }}
                />
            </Stack.Navigator>
        </NavigationContainer>
    );

}




const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems:'center'



    },
    navigator1: {
        borderColor:'#B1B1B1',
        borderTopLeftRadius:30,
        borderTopRightRadius:30,
        position:'absolute',
        height:"100%",
        justifyContent:'space-between',
        bottom:0,
        width:'100%',
    }, navigator2: undefined


});

export default Auth
