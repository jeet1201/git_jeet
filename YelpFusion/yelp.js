function initialize () { 

  initMap();
  // map.addListener('bounds_changed', function() {
    map.addListener('bounds_changed', function() {
        var newcor=map.getBounds();
        
        var ne = newcor.getNorthEast();
        var sw = newcor.getSouthWest();
        
        // v1 = ne.lat();
        // v2 = ne.lng();
        // v3 = sw.lat();
        // v4 = sw.lng();
        // l1=(v1+v3)/2;
        // l2=(v2+v4)/2;

         centre=map.getCenter();
         cx=centre.lat();
         cy=centre.lng();

         r1=Math.floor(google.maps.geometry.spherical.computeDistanceBetween(centre,ne));

        //r1= Math.pow( Math.pow(centre.lat()-v1 ,2)   *    (Math.pow(centre.lng()-v2),2)        ,0.5);
        //console.log(r1);

});
} 
l1=32.75;
l2=-97.13;
var r1; var centre, cx,cy;
function sendRequest () {

        deleteMarker();
        
      var xhr = new XMLHttpRequest();
      var termValue = encodeURI(document.getElementById("search").value);
      xhr.open("GET", "proxy.php?term="+termValue+"&longitude="+cy+"&latitude="+cx+"&radius="+r1+"&limit=10&sort_by=rating");
        //xhr.open("GET", "proxy.php?term="+termValue+"&longitude="+cy+"&latitude="+cx+"&limit=10&sort_by=rating");

   xhr.setRequestHeader("Accept","application/json");
   xhr.onreadystatechange = function () {
       if (this.readyState == 4) {
          var json = JSON.parse(this.responseText);
        
          //console.log(json); 
         
          if(json.error)
            document.getElementById("output").innerHTML+= "ERROR FOUND: location too wide<br>"
          else
          printName(json);

       }
   };
   xhr.send(null);
}

function initMap() {
        map = new google.maps.Map(document.getElementById('map'), {
          center: {lat: 32.75, lng: -97.13},
          zoom: 16
        });
        infoWindow = new google.maps.InfoWindow;

        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(function(position) {
            var pos = {
              lat: position.coords.latitude,
              lng: position.coords.longitude
            };
    
            map.setCenter(pos);
          }, function() {
            handleLocationError(true, infoWindow, map.getCenter());
          });
        } else {
          handleLocationError(false, infoWindow, map.getCenter());
        }
      }

var markerArray=[];
function mainMarker(x,y,name,i) {
      
      
        var marker = new google.maps.Marker({
          position: {lat: x, lng: y},
          map: map,
          label:(++i).toString(), 
         
          title: name
        });
        markerArray.push(marker);
      }

function deleteMarker(){

  for (var i = 0; i < markerArray.length; i++) {
    markerArray[i].setMap(null);
  }

}



function printName(json)
{


    document.getElementById("output").innerHTML = "";

    if(!json.businesses.length)
      document.getElementById("output").innerHTML+="No restaurants found <br> ";
    else
    for (var i = 0; i < json.businesses.length; i++)
    {

        document.getElementById("output").innerHTML += " <a href="+json.businesses[i].url+" >" + json.businesses[i].name + "</a><br>"+" <img style='width:100px;height:100px;'  src= "+json.businesses[i].image_url+"  alt='No image found'>"  +"  <br>"+ json.businesses[i].rating+" Stars"+"<br> <br>" ;
       mainMarker(json.businesses[i].coordinates.latitude,json.businesses[i].coordinates.longitude,json.businesses[i].name,i);
    }
}


//references: google.maps.com tutorials