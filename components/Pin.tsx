
import { StyleSheet , Image,View,Text,Pressable } from 'react-native';
import { AntDesign } from '@expo/vector-icons'; 
import { useState, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { useNhostClient } from '@nhost/react';


export default function Pin(props) {
  const {image,title,id}= props.pin
const [Ratio,setRatio]=useState(1)
const [imageUri,setImageUri]=useState('')
const navigation = useNavigation()
const nhost = useNhostClient()
  



const fetchPinStorage = async ()=>{
  const result = await nhost.storage.getPresignedUrl({
    fileId: image
  })
  console.warn(result)
  if(result?.presignedUrl?.url){

    setImageUri(result.presignedUrl.url)
  }
}




useEffect(()=>{
fetchPinStorage()
if(image){
  setImageUri(image)
}
},[image])

useEffect(()=>{
      if(imageUri){
        Image.getSize(imageUri,(width,heigth)=>setRatio(width/heigth))
        
      }
      
    },[imageUri])


    const onLike = ()=>{

    }
    const goToPinPage=()=>{ 
      navigation.navigate("Pin",{id})
    }


return (
    <Pressable style={styles.pin} onPress={goToPinPage} >
      <View>

        <Image source={{uri:imageUri}} style={[styles.image, {aspectRatio:Ratio}]}></Image>
        <Pressable onPress={onLike} style={styles.heartBtn}>
        <AntDesign name="hearto" size={24} color="black" />
        </Pressable>
        
      </View>

    <Text style={styles.title} numberOfLines={2}>{title}</Text>
    </Pressable>
  )

  
}
const styles = StyleSheet.create({

    title: {
      fontSize: 16,
      lineHeight : 22,
      fontWeight: '600',
      margin: 5,
      color : '#191919',
    },
  
    image :{
      width:'100%' ,
      borderRadius: 25,
    },
    pin :{
      width : '100%',
      padding: 4
    },
    heartBtn:{
        backgroundColor:'#D3CFD4',
        position:'absolute',
        bottom : 10,
        right : 12,
        padding:6,
        borderRadius:50,
    }
  });
  
