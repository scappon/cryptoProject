<template>
    <div class="chat container">
        <div class="card">
            <div class="card-content">
                <h3 class="center">{{$route.params.name}}</h3>
                <h3 class="center">${{coinPrediction.prediction}}</h3>
            </div>
        </div>
        
        <div class="card">
            <div class="card-content">
                <div class="card" v-for="comment in comments" :key="comment.id">
                    <div class="card-content">
                        <span class="teal-text">{{comment.name}}</span>
                        <span class="grey-text time">{{comment.timestamp | moment}}</span>
                        <span class="grey-text text-darken-3 message">{{comment.content}}</span><br>
                        <span class="badge">{{comment.dislikes}}</span>
                        <i class="material-icons right" @click="downVote(comment.id, comment.dislikes)">thumb_down</i>
                        <span class="badge">{{comment.likes}}</span>
                        <i class="material-icons right" @click="upVote(comment.id, comment.likes)">thumb_up</i>
                       
                    </div>
                </div>
                    
                
            </div>
            <div class="card-action">
                <NewComment :alias="alias" :id="$route.params.user"/>
            </div>
        </div>
    </div>
</template>

<script>
import NewComment from '@/components/predictions/NewComment'
import db from '@/firebase/init'
import moment from 'moment'
import firebase from 'firebase'

export default {
    props: ['name', 'user'],
    components: {
        NewComment
    },
    data(){
        return {
            messages: [],
            comments: null,
            alias: null,
            coinPrediction: null
        }
    },
    methods: {
        //Add like in database for comment          
        upVote(id, likess){
            var comment = db.collection('predictions').doc(this.$route.params.coin).collection('users').doc(this.user).collection('comments').doc(id).update({
                likes: likess+1
            })
           
        },
        //Add dislike in database for comment
        downVote(id, dislikess){
            var comment = db.collection('predictions').doc(this.$route.params.coin).collection('users').doc(this.user).collection('comments').doc(id).update({
                dislikes: dislikess+1
            })
    }
    },
    firestore(){
        return{
            //comments collection
            comments: db.collection('predictions').doc(this.$route.params.coin).collection('users').doc(this.user).collection('comments'),
            //prediction being commented on
            coinPrediction: db.collection('predictions').doc(this.$route.params.coin).collection('users').doc(this.user)
        }
    },
    //put timestamp in readable format
    filters: {
                moment: function (date) {
                return moment(date).format('lll')
                }
            },
    //Used to get current signed in user
    created(){
        this.alias = firebase.auth().currentUser.uid
    }
}
</script>

<style>
    .chat h2{
        font-size: 2.6em;
        margin-bottom: 40px;
    }
    .chat span{
        font-size: 1.4em;
    }
    .chat .time{
        display: block;
        font-size: 0.8em;
    }
    span{
     
        overflow-wrap: break-word;
    }
    i{
        cursor: pointer;
    }
</style>



