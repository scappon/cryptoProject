<template>
    <div class="chat container">
        <div class="card">
            <div class="card-content">
                <h3 class="center teal-text">{{coinPrediction.prediction}}</h3>
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
        upVote(id, likess){
            var comment = db.collection('predictions').doc(this.$route.params.coin).collection('users').doc(this.user).collection('comments').doc(id).update({
                likes: likess+1
            })
           
        },
        downVote(id, dislikess){
            var comment = db.collection('predictions').doc(this.$route.params.coin).collection('users').doc(this.user).collection('comments').doc(id).update({
                dislikes: dislikess+1
            })
    }
    },
    created(){
       /* let ref = db.collection('messages').orderBy('timestamp')

        ref.onSnapshot(snapshot => {
            console.log(snapshot.docChanges().forEach(change => {
                if(change.type == 'added'){
                    let doc = change.doc
                    this.messages.push({
                        id: doc.id,
                        name: doc.data().name,
                        content: doc.data().content,
                        timestamp: moment(doc.data().timestamp).format('lll')
                    })
                }
            }))
        })*/
    },
    firestore(){
        return{
            comments: db.collection('predictions').doc(this.$route.params.coin).collection('users').doc(this.user).collection('comments'),
            //alias: db.collection('users').doc(this.user),
            coinPrediction: db.collection('predictions').doc(this.$route.params.coin).collection('users').doc(this.user)
        }
    },
    filters: {
                moment: function (date) {
                return moment(date).format('lll')
                }
            },
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



