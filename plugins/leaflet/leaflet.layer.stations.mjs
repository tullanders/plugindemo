import PluginBase from '../pluginbase.mjs';
export default class StationLayer extends PluginBase{

    constructor() {
        super();

        this.addEventListener('eventToPlugin', (e) => {
            if (e.detail.topic == 'stationsLoaded') {
                const promise = e.detail.data;
                if (!promise) {
                    console.log('No data');
                    return;
                }
                promise.then(data => {
                    this.#createLayer(data);
                });                
            }
            
        });        
    };
    #createPopup = (station) => {
        const html = `
<table>
<tr><td><b>Signature:</b></td>
    <td>
        <b><a href="#" 
            class="pluginClick" 
            data-event="stationClick" 
            data-value='{"signature": "${station.signature}"}'>
                ${station.signature}
        </a></b>
    </td>
</tr>
<tr><td>Namn:</td>
    <td>${station.name}</td></tr>   
</table>   
        `;
        return html;
    };    
    #createLayer = (data) => {
        const layer = L.layerGroup();
        data.forEach(station => {
            const radius = 5;

            if (!station.coords) return;
            const marker = L.circleMarker([station.coords[1], station.coords[0]], 
                {radius: radius, color: 'black', fillOpacity: 1,fillColor:'white', weight: 1, opacity: 1})
            marker.signature = station.signature;
            marker.bindPopup(this.#createPopup(station));
            marker.addTo(layer);
            marker.on('mouseover', (e) => {
                marker.setStyle({radius: 10});
            });
            marker.on('mouseout', (e) => {
                marker.setStyle({radius: 5});
            });            
        });
        this.SendEvent('layersCreated', [{name:'Stationer', layer:layer}]);
    }
}