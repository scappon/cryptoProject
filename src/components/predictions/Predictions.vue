<template>
    <div>
        <h1 class="center">{{name}} Predictions</h1>
        <table class="center highlight">
        <thead>
          <tr>
              <th>Name</th>
              <th>Date</th>
              <th>Price</th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="(user, index) in coinPredictions" :key="index" @click="toComments(user.id)">
            <td>{{user.alias}}</td>
            <td>{{user.date}}</td>
            <td>{{user.prediction}}</td>
          </tr>
        </tbody>
      </table>
    </div>
</template>

<script>
import db from '@/firebase/init'
import firebase from 'firebase'

export default {
    props: ['name'],
    data(){
        return{
            coinPredictions: null
        }
    },
    methods: {
        toComments(id){
            this.$router.push({name: 'Comments', params: {name: this.name, coin: this.$route.params.coin, user: id}})
        }
    },
    firestore(){
        return{
           coinPredictions: db.collection('predictions').doc(this.$route.params.coin).collection('users')
        }
    }
}
</script>

<style>
    table{
        width: 70%;
        margin: 10px auto;
    }
</style>

