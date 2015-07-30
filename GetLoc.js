var divisionlat=0;
var divisionlon=0;
var latmin=0;
var longmin=0;
var longmax = 0;
var latmax = 0;

var map;

var lives =5;
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

function showLives(){
	var livediv =document.getElementById("lives");
	livediv.innerHTML = "lives:" + lives;
}

function GetGridID(event){
	ClickPos = event.latLng;
    var ClickLat = ClickPos.lat();
    var ClickLong = ClickPos.lng();
    var ClickLatRem = (latmax-ClickLat) - (latmax-ClickLat)%divisionlat;
    var ClickLongRem = (ClickLong-longmin) - (ClickLong-longmin)%divisionlon;
    var ClickLatKey = (ClickLatRem)/divisionlat;
    var ClickLongKey = (ClickLongRem)/divisionlon;
    console.log(ClickLongKey + ", "+ClickLatKey);
    var MainKey = ClickLongKey + '' + (Math.ceil(ClickLatKey));
    return MainKey;
}

function drawRect(lat1,lng1, lat0, lng0){
	var rectangle = new google.maps.Rectangle({strokeColor: 'red',
		strokeOpacity:1.0, fillColor:'red', map:map,
		bounds: new google.maps.LatLngBounds(
			new google.maps.LatLng(lat0,lng0),
			new google.maps.LatLng(lat1,lng1)
		)
	});
}
function paintGridAt(GridID, colour){
	
		
	GridIDLat = GridID%10;
	GridIDLong = (GridID - GridIDLat)/10;
	console.log(GridIDLat, GridIDLong)
	ColorSquareULCoLat=latmin + GridIDLat*divisionlat;

	ColorSquareULCoLon=longmax - GridIDLong*divisionlon;
	console.log(ColorSquareULCoLat, ColorSquareULCoLon);
	ColorSquareBRCoLat = latmin +(GridIDLat+1)*divisionlat;
	ColorSquareBRCoLon = longmax -(GridIDLong+1)*divisionlon;
	console.log(ColorSquareBRCoLat, ColorSquareBRCoLon);
	//var br = [51.549028703703016, -0.1146697998046875];
	//var ul = 51.568239056209464, -0.141448974609375
	drawRect(ColorSquareULCoLat,ColorSquareULCoLon, ColorSquareBRCoLat, ColorSquareBRCoLon);
	//drawRect(51.549028703703016, -0.1146697998046875, 51.568239056209464, -0.141448974609375);
	
	
	
}

function handleClick(event){
    
    //var x =GridKeyMap[parseInt(MainKey)]="dead";
    //GridKeyMap[parseInt(MainKey)]="dead";
    //console.log(x);
    if(lives>0){
        console.log("awf" +event.latLng);
        lives = lives-1;
        showLives();
        var MainKey = GetGridID(event);
        console.log(GridKeyMap[parseInt(MainKey)])
        paintGridAt(MainKey, '#FF0000');
        
	}else{
		var GameStatusDiv = document.getElementById("gamestatus");
		GameStatusDiv.innerHTML="Game Over - Reload";


	}
};

function getPlaces(){
	var request = {location: map.center, radius:'6000', query: 'church'};

	service = new google.maps.places.PlacesService(map);
	service.textSearch(request, handlePlaces);

	function handlePlaces(results, status){

		console.log("DEBUG:" + latmax)

		if (status == google.maps.places.PlacesServiceStatus.OK) {
		    for (var i = 0; i < results.length; i++) {
		        var place = results[i];
		        console.log(place);
		        placeLat = place.geometry.location.lat();
		        placeLon = place.geometry.location.lng();
		        var placeLatRem = (latmax-placeLat) - (latmax-placeLat)%divisionlat;
		        var placeLongRem = (placeLon-longmin) - (placeLon-longmin)%divisionlon;
		        var placeLatKey = (placeLatRem)/divisionlat;
		        var placeLongKey = (placeLongRem)/divisionlon;
		        var placeKey = parseInt(placeLatKey + '' + Math.ceil(placeLongKey));
		        GridKeyMap[placeKey] = "Church";
		        console.log(GridKeyMap[placeKey]);
		    }
			}

	}

	
}


function initializeMap(position) {

	showLives();
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
    
    map = new google.maps.Map(document.getElementById("mapcan"), myOptions);
    //alert("made map");
    google.maps.event.addListener(map, 'bounds_changed', function(){
        var bounds = map.getBounds();

        var se = bounds.getSouthWest();
        var ne = bounds.getNorthEast();
        latmin = se.lat();
        latmax = ne.lat();

        longmin = se.lng();
        longmax = ne.lng();
        divisionlat = (latmax-latmin)/10;
        divisionlon = (longmax-longmin)/10;

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
        

	    google.maps.event.addListener(map, 'click', handleClick);


    });

	

	google.maps.event.addListener(map, 'bounds_changed', getPlaces);
   
}










