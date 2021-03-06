import React from 'react';
import {SafeAreaView, Text, TouchableOpacity, FlatList, Dimensions, Image } from 'react-native';
import User from '../User';
import firebase from 'firebase';

export default class HomeScreen extends React.Component{
    static navigationOptions = {
        headerShown: false
    }

    state = {
        users: [],
        dbRef: firebase.database().ref('users')
    }

    componentWillMount(){
        this.state.dbRef.on('child_added', (val)=>{
            let person = val.val();
            person.phone = val.key;
            if(person.phone===User.phone){
                User.name = person.name;
                User.image = person.image ? person.image : null
            }else{
                this.setState((prevState)=> {
                    return {
                        users: [...prevState.users, person]
                    }
                })
            }
        })
    }

    renderRow = ({item}) => {
        return(
            <TouchableOpacity 
            onPress={() => this.props.navigation.navigate('Chat', item)}
            style={{ flexDirection:'row', alignItems:'center', padding: 10, borderBottomColor: '#ccc', borderBottomWidth: 1}}>
                <Image 
                    source={item.image ? {uri: item.image} : require('../images/user.png')}
                    style={{width: 32, height: 32, resizeMode: 'cover', borderRadius: 32, marginRight: 5}}
                />
                <Text style={{fontSize:20}}>{item.name}</Text>
            </TouchableOpacity>
        )
    }
    render(){
        const { height } = Dimensions.get('window');
        return(
            <SafeAreaView>
                <FlatList
                    style={{ height }}
                    data={this.state.users}
                    renderItem={this.renderRow}
                    keyExtractor={(item) => item.phone}
                    ListHeaderComponent={() => <Text style={{fontSize: 30, marginVertical: 10, marginLeft: 10, fontWeight: 'bold'}}>Chats</Text>}
                />
            </SafeAreaView>
        )
    }
}