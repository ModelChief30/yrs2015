var divisionlat=0;
var divisionlon=0;
var latmin=0;
var longmin=0;
var longmax = 0;
var latmax = 0;
var randomnumber = 11;
//Math.floor(Math.random() * (99 - 0 + 1)) + 0;
var map;

var ClickSnd = new Audio("click.wav");
var WinSnd = new Audio("win.wav");
var HospSnd = new Audio("hospital.wav");

var ColourArray = ['', 'red', 'red', 'orange', 'orange', 'orange', 'yellow'];

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

function getDistance(event){
	var MainKey = GetGridID(event);
	var horDist = Math.abs((MainKey-MainKey%10)-(randomnumber-randomnumber%10));
	var verDist = Math.abs((MainKey%10)-(randomnumber%10));
	var DistanceKey = Math.floor(Math.sqrt(horDist^2 + verDist^2));
	return DistanceKey;
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

function drawRect(lat1,lng1, lat0, lng0, colour){
	var rectangle = new google.maps.Rectangle({strokeColor: colour,
		strokeOpacity:1.0, fillColor:colour, fillOpacity:1.0, map:map,
		bounds: new google.maps.LatLngBounds(
			new google.maps.LatLng(lat1,lng1),
			new google.maps.LatLng(lat0,lng0)
		)
	});
}
function paintGridAt(GridID, colour){
	
		
	GridIDLat = GridID%10;
	GridIDLong = (GridID - GridIDLat)/10;
	console.log(GridIDLat, GridIDLong)
	ColorSquareULCoLat=latmax - GridIDLat*divisionlat;

	ColorSquareULCoLon=longmin + GridIDLong*divisionlon;
	console.log(ColorSquareULCoLat, ColorSquareULCoLon);
	ColorSquareBRCoLat = latmax -(GridIDLat+1)*divisionlat;
	ColorSquareBRCoLon = longmin +(GridIDLong+1)*divisionlon;
	console.log(ColorSquareBRCoLat, ColorSquareBRCoLon);
	//var br = [51.549028703703016, -0.1146697998046875];
	//var ul = 51.568239056209464, -0.141448974609375
	drawRect(ColorSquareULCoLat,ColorSquareULCoLon, ColorSquareBRCoLat, ColorSquareBRCoLon, colour);
	//drawRect(51.549028703703016, -0.1146697998046875, 51.568239056209464, -0.141448974609375);
	if(GridKeyMap[GridID]==null){
		drawMarker(ColorSquareULCoLat,ColorSquareULCoLon, "zombie.png")
	}else if(GridKeyMap[GridID]=="Hospital"){
		drawMarker(ColorSquareULCoLat,ColorSquareULCoLon, "hospital.png")
	}else if(GridKeyMap[GridID]=="Target"){
		drawMarker(ColorSquareULCoLat,ColorSquareULCoLon, "safety.png")
	}
	
	
	
}

function drawMarker(KeyLat, KeyLng, MarkIcon){
	var MarkCenter = new google.maps.LatLng(KeyLat - divisionlat, KeyLng + divisionlon/2);
	var MarkImage = MarkIcon;
	var myMarker = new google.maps.Marker({
		position:MarkCenter,
		map: map,
		icon: MarkImage
	});
}

function handleClick(event){
    var GameStatusDiv = document.getElementById("gamestatus");
    //var x =GridKeyMap[parseInt(MainKey)]="dead";
    //GridKeyMap[parseInt(MainKey)]="dead";
    //console.log(x);
    if(lives>0){
        console.log("awf" +event.latLng);
        lives = lives-1;
        showLives();
        var MainKey = GetGridID(event);
        console.log(GridKeyMap[parseInt(MainKey)])
        if(GridKeyMap[parseInt(MainKey)]=="Target"){
        	paintGridAt(MainKey, 'black');
        	GameStatusDiv.innerHTML="You Win";
        	WinSnd.play();
        	setTimeout(function(){

        		var rectangle = new google.maps.Rectangle({strokeColor: 'green',
					strokeOpacity:1.0, fillColor:'yellow', fillOpacity:1.0, map:map,
					bounds: new google.maps.LatLngBounds(
					new google.maps.LatLng(latmax,longmin),
					new google.maps.LatLng(latmin,longmax)
					)
				});


        	}, 1000);

        }else if(GridKeyMap[parseInt(MainKey)]=="Hospital"){
        	HospSnd.play();
        	paintGridAt(MainKey, 'green');
        	lives = lives+1;

        }else{
        	ClickSnd.play();
        	if(getDistance(event)<7){
        		paintGridAt(MainKey, ColourArray[getDistance(event)]);
        	}else{
        		paintGridAt(MainKey, 'yellow');
        	}
        }
        
	}else{
		
		GameStatusDiv.innerHTML="Game Over - Reload";


	}
};

function getPlaces(){
	var request = {location: map.center, radius:'6000', query: 'hospital'};

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
		        GridKeyMap[placeKey] = "Hospital";
		        GridKeyMap[randomnumber]="Target";
		        console.log(GridKeyMap[placeKey]);
		    }
			}

	}

	
}


function initializeMap(position) {
	

	GridKeyMap[randomnumber]="Target";

	showLives();
    var lat = position.coords.latitude;
    var longit = position.coords.longitude;
    
    var myOptions = {
        center: new google.maps.LatLng(lat, longit),
        zoom: 11,
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










