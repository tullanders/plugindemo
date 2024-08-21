
//import PluginEvent from './base/pluginEvent.mjs';
export default class PluginManager {

    #plugins;
    constructor(plugins) {
        

      this.#plugins = plugins;
  
      // If plugin has addEventListener, add eventlistener for eventFromPlugin
      // and emit eventToPlugin to all other plugins
      plugins.forEach(plugin => {
        if (plugin.addEventListener) {
          plugin.addEventListener('eventFromPlugin', (e) => {
            this.emitEvent(e);    
          });
        }


      });  

      // create eventlistner for when document is ready
      document.addEventListener('DOMContentLoaded', (e) => {
        const options = {
          detail: {topic:'documentReady', data: e, sender: this }
        };
        this.emitEvent(options);
      });



      // document click:
      document.addEventListener('click', (e) => {
        if (e.target.classList.contains('pluginClick')){ 
          e.preventDefault();
          const options = {
            detail: {topic:e.target.dataset.event, data: JSON.parse(e.target.dataset.value), sender: this }
          };
          this.emitEvent(options);
        };

      });
    };

    emitEvent = (e) => {
        this.#plugins.forEach(plugin => {
          //if (plugin !== e.detail.sender && plugin.addEventListener) {
            if (plugin.addEventListener) {
              const options = {
                  detail: {topic:e.detail.topic, data: e.detail.data, sender: e.detail.sender }
              };
              const event = new CustomEvent('eventToPlugin', options);                
              plugin.dispatchEvent(event);                    
            }
        }); 
    }

}