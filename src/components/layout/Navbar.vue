<template>
    <div class="navbar">
        <nav class="orange accent-3">
            <div class="container">
                <router-link :to="{name: 'Home'}" class="brand-logo left">Crypto Tracker</router-link>
                <ul class="right">
                    <li v-if="!user"><router-link :to="{name: 'Signup'}">Signup</router-link></li>
                    <li v-if="!user"><router-link :to="{name: 'Login'}">Login</router-link></li>
                    <li v-if="user"><router-link :to="{name: 'UserProfile', params: {id: this.user.uid}}">{{user.email}}</router-link></li>
                    <li v-if="user"><a @click="logout">Logout</a></li>
                </ul>
            </div>
        </nav>
    </div>
</template>

<script>
import firebase from 'firebase'

export default {
    name: 'Navbar',
    data(){
        return{
            user: null
        }
    },
    methods: {
        // log the user out
        logout(){
            firebase.auth().signOut().then(() => {
                this.$router.push({name: 'Login'})
            })
        } 
    },
    // set current user on created hook
    created(){
        let user = firebase.auth().currentUser
        firebase.auth().onAuthStateChanged((user) => {
            if(user){
                this.user = user
            } else {
                this.user = null
            }
        })
    }
}
</script>

<style>

</style>

