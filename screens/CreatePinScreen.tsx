import React, { useState, useEffect ,  } from 'react';
import { Button, Image, View, TextInput,StyleSheet,Alert,Platform } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useNhostClient } from '@nhost/react';
import { useNavigation } from '@react-navigation/native';


// enviar info al back
const CREATE_PIN_MUTATUION = `
mutation MyMutation ($image:String! , $title:String) {
insert_pin(objects: {image: $image, title: $title}) {
  returning {
    created_at
    id
    image
    title
    user_id
  }
}
}
`;


const CreatePinScreen =() =>{

  const [image, setImage] = useState(null);
  const [title,setTitle]=useState("")
  const nhost = useNhostClient()
  const navigation = useNavigation()

  //showme the galery and get the information of the picture selected
  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
       setImage(result.uri);
    }
  };





// order the information provideer with the image for after send correctly at the storage 
  const uploadFile = async () =>{
    if(!image){
      return{
        error : 'not image selected'
      }
    }
const part = image.split('/')
const name = part[part.length - 1]
const nameparts = name.split('.')
const extension  =  nameparts[nameparts.length -1]
    const uri = Platform.OS === "ios" ? image.replace("file://", "") : image;
    const result = await nhost.storage.upload({
      file: {
          name,
          type : `image/${extension}`,
          uri,
      },
     })
     return result
    }


// send the information inside the storage for do the query 

  const onSubmit = async ()=>{

    const uploadResult = await uploadFile()

    if(uploadResult.error){
      Alert.alert("someting its wrong", uploadResult.error)
    }

      const result = await nhost.graphql.request(CREATE_PIN_MUTATUION , {image:uploadResult.fileMetadata.id/*refencia de los datos de la imagen la cual despues buscare para vincular con el titulo*/ ,title})
      if(result.data!=null){
        console.warn(result)
        Alert.alert('Created Success')
        navigation.goBack()
      }
    
  }




  return (
    <View style={styles.root}>
      <Button title="Upload your Pin" onPress={pickImage} />
      {image && (
            <>
            <Image
            source={{ uri: image }}
            style={styles.image }
             />
            <TextInput placeholder='Title' style={styles.input} value={title} onChangeText={setTitle}/>
            <Button title="Submit Pin" onPress={onSubmit} />
            </>
         )}
    </View>
  );
}

const styles  = StyleSheet.create({
    root:{
        flex: 1,
         alignItems: 'center',
          justifyContent: 'center',
          backgroundColor:'white',
          padding:5
    },
    input:{
        borderWidth:1,
        borderColor:'gainsboro',
        padding:5,
        width : "100%",
        borderRadius:5,
    },
    image:{
        width: "100%",
         aspectRatio:1,
         marginVertical:10,
    }
})
export default CreatePinScreen

// in the component masonry y get the information from pins in the database (remember that inside them we have one of those ids that do ir reference with the element in the storage) so , i need with that id that i catch do it something , with that id need 