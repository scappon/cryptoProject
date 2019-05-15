<template>
    <div class="predictionCard card z-depth-5">
        <h4>{{coinName}}</h4>
            
            <input  class="datepicker">
            <input type="number" v-model="prediction" placeholder="Prediction in dollars">
            <p class="red-text center" v-if="feedback">{{feedback}}</p>
            <a class="waves-effect waves-light btn-small " @click="makePrediction">Make Prediction</a>
            <a class="waves-effect waves-light btn-small" @click="close">Cancel</a>
        
    </div>
</template>

<script>

import M from 'materialize-css'
import db from '@/firebase/init'
import firebase from 'firebase'

export default {
    props:['coinName', 'coinID'],
 
    data(){
        return{
            
            prediction: null,
            dateinstance: null,
            feedback: null,
            alias: null
          
        }
    },
    methods: {
        makePrediction(){
            if(this.prediction!=null && this.dateinstance.toString()!=""){
                db.collection('predictions').doc(this.coinID).collection('users').doc(this.$route.params.id).set({
                prediction: this.prediction,
                date: this.dateinstance.toString(),
                alias: this.alias
            })
            this.$emit('close')
            }
            else{
                this.feedback="you must fill out both fields"
            }
            
        },
        close(){
            this.$emit('close')
        }
        
    },
    mounted(){
       
       var options = {}
        

        var elems2 = document.querySelectorAll('.datepicker');
        this.dateinstance = M.Datepicker.init(elems2, options);

        db.collection('users').doc(this.$route.params.id).get()
        .then(doc => {
            this.alias = doc.data().alias
        })
    }
}
</script>

<style>
    .predictionCard{
        
        padding: 10px;
        /*
       position: absolute;
       top: 35%;
       left: 25%;*/
       margin: 0;
    }
</style>


