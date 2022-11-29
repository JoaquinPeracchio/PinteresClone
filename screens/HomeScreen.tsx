
import MasonryList from '../components/MasonryList';
import { useNhostClient } from '@nhost/react'
import {useState, useEffect} from 'react'
import {Alert} from 'react-native'
import PinScreen from './PinScreen';

export default function HomeScreen() {
  const nhost = useNhostClient()
  const [pins , setPins]=useState([])
  const [loading,setLoading]=useState(false)
  useEffect(()=>{
  fetchPins()

  },[])

  const fetchPins = async()=>{
    setLoading(true)
        const response = await nhost.graphql.request(
          `
          query MyQuery {
            pin {
              id
              image
              created_at
              title
              user_id
            }
          }
          `
        )
        if(response.error){
          Alert.alert(`error is ${response.error}`)
        }else{
          setPins(response.data.pin)

        }
        setLoading(false)
    }
  return (
    <MasonryList pins={pins} onRefresh={fetchPins} refreshing={loading}/>
    
  );
}

