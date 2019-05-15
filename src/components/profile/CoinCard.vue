<template>
            <div class="coinDisplay card z-depth-3">
                <slot v-if="!makePrediction"></slot>
                <prediction v-if="makePrediction" :coinName="coin.coin_name" :coinID="coin.coin_id" v-on:close="hidePrediction"></prediction>
                <div v-else class="card-content">
                    <i class="cc medium right" :class="coin.coin_id"></i>
                    <ul>
                        <li>{{coin.coin_id}}</li>
                        <li>{{coin.coin_name}}</li>
                        <li>Last Price: ${{parseFloat(coin.last_price) < 1.0 ? parseFloat(coin.last_price).toFixed(4) : parseFloat(coin.last_price).toFixed(2)}}</li>
                    </ul>
<!--<slot name="actionButton"></slot>-->
                    <div class="card-action">
                        <a class=" waves-effect waves-light btn-small black-text center" @click="showPrediction">Make a Prediction</a><br><br>
                        <a class=" waves-effect waves-light btn-small black-text center" @click="viewCoinPredictions">View Predictions</a>
                    </div>

                    
                </div>
                
            </div>
</template>

<script>
import firebase from 'firebase'
import db from '@/firebase/init'
import Prediction from '@/components/profile/Prediction'

export default {
    props:['coin'],
    components:{
        Prediction
    },
    data(){
        return{
            makePrediction: false
        }
    },
    methods:{
        showPrediction(){
            this.makePrediction = true
            console.log("in show prediction")
        },
        hidePrediction(){
            this.makePrediction = false
        },
        viewCoinPredictions(){
            this.$router.push({name: 'Predictions', params: {coin: this.coin.coin_id, name: this.coin.coin_name}})
        }
    }
   
}
</script>

<style>
    .coinDisplay{
        width: 300px;
        margin: 20px;
        text-align: left;
        display: inline-block;
   }
   .coinDisplay .material-icons{
       margin-right: 7px;
       margin-top: 7px;
       cursor: pointer;
   }
   .coinDisplay div.card-content i{
       margin: none;
   }

</style>


