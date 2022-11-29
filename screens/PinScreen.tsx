import { Text,StyleSheet,Image , View,Pressable,useWindowDimensions,Alert} from "react-native"
import {useState , useEffect} from "react"

import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context"
import { StatusBar } from "expo-status-bar"
import { Ionicons } from "@expo/vector-icons"
import { useNavigation , useRoute} from "@react-navigation/native"
import { useNhostClient } from "@nhost/react"
const PinScreen = () =>{
    const [Ratio , setRatio] = useState(1)
    const [pin,setPin]=useState<any>(null)
    const [imageUri, setImageUri]= useState("")
    const insets = useSafeAreaInsets() 
    const navigation = useNavigation()
    const nhost= useNhostClient()
    const route = useRoute()
    const pinId = route.params?.id
  
    const width = useWindowDimensions().width
    




    const fetchPin = async (pinId) =>{
        const response = await nhost.graphql.request(`
        query MyQuery {
            pin_by_pk(id: "${pinId}") {
              id
              image
              title
              user_id
              user {
                avatarUrl
                displayName
                id
              }
            }
          }
          
        `);
        if(response.data != null){
            console.warn('send')
            setPin(response.data.pin_by_pk)
            
        }
        if(response.error){

        }
    }

    
const fetchPinStorage = async ()=>{
    const result = await nhost.storage.getPresignedUrl({
      fileId: pin.image
    })
    console.warn(result)
    if(result?.presignedUrl?.url){
  
        setImageUri(result.presignedUrl.url)
    }
  }


    const goBackPage = ()=>{
    navigation.goBack()
    }

    useEffect(()=>{
        fetchPin(pinId)
        if(pin){
            setImageUri(pin.image)
        }
    },[pinId])


    useEffect(()=>{
        fetchPinStorage()
    },[pin])


    useEffect(()=>{
   
    if(width > 500){
        setRatio(2.3)
    }else{
        if(imageUri){
            Image.getSize(imageUri,(width,heigth)=>setRatio(width/heigth))
        }
        
    }
    },[imageUri])


  

    return(
        <SafeAreaView style={{backgroundColor:'black' ,paddingTop:10}}>
        <StatusBar style='light'/>
        <View style={styles.root}>
            <Image source={{uri : imageUri?imageUri:pin?pin.image:''}} style={[styles.image , {aspectRatio : Ratio}]}/>
            <Text style={styles.title} >{pin?.title}</Text>
        </View>
        <Pressable onPress={goBackPage} style={[styles.btnBack, {top:insets.top + 25}]}>
        <Ionicons name={'chevron-back'} size={35} color={'white'} />
        </Pressable>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    title : {
        fontSize: 25,
        lineHeight : 32,
        fontWeight: '600',
        margin: 15,
        textAlign:"center",
        color : '#191919',
        
    },
    root:{
        backgroundColor:'white',
        borderTopLeftRadius:40,
       borderTopRightRadius:40,
       height:'100%'
    },
    image:{
        width: '100%',
       borderTopLeftRadius:40,
       borderTopRightRadius:40


    },
    btnBack :{
        position:"absolute",
        left:4,

    
    }

})

export default PinScreen