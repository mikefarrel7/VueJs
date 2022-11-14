<template>
  <v-app id="inspire">
    <v-navigation-drawer
    v-model="drawer"
    app
    width="400"
    >
      
    <v-list
        dense
        nav
      >
        <v-list-item
          v-for="item2 in items"
          :to="item2.to"
          link
        >
          <v-list-item-icon>
            <v-icon>{{ item2.icon }}</v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title>{{ item2.title }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
      <v-divider style="margin-top:20px"></v-divider>

      
      <div style="margin-left: 10px;">
        Choose Track To Record
      </div>
      
      
        <select v-model="selected">
        <option v-for="option in options" v-bind:value="option">
          Track {{ option }}
        </option>
      </select>
      <v-btn
      depressed
      color="primary"
      @click="saveRecord"
    >
      Submit To Record
    </v-btn>
    

      
    </v-navigation-drawer>

    <v-navigation-drawer
    v-model="drawer"
    app
    right
    width="400"
    >
      
    <div style="margin-left: 10px;">
        <h2>Track Recorded</h2>
        <v-simple-table style="padding: 30px; border: 1px solid gray;">
    <template v-slot:default>
      <thead>
        <tr>
          <th class="text-left">
            Time Recorder
          </th>
          <th class="text-left">
            ID Track
          </th>

          <th class="text-left">
            Status
          </th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="item1 in TrackRecord"
        >
          <td>{{ item1.time_record }}</td>
          <td>{{ item1.id_track }}</td>
          <td>
            <v-radio-group
      v-model="row"
      row
    >
      <v-radio
        label="Start"
        value="Start"
      ></v-radio>
      <v-radio
        label="Stop"
        value="Stop"
      ></v-radio>
    </v-radio-group>
          </td>
        </tr>

        
      </tbody>
    </template>
  </v-simple-table>

      </div>
      
      
     
    
    </v-navigation-drawer>



    <v-app-bar app>
      <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>

      <v-toolbar-title>Application&nbsp;</v-toolbar-title>
      <v-toolbar-title style="color:darkgreen;">{{ message }}</v-toolbar-title>
    </v-app-bar> 

    <v-main>
      <router-view></router-view>
    </v-main>


    
  </v-app>
</template>

<script>
import io from 'socket.io-client';
import axios from 'axios';
  export default {
    data: function()
      { 
        
        return {
          drawer: null,
          record:{
            id_track:null,
            status_record:null,
            time_record:null
          },
          row:null,
          submitted: false,
          RecordTrack: [],
          items: [
            { title: 'Dashboard', icon: 'mdi-view-dashboard', to:'/' },
            { title: 'Update Ship Track', icon: 'mdi-image',to:'/update' },
          ],
          selected: '1',
          options: [],
          TrackRecord:[],
          right: null,
          message: 'Disconnected',
          socket: io('ws://localhost:5000', {
              transports: ['websocket',]
          })
        }

    
    },
   mounted(){
      
      this.socket.on('on_connect', (msg) => {
          this.message = msg
      });
      this.getDataAll();
      this.retrieveTrackRecord();
  },
  methods:{

    retrieveTrackRecord() {
           return axios.get(`http://localhost:5000/trackRecord`)
            .then(response => {
              this.TrackRecord = response.data;
              console.log(response.data);
            })
            .catch(e => {
              console.log(e);
            });
        },
    getDataAll()
    {
      
      axios.get(`http://localhost:5000/trackIdAll`)
      .then(response => {
        for(const k in response.data)
          this.options.push(response.data[k].id_track)
      })
      .catch(e => {
      console.log(e);
      });
    },
    pauseTrack()
    {

    },
    saveRecord() {

     
      var data = {
        id_track: parseFloat(this.selected),
        status_record: parseInt(1),
        time_record: this.formatDate(new Date())
      }
      axios.post(`http://localhost:5000/trackCreateRecord`,data).then(response => {
          console.log(response);
        })
        .catch(e => {
          console.log(e);
        });

    },
    formatDate(date) {
  return (
    [
      date.getFullYear(),
      this.padTo2Digits(date.getMonth() + 1),
      this.padTo2Digits(date.getDate()),
    ].join('-') +
    ' ' +
    [
      this.padTo2Digits(date.getHours()),
      this.padTo2Digits(date.getMinutes()),
      this.padTo2Digits(date.getSeconds()),
    ].join(':')
  );
},
padTo2Digits(num) {
  return num.toString().padStart(2, '0');
}


    
    
    
    

  }
    

  }
</script>
<style>
.v-select {
  padding: 10px;
}
.v-btn{
  padding: 10px;
  margin-left: 10px;
}
select{
  width: 300px;
  padding: 5px;
  margin-bottom: 5px;
  margin-left: 10px;
  border: 1px solid gray;
}
</style>