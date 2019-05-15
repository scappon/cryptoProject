<template>
    <div class="new-message">
        <form @submit.prevent="addMessage">
            <label for="new-message">New Message (enter to add)</label>
            <input type="text" name="new-message" v-model="newMessage">
            
            <p class="red-text" v-if="feedback">{{feedback}}</p>
        </form>
    </div>
</template>


<script>
import db from '@/firebase/init'
import firebase from 'firebase'
export default {
    props: ['alias', 'id'],
    data(){
        return {
            newMessage: null,
            feedback: null,
            user: null,
            alias2: null
        }
    },
    methods: {
        addMessage(){
            if(this.newMessage){
                db.collection('predictions').doc(this.$route.params.coin).collection('users').doc(this.id).collection('comments').add({
                    content: this.newMessage,
                    name: this.alias2.alias,
                    timestamp: Date.now(),
                    likes: 0,
                    dislikes: 0
                }).catch(err => {
                    console.log(err)
                })
                this.newMessage = null
                this.feedback = null
            } else {
                this.feedback = 'You must enter a message in order to send one'
            }
        }
    },
    mounted(){
        //this.alias2 = db.collection('users').doc(this.alias)

    },
    firestore(){
        return{
            alias2:  db.collection('users').doc(this.alias)
        } 
    }

    
}
</script>
