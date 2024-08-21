import PluginBase from '../pluginbase.mjs';
export default class LeafletMap extends PluginBase{
    #control;
    #layers = new Map();
    constructor() {
        super();

        this.addEventListener('eventToPlugin', (e) => {

            // Create the map when the document is ready
            if (e.detail.topic == 'documentReady') {
                this.#createMap();
            }

            // Get Leaflet layers from plugin events
            if (e.detail.topic == 'layersCreated') {
                const layers = e.detail.data;
                if (Array.isArray(layers)) {
                    layers.forEach(layer => {
                        this.#addLayer(layer.layer, layer.name);
                        
                    });
                }
                else {
                    this.#addLayer(layers.layer, layers.name);
                }
            }            

            
        });        
    };

    
    #addLayer = (layer, name) => {
        this.#control.addOverlay(layer, name);
    }

    #createMap = () => {
        const mapDiv = document.createElement('div');
        mapDiv.id = 'map';
        document.body.appendChild(mapDiv);

        const baselayers = {
            'Grayscale map': L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {className:'leaflet-grayscale', maxZoom: 18,attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'}),
            'Color map': L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {maxZoom: 18,attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'})    
            };
        const overlays = {};

        const map = L.map('map').setView([63.0, 16.0], 5);

        this.#control = L.control.layers(baselayers, overlays).addTo(map);
        if (baselayers) Object.values(baselayers)[0].addTo(map);

        this.SendEvent('mapCreated',map);

    }

}
