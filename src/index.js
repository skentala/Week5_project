import "./styles.css";

//https://geo.stat.fi/geoserver/wfs?service=WFS&version=2.0.0&request=GetFeature&typeName=tilastointialueet:kunta4500k&outputFormat=json&srsName=EPSG:4326

let data2, data3;

async function fetchData() {
    const url1 = "https://geo.stat.fi/geoserver/wfs?service=WFS&version=2.0.0&request=GetFeature&typeName=tilastointialueet:kunta4500k&outputFormat=json&srsName=EPSG:4326";
    const url2 = "https://statfin.stat.fi/PxWeb/sq/4bb2c735-1dc3-4c5e-bde7-2165df85e65f";
    const url3 = "https://statfin.stat.fi/PxWeb/sq/944493ca-ea4d-4fd9-a75c-4975192f7b6e";
    const res1 = await fetch(url1);
    const res2 = await fetch(url2);
    const res3 = await fetch(url3);
    const data1 = await res1.json();
    data2 = await res2.json();
    data3 = await res3.json();
    
    let map = L.map('map', {
        minZoom: -3
    });
    
    let geoJson = L.geoJSON(data1, {
        weight: 2,
        onEachFeature: getFeature
    }).addTo(map);
    
    map.fitBounds(geoJson.getBounds());
    
}

function getFeature(feature, layer) {
    if (!feature.properties.nimi) return;
    layer.bindTooltip(feature.properties.nimi);
    let index = "KU" + feature.properties.kunta;
    const posMigration = data2.dataset.value[data2.dataset.dimension.Tuloalue.category.index[index]];
    const negMigration = data3.dataset.value[data3.dataset.dimension.Lähtöalue.category.index[index]];
    layer.bindPopup(`<ul><li>Name: ${feature.properties.nimi}</li>`+
                        `<li>Positive migration: ${posMigration}</li>`+
                        `<li>Negative migration: ${negMigration}</li></ul>`);
}

fetchData();


