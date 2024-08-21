import PluginBase from '../pluginbase.mjs';
export default class MyPosition extends PluginBase{
    #layerGroup = L.layerGroup();
    #marker;
    #watchId;
    #map;
    constructor() {
        super();

        this.addEventListener('eventToPlugin', (e) => {
            if (e.detail.topic == 'mapCreated') { 
                this.#startWatch();                    
            }                    
        });        
    };
    // Function to handle errors
    #errorCallback(error) {
        console.error(`Error occurred: ${error.message}`);
    };
    
    // Options for geolocation watch
    #options = {
        enableHighAccuracy: true, // Set to true for better accuracy, may use more battery
        timeout: 5000, // Time to wait before giving up (in milliseconds)
        maximumAge: 0 // Maximum cached position age, set to 0 to always request fresh data
    };

    #stopWatch() {
        navigator.geolocation.clearWatch(this.#watchId);
    }; 

    #startWatch() {

        this.#watchId = navigator.geolocation.watchPosition(
            (position) => {
                console.log('Position:', position);
                if (!this.#marker) {
                    this.#createMarker(position);
                    this.SendEvent('layersCreated', [{name: 'myPosition', layer: this.#marker }]);
                }
                else {
                    this.#marker.setLatLng([position.coords.latitude, position.coords.longitude]);
                }
            }, 
            this.#errorCallback, 
            this.#options
        );
    };
    #createMarker(position) {
        this.#marker = L.circleMarker([position.coords.latitude, position.coords.longitude], 
            {
                radius: 8, 
                color: 'white', 
                fillOpacity: 1,
                fillColor:'blue', 
                weight: 1, 
                opacity: 1
            }
        );
    }

}