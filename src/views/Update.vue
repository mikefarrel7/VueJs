<template>
  <div>
  <form>
    <v-file-input
      accept="csv/*"
      label="File input"
      @change="onFileChange"
    ></v-file-input>
      <v-btn
        class="mr-4"
        @click="onUploadFile"
      >
        submit
      </v-btn>
    </form>

    <v-simple-table style="padding: 30px">
    <template v-slot:default>
      <thead>
        <tr>
          <th class="text-left">
            Lat
          </th>
          <th class="text-left">
            Long
          </th>

          <th class="text-left">
            Heading
          </th>
          <th class="text-left">
            ID Track
          </th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="item in Track"
          :key="item.id"
        >
          <td>{{ item.lat }}</td>
          <td>{{ item.lon }}</td>
          <td>{{ item.heading }}</td>
          <td>{{ item.id_track }}</td>
        </tr>
      </tbody>
    </template>
  </v-simple-table>

</div>

  
</template>
<script>
import axios from 'axios';
export default{
  name: "uploadFile",

data () {
      return {
        Track: [],
        selectedFile: "",
      }
    },
    methods:{
          retrieveTrack() {
           return axios.get(`http://localhost:5000/track`)
            .then(response => {
              this.Track = response.data;
              console.log(response.data);
            })
            .catch(e => {
              console.log(e);
            });
        },
        submit(){

        },
        onFileChange(e) {
          const selectedFile = e.target.files[0]; 
        },
        onUploadFile() {
          const formData = new FormData();
          formData.append("file", this.selectedFile);  
          axios.post("http://localhost:5000/upload", formData)
            .then(res => {
              console.log(res);
            })
            .catch(err => {
              console.log(err);
            });
        }
    },
    mounted(){
      this.retrieveTrack();
    },
  }
</script>
<style>
form{
  padding: 20px;
}

</style>