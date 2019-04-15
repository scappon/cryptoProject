<template>
    <div class="signup container">
        <form @submit.prevent="signup" class="card-panel">
            <h2 class="center grey-text">Signup</h2>
            <div class="field">
                <label for="email">Email</label>
                <input type="email" name="email" v-model="email">
            </div>
                <div class="field">
                    <label for="password">Password</label>
                    <input type="password" name="password" v-model="password">
                </div>
                <div class="field">
                    <label for="alias">Alias:</label>
                    <input type="text" name="alias" v-model="alias">
                </div>
                <p class="red-text center" v-if="feedback">{{this.feedback}}</p>
                <div class="field center">
                    <button class="btn grey">Signup</button>
                </div>
            </form>
        </div>
</template>

<script>
import slugify from 'slugify'
import firebase from 'firebase'
import db from '@/firebase/init'


export default {
    name: 'Signup',
    data(){
        return{
            email: null,
            password: null,
            alias: null,
            feedback: null,
            slug: null,
            id: null
        }
    },
    methods: {
        // sign the user up and add them to firebase authentication
        signup(){
            if(this.alias && this.password && this.email){
                this.slug = slugify(this.alias, {
                    replacement: '-',
                    remove: /[$*_+~.()'"!\-:@]/g,
                    lower: true
                })
                const db = firebase.firestore()
                let ref = db.collection('users').doc(this.slug)
                ref.get().then(doc => {
                    if(doc.exists){
                        this.feedback = "This alias already exists"
                    } else {
                        firebase.auth().createUserWithEmailAndPassword(this.email, this.password)
                        .then(cred => {
                            ref.set({
                                alias: this.alias,
                                //geolocation: null,
                                user_id: cred.user.uid
                                
                            })
                            this.id = cred.user.uid
                        }).then(() => {
                            this.$router.push({name: "UserProfile", params: {id: this.id}})
                        })
                        .catch(err => {
                            console.log(err)
                            this.feedback = err.message
                        })
                        this.feedback = "This alias is free to use"
                    }
                })
                console.log(this.slug)
            } else {
                this.feedback = "You must enter all fields"
            }
        }
    }
}
</script>

<style>
    .signup{
        max-width: 400px;
        margin-top: 60px;
    }
    .signup h2{
        font-size: 2.4em;
    }
    .signup .field{
        margin-bottom: 16px;
    }
</style>

