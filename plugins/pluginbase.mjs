
export default class PluginBase extends EventTarget{
    constructor(options) {
        super();

    };
    
    SendEvent(topic, data) {
        // create an event object
        const options = {
            bubbles: false,
            cancelable: true,
            detail: {topic:topic, data: data, sender: this }
        };
        const event = new CustomEvent('eventFromPlugin',options);
        // dispatch the event
        this.dispatchEvent(event);
    }

  
}