// 建立 Leaflet 地圖
var map = L.map('map');

// 設定經緯度座標
map.setView(new L.LatLng(36.7956657, -121.5270004), 8);

// 設定圖資來源
var osmUrl='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
var osm = new L.TileLayer(osmUrl, {minZoom: 7, maxZoom: 16});
map.addLayer(osm);

// 設定圖例

var legend = L.control({position: 'bottomright'});

legend.onAdd = function (map) {

    var div = L.DomUtil.create('div', 'info legend'),
        grades = [-10, 10, 30, 50, 70, 90],
        labels = [];

    // loop through our density intervals and generate a label with a colored square for each interval
    for (var i = 0; i < grades.length; i++) {
        div.innerHTML +=
            '<i style="background:' + getColor(grades[i] + 1) + '"></i> ' +
            grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
    }

    return div;
};

legend.addTo(map);

// 設定右上資訊欄
var info = L.control();

info.onAdd = function (map) {
    this._div = L.DomUtil.create('div', 'info'); // create a div with a class "info"
    this.update();
    return this._div;
};

// method that we will use to update the control based on feature properties passed
info.update = function (props) {
    this._div.innerHTML = '<h4>Earthquakes Info</h4>' +  (props ?
        '<b>' + props.name + '</b><br />' + props.density + ' people / mi<sup>2</sup>'
        : 'Hover over a circle');
};

info.addTo(map);

// 讀資料

var url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";
d3.json(url, function (json) {
	json.features.forEach(feature => {
		var circle = L.circle(
		[feature.geometry.coordinates[1], feature.geometry.coordinates[0]],   // 圓心座標
		feature.geometry.coordinates[2] * 1000,  // 半徑（公尺）
		{
			color: 'black',      // 線條顏色
			fillColor: getColor(feature.geometry.coordinates[2]), // 填充顏色
			fillOpacity: 0.5,   // 透明度
			weight: 1 // 線條粗細
		}
		).addTo(map);	
	});
});

function getColor(d) {
    return d > 90  ? '#ff6600' :
           d > 70  ? '#ff9966' :
           d > 50   ? '#ffcc99' :
           d > 30   ? '#ffff99' :
           d > 10   ? '#ccff66' :
                      '#66ff33';
}