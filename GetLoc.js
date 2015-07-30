/*var divisionlat;
var divisionlon;
var latmin;
var longmin;*/
var GridKeyMap = new Object();
for(i=0;i<100;i++){
	GridKeyMap[i]=null;
}
console.log(GridKeyMap[99]);


function getLoc() {
    var wr = document.getElementById("errorRender")
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(initializeMap);
    } else { 
        wr.innerHTML = "Try a new browser.";
    }
}

/*function getResponse(event){
    
        ClickPos = event.latLng;

        var ClickLat = ClickPos.lat();
        var ClickLong = ClickPos.lng();
        var ClickLatRem = ClickLat - ClickLat%divisionlat;
        var ClickLongRem = ClickLong - ClickLong%divisionlon;
        var ClickLatKey = (ClickLatRem - latmin)/divisionlat;
        var ClickLongKey = (ClickLongRem - longmin)/divisionlon;
        alert(ClickLongKey + " "+ClickLatKey);


}*/

function initializeMap(position) {
    var lat = position.coords.latitude;
    var longit = position.coords.longitude;
    
    var myOptions = {
        center: new google.maps.LatLng(lat, longit),
        zoom: 12,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        disableDefaultUI: true,
        draggable: false,
        scrollwheel: false,
        disableDoubleClickZoom: true
    };
    
    var map = new google.maps.Map(document.getElementById("mapcan"), myOptions);
    //alert("made map");
    google.maps.event.addListener(map, 'bounds_changed', function(){
        var bounds = map.getBounds();

        var se = bounds.getSouthWest();
        var ne = bounds.getNorthEast();
        var latmin = se.lat();
        var latmax = ne.lat();

        var longmin = se.lng();
        var longmax = ne.lng();
        var divisionlat = (latmax-latmin)/10;
        var divisionlon = (longmax-longmin)/10;

        for(var i=0;i<11;i++){
            
            var Coordinates = [new google.maps.LatLng((latmin + i*divisionlat),(longmin)),
            	new google.maps.LatLng((latmin+i*divisionlat), (longmax))];
            var GridLinesHor = new google.maps.Polyline({
            	path: Coordinates,
            	strokeColor: "FF0000",
            	strokeOpacity: 1.0
            });
            GridLinesHor.setMap(map);

            var Coordinates = [new google.maps.LatLng((latmin),(longmin+i*divisionlon)),
            	new google.maps.LatLng((latmax), (longmin + i*divisionlon))];
            var GridLinesVert = new google.maps.Polyline({
            	path: Coordinates,
            	strokeColor: "FF0000",
            	strokeOpacity: 1.0
            });
            GridLinesVert.setMap(map);

          
        }
        function handleClick(event){
	        ClickPos = event.latLng;
	        var ClickLat = ClickPos.lat();
	        var ClickLong = ClickPos.lng();
	        var ClickLatRem = (latmax-ClickLat) - (latmax-ClickLat)%divisionlat;
	        var ClickLongRem = (ClickLong-longmin) - (ClickLong-longmin)%divisionlon;
	        var ClickLatKey = (ClickLatRem)/divisionlat;
	        var ClickLongKey = (ClickLongRem)/divisionlon;
	        console.log(ClickLongKey + ", "+ClickLatKey);
	        var MainKey = ClickLongKey + '' + (Math.ceil(ClickLatKey));
	        console.log(MainKey);
	        var x =GridKeyMap[parseInt(MainKey)]="dead";
	        GridKeyMap[parseInt(MainKey)]="dead";
	        console.log(x);

    	};

	    google.maps.event.addListener(map, 'click', handleClick);
    });

    
    //alert("registered boundschanged handler");

    //alert("registered click");

}








