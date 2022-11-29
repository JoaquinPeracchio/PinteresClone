import { StyleSheet ,Image,ScrollView,Pressable, Alert,ActivityIndicator} from 'react-native';
import { Text, View } from '../components/Themed';
import EditScreenInfo from '../components/EditScreenInfo';
import MasonryList from '../components/MasonryList';
import pins from '../assets/data/pins';
import { Entypo, Feather } from '@expo/vector-icons';
import { useNhostClient, useSignOut, useUserId } from '@nhost/react';
import {useEffect,useState} from 'react'

const GET_USER_QUERY=`
query MyQuery($id: uuid!) {
  user(id: $id) {
    id
    displayName
    avatarUrl
    Pins {
      id
      image
      title
      created_at
    }
  }
}
`


export default function ProfileScreen() {
  const [loading,setLoading]=useState(false)
  const [user,setUser]=useState('')
const {signOut} = useSignOut()
const userId = useUserId()
const nhost = useNhostClient()
console.warn(userId)

const fetchUserData = async ()=>{

const result = await nhost.graphql.request(GET_USER_QUERY,{id:userId})
if(result.error){
  Alert.alert('happend error here')
}else{
  setUser(result.data.user)
}

}



 useEffect(()=>{
fetchUserData()
 },[userId])

 if(!user){
  return <ActivityIndicator/>
 }
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.icons}>
          <Pressable onPress={signOut}>
          <Feather name="share" size={24} color="black" style={styles.icon}/>

          </Pressable>
          <Entypo
            name="dots-three-horizontal"
            size= {24}
            color="black"
            style={styles.icon}
          />
        </View>

        <Image source={{uri:user.avatarUrl,}} style={styles.image}/>
        <Text style={styles.title}>{user.displayName}</Text>
        <Text style={styles.subtitle}>123 Followers / 512 Followigs</Text>

      </View>
      <MasonryList pins={user.Pins}  onRefresh={fetchUserData}/>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    width:'100%',
    backgroundColor:'white'
  },
  header:{
    alignItems:'center',
    backgroundColor:'white',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color:'black',
    margin:10
  },
  subtitle:{
    color:'#181818',
    fontWeight:'600',
    margin:10
  },

  image:{
    width: 200,
    height:200,
    aspectRatio:1,
    borderRadius:200,
    marginVertical:10
 },
 icons:{
  flexDirection:'row',
  backgroundColor:'white',
  alignSelf : 'flex-end',
  padding:6

 },
 icon:{
  padding:10
 }
});
