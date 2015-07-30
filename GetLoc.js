var divisionlat;
var divisionlon;
var latmin;
var longmin;

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
    /*google.maps.event.addListener(map, 'bounds_changed', function(){
        var bounds = map.getBounds();

        var se = bounds.getSouthWest();
        var ne = bounds.getNorthEast();
        latmin = se.lat();
        var latmax = ne.lat();

        longmin = se.lng();
        var longmax = ne.lng();
        divisionlat = (latmax-latmin)/10;
        divisionlon = (longmax-longmin)/10;

        for(var i=0;i<11;i++){
            for(var j=0;j<11;j++){
                var rectangle = new google.maps.Rectangle({
                strokeColor: '#FF0000',
                strokeOpacity: 1.0,
                strokeWeight: 1,
                fillColor: '#000000',
                fillOpacity: 0.02,
                map: map,
                bounds: new google.maps.LatLngBounds(
                  new google.maps.LatLng(latmin + i*divisionlat, longmin + j*divisionlon),
                  new google.maps.LatLng(latmin + i*divisionlat + divisionlat, 
                    longmin+j*divisionlon + divisionlon)
                )});
            }
        }
    });*/

    
    //alert("registered boundschanged handler");
    
    google.maps.event.addListener(map, 'click', function(event){
        ClickPos = event.latLng;

        var ClickLat = ClickPos.lat();
        var ClickLong = ClickPos.lng();
        var ClickLatRem = ClickLat - ClickLat%divisionlat;
        var ClickLongRem = ClickLong - ClickLong%divisionlon;
        var ClickLatKey = (ClickLatRem - latmin)/divisionlat;
        var ClickLongKey = (ClickLongRem - longmin)/divisionlon;
        alert(ClickPos);

    });
    //alert("registered click");

}








