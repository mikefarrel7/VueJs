<template>
    <div>
    <div style="height: 700px;" class="leaflet-map" id="leaflet-map"></div>
    <v-btn
      depressed
      color="primary"
      @click="pauseTrack"
    >
      Pause Record
    </v-btn>
    </div>
</template>
<script>
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import 'leaflet-routing-machine';
import io from 'socket.io-client';
import axios from 'axios';
  export default {

    data: function (){ 
        return {
            drawer: null,
            myMap: null,
            markerGroup: null,
            clickMarkers: {},
            marker: null,
            secondmarker: null,
            waypointsx: [],
            initTrackLatLon: null,
            myTimeout:null,
            socket: io('ws://localhost:5000', {
              transports: ['websocket',]
          })
        }
      
    
    },
    async mounted() {

        
        
        this.initTrackLatLon = await this.getAllData();
        this.startLeafletMap();
        this.onClickMap();
        const self = this;
        this.waypointsx = await this.getWaypoints();
        
            
        
        this.socket.on('update_markers', markersObj => {
            console.log(markersObj)
           
            for (const key in markersObj){
                
                this.secondmarker = L.marker([markersObj[key].lat, markersObj[key].lng]).addTo(this.myMap);
                this.controlRoute = L.Routing.control({
                waypoints: [
                    waypointsx
                ],
                lineOptions: {
                        styles: [
                                    {color: 'black', opacity: 0.75, weight: 9},
                                    {color: 'white', opacity: 0.8, weight: 6},
                                    {color: '#00a174', opacity: 1, weight: 4}
                        ]
                }
                
                })
                .on('routesfound',function(e){
                    // console.log(e)
                    // console.log(e.routes[0].coordinates[0].lat)
                    e.routes[0].coordinates.forEach((coord,index)=>{
                        setTimeout(() => {
                            self.marker.setLatLng([coord.lat,coord.lng])
                        },100 * index);
                          
                    });
                    
                }).addTo(this.myMap);

                
           }
        });
        
    },
    methods: {
       
      pauseTrack()
      {
        alert("Pause");
      },
        
        getDataAll()
            {
                var Track;
               return axios.get(`http://localhost:5000/track`)
                .then((response) => {
                Track = response.data;
                console.log(Track);
                //this.initTrackLatLon = this.Track[0].lat;
                
                return Track;
                
                })
                .catch(e => {
                console.log(e);
                });
            },

            async getAllData()
            {
                let datax = await this.getDataAll();
                //console.log(datax);
                return datax;
            },
            async getWaypoints()
            {
                let waypx = [];
                for(const k in this.initTrackLatLon)
                {
                    waypx.push(L.latLng(this.initTrackLatLon[k].lat,this.initTrackLatLon[k].lon));
                }
                return waypx;

            },
       
        startLeafletMap() {

           

            var shipIcon = L.icon({
            iconUrl:require('leaflet/dist/images/marker-icon.png'),
            iconSize:[20,30]
            });
            var self = this;
            var lengtd = this.initTrackLatLon.length;
         
            this.myMap = L.map('leaflet-map').setView([this.initTrackLatLon[0].lat, this.initTrackLatLon[0].lon], 10);
            
            L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
                maxZoom: 10,
                attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            }).addTo(this.myMap);
           
            
            this.marker = L.marker([this.initTrackLatLon[0].lat, this.initTrackLatLon[0].lon]).addTo(this.myMap);
            this.secondmarker = L.marker([this.initTrackLatLon[lengtd-1].lat, this.initTrackLatLon[lengtd-1].lon]).addTo(this.myMap);
            
            
            
            
             
           
            L.Routing.control({
                    waypoints: [
                        L.latLng(self.initTrackLatLon[0].lat, self.initTrackLatLon[0].lon),
                        L.latLng(self.initTrackLatLon[lengtd-1].lat, self.initTrackLatLon[lengtd-1].lon)
                    ],
                    lineOptions: {
                        styles: [
                                    {color: 'black', opacity: 0.75, weight: 9},
                                    {color: 'white', opacity: 0.8, weight: 6},
                                    {color: '#00a174', opacity: 1, weight: 4}
                        ]
                    }
                })
                .on('routesfound',function(e){
                    console.log(e)
                    console.log(e.routes[0].coordinates[0].lat)
                   
                    
                    e.routes[0].coordinates.forEach((coord,index)=>{
                    
                        
                       setTimeout(function() {
                            self.marker.setLatLng([coord.lat,coord.lng]);
                        }, 100* index);
                    
                        
                    });
                    
                }).addTo(this.myMap);

                
                
                
                

                

               

            
            
        },
        
        onClickMap(){
            const self = this;
            var lengtd = this.initTrackLatLon.length;
            this.myMap.on('click', ev => {
                console.log(ev.latlng.lat)
                const id = this.socket.io.engine.id
                const sendList = [id, ev.latlng]
                this.socket.emit('on_click', sendList)
                this.secondmarker = L.marker([this.initTrackLatLon[lengtd-1].lat, this.initTrackLatLon[lengtd-1].lon]).addTo(this.myMap);
                L.Routing.control({
                    waypoints: [
                        this.waypointsx
                    ],
                    lineOptions: {
                        styles: [
                                    {color: 'black', opacity: 0.75, weight: 9},
                                    {color: 'white', opacity: 0.8, weight: 6},
                                    {color: '#00a174', opacity: 1, weight: 4}
                        ]
                    }
                })
                .on('routesfound',function(e){
                    console.log(e)
                    console.log(e.routes[0].coordinates[0].lat)
                    e.routes[0].coordinates.forEach((coord,index)=>{

                        setTimeout(() => {
                            self.marker.setLatLng([coord.lat,coord.lng]);
                            //self.socket.emit("update_waypoints_pos",e.routes[0].coordinates[0]);
                        }, 100 * index)
                        
                    });
                    
                }).addTo(this.myMap);
            });
            
        },
        
        

        
        

    },
    
    
}</script>