mapboxgl.accessToken = 'pk.eyJ1Ijoia2NoZ28iLCJhIjoiY2xzYzl0ZmdqMGV2MDJrc2J0d2QxY3BjMSJ9.j4YNLdElfmSsY_rztE1FJw';

const map = new mapboxgl.Map({
    container: 'my-map',
    style: 'mapbox://styles/mapbox/light-v11', //Mapbox Light style for the web map layer
    center: [-79.35, 43.75],
    zoom: 10,
    maxBounds: [
        [-80, 43], //Southwest boundary
        [-79, 44] //Northeast boundary
    ],
});

//Adding search control to map overlay, linked to plugin on HTML page.
const geocoder = new MapboxGeocoder({
    accessToken: mapboxgl.accessToken,
    mapboxgl: mapboxgl,
    countries: 'ca'
});

//Appending geocoder variable to the geocoder HTML div to position it on the page.
document.getElementById('geocoder').appendChild(geocoder.onAdd(map));

//Previous geocoder layer.
// map.addControl(
//     new MapboxGeocoder({
//         accessToken: mapboxgl.accessToken,
//         mapboxgl: mapboxgl,
//         countries: "ca"
//     })
// );

//Adding zoom and rotation controls to the web map. 
map.addControl(new mapboxgl.NavigationControl());

map.addControl(new mapboxgl.FullscreenControl());

map.on('load', () => {

    //Adding datasource from GeoJSON
    map.addSource('fil-resto', {
        type: 'geojson',
        data: 'https://raw.githubusercontent.com/kchartigango/ggr472-lab3/main/filipino-restaurants.geojson'
    });

    map.addLayer({
        'id': 'fil-resto-points',
        'type': 'circle',
        'source': 'fil-resto',
        'paint': {
            'circle-radius': ['interpolate', //The 'interpolate' expression produces gradual, continuous results between values.
            ['linear'], //Specifies linear interpolation between stops.
            ['zoom'], //The 'zoom' expression changes appearance with zoom level.
            10.5, 5, //When zoom is set at 10 or less, the radius will be 5px
            12, ['*', ['get', 'rating'], 4]], //When zoom is set at 12 or greater, the radius will be rating * 4.
            'circle-color': [
                'step', //The 'step' expression here will produce stepped results based on the retrieved values.
                ['get', 'rating'], //The 'get' expression will retrieve each property value from the 'rating' data field.
                '#ffffcc', //The color assigned to any values < first step.
                3.5, '#a1dab4', //The subsequent colors assigned to values >= each step.
                4.0, '#41b6c4',
                4.5, '#253494'
                ],
            'circle-stroke-color': 'teal',
            'circle-stroke-width': 1
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
            'text-color': 'teal'
        }
    });

//Adding interactivity based on HTML event.
//Adding event listener which returns map view to full screen on button click using the flyTo method.
document.getElementById('returnbutton').addEventListener('click', () => {
    map.flyTo({
        center: [-79.35, 43.75],
        zoom: 10,
        essential: true
    });
});

map.on('mouseenter', 'fil-resto-points', () => {
    map.getCanvas().style.cursor = 'pointer'; //This changes the cursor to pointer style when mouse is over a restaurant point.
});

map.on('mouseleave', 'fil-resto-points', () => {
    map.getCanvas().style.cursor = ''; //This returns cursor to its original style when mouse leaves the restaurant point.
});

map.on('click', 'fil-resto-points', (e) => {
    new mapboxgl.Popup() //Declaring a new popup object with each click on the point.
        .setLngLat(e.lngLat)
        .setHTML("<b>Restaurant Name:</b> " + e.features[0].properties.name + "<br>" +
            "<b>Rating (out of 5):</b> " + e.features[0].properties.rating) //Using click event properties to add text to the popup box.
        .addTo(map); //Show the popup on the web map.
});

});