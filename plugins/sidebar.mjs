import PluginBase from './pluginbase.mjs';
export default class Sidebar extends PluginBase{
    #sidebar;
    #sidebarcontent;
    #mapdiv;
    constructor() {
        super();

        this.addEventListener('eventToPlugin', (e) => {
            if (e.detail.topic == 'mapCreated') {
                this.#mapdiv = e.detail.data.getContainer();
                this.#create();

            }

            if (e.detail.topic == 'openSidebar') {
                const html = e.detail.data;
                this.#open(html);
            }
            
        });        
    };
    #open = (html) => {
        // Om sidebar inte är öppen, öppna den
        if (!this.#sidebar.classList.contains('opened')) {
            this.#sidebar.style.width = '450px';
            this.#mapdiv.style.marginLeft = '450px';
            document.body.style.width = 'calc(100% - 450px)';
            this.#sidebar.classList.add('opened');
        }

        // skapa rad
        const row = document.createElement('div');
        row.classList.add('row');

        // skapa x
        const x = document.createElement('div');
        x.classList.add('x');
        x.innerText = 'x';

        row.appendChild(x);

        x.addEventListener('click', (e) => {
            row.remove();
            if (this.#sidebar.querySelectorAll('.row').length == 0) {
                this.#close();
            }
        });

        this.#sidebar.appendChild(row);
        row.innerHTML = html;


    }

    #close = () => {
        this.#sidebar.style.width = '0';
        this.#sidebar.classList.remove('opened');
    }
    #create = () => {
        const sidebar = document.createElement('div');
        sidebar.id = 'sidebar';
        this.#sidebar = sidebar;

        // append a container for the sidebar
        this.#sidebarcontent = document.createElement('div');
        this.#sidebarcontent.id = 'sidebar-content';
        this.#sidebar.appendChild(this.#sidebarcontent);
        
        document.body.appendChild(this.#sidebar);
    }

}