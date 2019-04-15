<template>
    <div class="login container">
        <form @submit.prevent="login" class="card-panel">
            <h2 class="center grey-text">Login</h2>
            <div class="field">
                <label for="email">Email</label>
                <input type="email" name="email" v-model="email">
            </div>
                <div class="field">
                    <label for="password">Password</label>
                    <input type="password" name="password" v-model="password">
                </div>
               
                <p class="red-text center" v-if="feedback">{{this.feedback}}</p>
                <div class="field center">
                    <button class="btn grey">Login</button>
                </div>
        </form>
    </div>
</template>

<script>
import firebase from 'firebase'

export default {
    name: 'Login',
    data(){
        return{
            email: null,
            password: null,
            feedback: null
        }
    },
    methods: {
        //log the user in
        login(){
            
            if(this.email && this.password){
                firebase.auth().signInWithEmailAndPassword(this.email, this.password)
                .then(cred => {
                    console.log(cred.user)
                    this.$router.push({name: 'UserProfile', params: {id: cred.user.uid}})
                }).catch(err => {
                    this.feedback = err.message
                })
                this.feedback = null
            } else {
                this.feedback = 'Please fill in both fields'
            }
        }
    }
}
</script>

<style>
    .login{
        max-width: 400px;
        margin-top: 60px;
    }
    .login h2{
        font-size: 2.4em;
    }
    .login .field{
        margin-bottom: 16px;
    }
</style>
