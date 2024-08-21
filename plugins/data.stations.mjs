import PluginBase from './pluginbase.mjs';
export default class StationsData extends PluginBase{
    
    constructor() {
        super();

        this.addEventListener('eventToPlugin', (e) => {
            if (e.detail.topic == 'mapCreated') {

                const data = new Promise((resolve, reject) => {
                    // hämta stations från localstorage
                    const stations = JSON.parse(localStorage.getItem('stations'));
                    if (stations) {
                        resolve(stations);
                    }
                    else {

                        fetch('/data/stations.json').then(response => response.json())
                        .then(data => {
                            const arr = data.RESPONSE.RESULT[0].TrainStation.map(station => {
                                return {
                                    name: station.AdvertisedLocationName,
                                    signature: station.LocationSignature.toUpperCase(),
                                    coords: this.#getcoords(station.Geometry.WGS84)
                                }
                            });

                            // spara stations till localstorage:
                            localStorage.setItem('stations', JSON.stringify(arr));

                            // skicka iväg promise
                            resolve(arr);
                        });
                    }
                });
                this.SendEvent('stationsLoaded', data); 
            }
            
        });        
    };
    #getcoords = (data) => {
        const regex = /POINT \((\d+\.\d+) (\d+\.\d+)\)/;
        const match = data.match(regex);
        if (match) {
            return [parseFloat(match[1]), parseFloat(match[2])];
        } else {
            return null;
        }
    }
}