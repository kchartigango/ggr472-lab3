mapboxgl.accessToken = 'pk.eyJ1Ijoia2NoZ28iLCJhIjoiY2xzYzl0ZmdqMGV2MDJrc2J0d2QxY3BjMSJ9.j4YNLdElfmSsY_rztE1FJw';

const map = new mapboxgl.Map({
    container: 'my-map',
    style: 'mapbox://styles/mapbox/light-v11', //Mapbox Light style for the web map layer
    center: [-79.35, 43.7],
    zoom: 10,
});

map.addControl(new mapboxgl.NavigationControl());

map.on('load', () => {

    //Adding datasource from GeoJSON
    map.addSource('fil-resto', {
        type: 'geojson',
        data: ''
    });

    map.addLayer({
        'id': 'fil-resto-points',
        'type': 'circle',
        'source': 'fil-resto',
        'paint': {
            'circle-radius': 4,
            'circle-color': 'purple',
        }
    });

    //Drawing layers on the GeoJSON restaurant points using the 'name' property
    map.addLayer({
        'id': 'fil-resto-labels',
        'type': 'symbol',
        'source': 'fil-resto',
        'layout': {
            'text-field': ['get', 'name'],
            'text-variable-anchor': ['bottom'],
            'text-radial-offset': 0.5,
            'text-justify': 'auto'
        },
        'paint': {
            'text-color': 'violet'
        }
    });
    
});