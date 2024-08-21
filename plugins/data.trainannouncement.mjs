import PluginBase from './pluginbase.mjs';
export default class TrainAnnouncementData extends PluginBase{
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
        d.setHours(d.getHours() - 2);
        const query = `
<REQUEST>
      <LOGIN authenticationkey="5bfb41124d124f1f974c24bf7bb053ad"/>
      <QUERY sseurl="true" objecttype="TrainAnnouncement" schemaversion="1.9" orderby="TimeAtLocation">
      <FILTER>
        <GT name='TimeAtLocation' value='${d.toISOString()}' />
        <EXISTS name="Operator" value="true"/>
      </FILTER>
      <INCLUDE>ActivityType</INCLUDE>
      <INCLUDE>ScheduledDepartureDateTime</INCLUDE>
      <INCLUDE>AdvertisedTrainIdent</INCLUDE>
      <INCLUDE>AdvertisedTimeAtLocation</INCLUDE>
      <INCLUDE>TimeAtLocation</INCLUDE>
      <INCLUDE>LocationSignature</INCLUDE>
      <INCLUDE>Operator</INCLUDE>
      <INCLUDE>FromLocation</INCLUDE>
      <INCLUDE>ToLocation</INCLUDE>
      <INCLUDE>Canceled</INCLUDE>
      <INCLUDE>Deleted</INCLUDE>
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
        const arr = data.RESPONSE.RESULT[0].TrainAnnouncement.map(item => {
            return {
                train_id: item.AdvertisedTrainIdent,
                activity: item.ActivityType,
                advertisedTimeAtLocation: item.AdvertisedTimeAtLocation,
                canceled: item.Canceled,
                from: (item.FromLocation) ? item.FromLocation[0].LocationName.toUpperCase() : null,
                to: (item.ToLocation) ? item.ToLocation[0].LocationName.toUpperCase() : null,
                deleted: item.Deleted,
                operator: item.Operator,
                signature: item.LocationSignature.toUpperCase(),
                timeAtLocation: item.TimeAtLocation,
                delay: (item.AdvertisedTimeAtLocation && item.TimeAtLocation) ? 
                (new Date(item.TimeAtLocation) - new Date(item.AdvertisedTimeAtLocation)) / 1000 / 60  : null
                
            };
        });

        const promise = new Promise((resolve, reject) => {
            resolve(arr);
        });        

        this.SendEvent('trainsRecieved', promise);
    }

}