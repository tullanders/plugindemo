import PluginBase from '../pluginbase.mjs';
export default class TrainLayer extends PluginBase{
    //Collects train data from different sources
    #layerGroup = new L.LayerGroup();
    #trains = new Map();
    constructor() {
        super();

        this.addEventListener('eventToPlugin', (e) => {
            if (e.detail.topic == 'mapCreated') {
                this.SendEvent('layersCreated', [{name:'Tåg', layer:this.#layerGroup}]);
            }
            if (e.detail.topic == 'trainsRecieved') {
                // update trains Map to get unique trains
                const promise = e.detail.data;
                promise.then(data => {
                    let obj = {};
                    data.forEach((item) => {
                        if (this.#trains.has(item.train_id)) obj = this.#trains.get(item.train_id);
    
                        obj = {...obj, ...item};
    
                        this.#trains.set(item.train_id, obj);
    
                        // find marker
                        const marker = this.#layerGroup.getLayers().find((m) => {
                            return m.train_id == item.train_id;
                        });
                        if (marker && item.position) {
                            marker.setLatLng([item.position[1], item.position[0]]);
                            marker.setIcon(this.#createDivIcon(obj));
                        }
                        else if (!marker && item.position) {
                            // create new marker
                            const marker = L.marker([item.position[1], item.position[0]], {icon: this.#createDivIcon(obj)});
                            marker.train_id = item.train_id;
                            marker.addTo(this.#layerGroup);
    
                            const color = (item.delay > 5) ? 'red' : 'darkgreen';
                            if (item.delay > 5) {
                                marker.setIcon(this.#createDivIcon(obj));
                            };
                        }
                        
    
                        if (marker) {
                            marker.bindPopup(this.#createPopup(obj));    
                        };
                        
                    });                    
                });

                
            }
            
        });        
    };

    #createPopup = (train) => {
        const speed = (train.speed) ? train.speed : '-';
        const bearing = (train.bearing) ? train.bearing : '-';
        const signature = (train.signature) ? train.signature : '-';
        const delay = (train.delay) ? train.delay : '-';
        const from = (train.from) ? train.from : '-';
        const to = (train.to) ? train.to : '-';
        const operator = (train.operator) ? train.operator : '-';
        const html = `
<table>
<tr><td><b>Tågnummer:</b></td>
    <td>
        <b><a href="#" 
            class="pluginClick" 
            data-event="trainDetailsClick" 
            data-value='{"trainId": "${train.train_id}"}'>
                ${train.train_id}
        </a></b>
    </td>
</tr>
<tr><td>Försening:</td>
    <td>${delay}</td></tr>  
<tr><td>Från:</td>
    <td>${from}</td></tr>  
<tr><td>Till:</td>
    <td>${to}</td></tr>  
<tr><td>Operatör:</td>
    <td>${operator}</td></tr>              
<tr><td>Senaste station:</td>
    <td>${signature}</td></tr>  
<tr><td>Hastighet:</td>
    <td>${speed}</td></tr>       
<tr><td>Bäring:</td>
    <td>${bearing}</td></tr>           
</table>   
        `;
        return html;
    };    
    #createDivIcon = (train) => {
        console.log(train);
        // create a divicon with a train icon
        const bearing = (train.bearing) ? train.bearing : 0;
        const color = (train.delay > 5) ? 'red' : 'darkgreen';
        let icon = '&#9650;';
        if (train.to && train.signature == train.to) {
            icon = '&#9632;';
        }
        else if (train.from && train.signature == train.from) {
            icon = '&#9679;';
        }
        const divIcon = L.divIcon({
            html: `<div style="color: ${color}; rotate:${bearing}deg" class="trainIcon" alt="${train.train_id}">${icon}</div>`,
            className: 'trainIcon',
            iconSize: [20, 20],
            iconAnchor: [10, 10]
        });
        return divIcon;
    };
}