const siteEl = document.getElementById('site')

const loginPageEl = document.getElementById('loginPage');


const placesDivEl = document.getElementById("places");

const ratingSelectEl = document.getElementById("ratingSelect");
const meetingRating = localStorage.getItem("meetingRating")
if (meetingRating !== null) {
  ratingSelectEl.value = meetingRating
}

function handleLoginSubmit(e) {
  const usernameInput = document.getElementById('username')
 
  e.preventDefault();
 
  loginPageEl.style.display = 'none'
  siteEl.style.display = 'block';
}

function handleRatingSubmit(e) {
  e.preventDefault();
  const el = document.getElementById("ratingSelect");
  const rating = el.options[el.selectedIndex].value;
  localStorage.setItem("meetingRating", rating);

}

function handlePhotosUpload(e) {
  const el = document.getElementById('photosInput');
  
  console.log(el.files)
}

document.getElementById('loginBtn').addEventListener('click', handleLoginSubmit)
document.getElementById('ratingBtn').addEventListener('click', handleRatingSubmit)
document.getElementById('photosInput').addEventListener('change', handlePhotosUpload)

function search() {
  const krakowLatLng = new google.maps.LatLng(50.049683, 19.944544);
  const mapOptions = {
    zoom: 12,
    center: krakowLatLng
  }
  const map = new google.maps.Map(document.getElementById("map"), mapOptions);
  const infoWindow = new google.maps.InfoWindow;
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function (position) {
      const pos = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      };

      infoWindow.setPosition(pos);

      map.setCenter(pos);
      const service = new google.maps.places.PlacesService(map);

      service.nearbySearch({
        location: pos,
        radius: 5500,
        type: ['restaurant'],
        fields: ['name', 'formatted_address', 'place_id', 'geometry']
      }, restaurantCallback);

      service.nearbySearch({
        location : pos,
        radius : 10000,
        type : ['movie_theater'],
        fields: ['name', 'formatted_address', 'place_id', 'geometry']
      }, movieTheaterCallback);

    }, function () {
      handleLocationError(true, infoWindow, map.getCenter());
    });
  } else {
    // Browser doesn't support Geolocation
    handleLocationError(false, infoWindow, map.getCenter());
  }

  function handleLocationError(browserHasGeolocation, infoWindow, pos) {
    infoWindow.setPosition(pos);
    infoWindow.setContent(browserHasGeolocation ?
        'Error: The Geolocation service failed.' :
        'Error: Your browser doesn\'t support geolocation.');
    infoWindow.open(map);
  }

  //
  const markers = []

  function restaurantCallback(results, status) {
    if (status === google.maps.places.PlacesServiceStatus.OK) {
      for (let i = 0; i < 2; i++) {
        console.log('restaurants', results[i])
        placesDivEl.innerHTML += `<p>Restaurant: ${results[i].name} ${results[i].vicinity}</p>`
        const marker = new google.maps.Marker({
          position: results[i].geometry.location,
        });
        marker.setMap(map);
        markers.push({marker, result: results[i]})

      }
    }
  }

  function movieTheaterCallback(results, status) {
    if (status === google.maps.places.PlacesServiceStatus.OK) {
      for (let i = 0; i < 2; i++) {
        console.log('cinemas', results[i])
        placesDivEl.innerHTML += `<p>Cinema: ${results[i].name} ${results[i].vicinity}</p>`
        const marker = new google.maps.Marker({
          position: results[i].geometry.location,
        });
        marker.setMap(map);
        markers.push({marker, result: results[i]})

      }
    }
    markers.map(({marker, result}) => {
      google.maps.event.addListener(marker, 'click', function () {
        infowindow1.setContent('<div><strong>' + place.name + '</strong><br>'+
                place1.formatted_address + '</div>');
         
          infowindow1.open(map, this);
      });
    })

  }
}

