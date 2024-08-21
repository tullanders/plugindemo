import PluginBase from './pluginbase.mjs';
export default class TrainPositionData extends PluginBase{
    #deck;
    constructor() {
        super();

        this.addEventListener('eventToPlugin', (e) => {
            if (e.detail.topic == 'mapCreated') {
                    
                    this.#trvRequest();
            }
        });        
    };

    #trvRequest = () => {
        const d = new Date();
        d.setHours(d.getHours() - 1);
        const query = `
<REQUEST>
 <LOGIN authenticationkey="5bfb41124d124f1f974c24bf7bb053ad"/>
      <QUERY sseurl="true" objecttype="TrainPosition" namespace="järnväg.trafikinfo" schemaversion="1.1" limit="100">
      <FILTER>
        <GT name='TimeStamp' value='${d.toISOString()}' />
      </FILTER>
      <INCLUDE>Train.AdvertisedTrainNumber</INCLUDE>
      <INCLUDE>Train.JourneyPlanDepartureDate</INCLUDE>
      <INCLUDE>Position.WGS84</INCLUDE>
      <INCLUDE>TimeStamp</INCLUDE>
      <INCLUDE>Bearing</INCLUDE>
      <INCLUDE>Speed</INCLUDE>
      </QUERY>
</REQUEST>      
        `;   
        fetch('https://api.trafikinfo.trafikverket.se/v2/data.json', {
            method: 'POST',
            body: query,
            headers: {
                'Content-Type': 'text/xml'
            }
        }).then(response => response.json())
        .then(data => {
            // Hämta SSE-URL
            const url = data.RESPONSE.RESULT[0].INFO.SSEURL;
            this.#trvSse(url);

            // Parsa data
            this.#parseData(data);
        });
    }
    #trvSse = (url) => {
        const eventSource = new EventSource(url);
        eventSource.onmessage = (e) => {
            this.#parseData(JSON.parse(e.data));
        }
    }   
    #parseData = (data) => {
        const arr = data.RESPONSE.RESULT[0].TrainPosition.map(item => {
            return {
                position: this.#getcoords(item.Position.WGS84),
                speed: item.Speed,
                bearing: item.Bearing,
                timestamp: item.TimeStamp,
                train_id: item.Train.AdvertisedTrainNumber,
                date: item.Train.JourneyPlanDepartureDate.substring(0,10)
                
            };
        });
        const promise = new Promise((resolve, reject) => {
            resolve(arr);
        });
        this.SendEvent('trainsRecieved', promise);
    }    
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