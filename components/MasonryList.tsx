import { View, Text , ScrollView , StyleSheet,useWindowDimensions, RefreshControl} from 'react-native'

import {useState} from "react"
import Pin from './Pin'
import React from 'react'

interface ImasonryList {
    pins :{
        id:string
        image:string
        title:string
    }[];
    refreshing?:boolean
    onRefresh? : ()=>void

}

//al ser mecanografiado typescript de esta forma le decimos que  pins es un arr de objetos 
const MasonryList = ({pins,refreshing=false ,onRefresh = ()=>{}}:ImasonryList) => {
  
  const width = useWindowDimensions().width
  const numCol = width < 500 ? 2 : 3
  return (
    <ScrollView     refreshControl={
      <RefreshControl refreshing={refreshing} onRefresh={onRefresh}/>
    }
    >
  

    <View style={styles.container}>
      
    {Array.from(Array(numCol)).map((_,colIndex)=>(
       <View style={styles.column} key={`colums${colIndex}`}>
       {pins.filter((_,index)=>index % numCol === colIndex ).map(e => <Pin pin={e} key={e.id}/>)}
       </View>

    ))}
   
    </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
    container: {
      width:'100%',
      flexDirection:'row',
      padding:10,
      backgroundColor:'white'
  
    },
    column:{
      flex:1,
      backgroundColor : 'white'
    }
});  

export default MasonryList