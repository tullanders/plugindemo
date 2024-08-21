import PluginBase from '../pluginbase.mjs';
export default class OpenRailwayMapLayer extends PluginBase{
    
    constructor() {
        super();
        this.addEventListener('eventToPlugin', (e) => {
            if (e.detail.topic == 'mapCreated') {
                this.#createLayer();
            }
            
        });   
        this.#createLayer();
    };
    #createLayer = () => {
        const layers = [
            {
                name: 'OpenRailwayMap standard',
                layer: L.tileLayer('https://{s}.tiles.openrailwaymap.org/standard/{z}/{x}/{y}.png', {maxZoom: 18, attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, rendering CC-BY-SA OpenRailwayMap'})
            },
            {
                name: 'OpenRailwayMap maxspeed',
                layer: L.tileLayer('https://{s}.tiles.openrailwaymap.org/maxspeed/{z}/{x}/{y}.png', {maxZoom: 18, attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, rendering CC-BY-SA OpenRailwayMap'})
            },
            {
                name: 'OpenRailwayMap signals',
                layer: L.tileLayer('https://{s}.tiles.openrailwaymap.org/signals/{z}/{x}/{y}.png', {maxZoom: 18, attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, rendering CC-BY-SA OpenRailwayMap'})
            },
            {
                name: 'OpenRailwayMap electrification',
                layer: L.tileLayer('https://{s}.tiles.openrailwaymap.org/electrification/{z}/{x}/{y}.png', {maxZoom: 18, attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, rendering CC-BY-SA OpenRailwayMap'})
            },
            {
                name: 'OpenRailwayMap gauge',
                layer: L.tileLayer('https://{s}.tiles.openrailwaymap.org/gauge/{z}/{x}/{y}.png', {maxZoom: 18, attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, rendering CC-BY-SA OpenRailwayMap'})
            }
        ];
        this.SendEvent('layersCreated', layers); 
    }


}