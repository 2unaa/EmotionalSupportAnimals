var key = config.apiKey;
var script = document.createElement('script');
script.src = "https://maps.googleapis.com/maps/api/js?key=" + key +"&libraries=places,geometry&callback=initMap";
script.async = true;

var map; 
var geocoder; 
var petStoreMarkers = []; //for the markers of the pet stores
var prevMarker; //stores the previous marker (to track whether they entered a 2nd or more address
var petCustomMarkerIcon;
var homeCustomMarkerIcon;
var autocomplete;

// Initialize and add the map 
 window.initMap =function(){ 
    map = new google.maps.Map(document.getElementById('map'), {  //default map value at csusm
    zoom: 13,
    center: {lat: 33.131710, lng: -117.164589 },
}); 
    geocoder = new google.maps.Geocoder(); //using geocoder now

    petCustomMarkerIcon = { //variable for the custom marker
        url: '/images/pawPin.png', // Path to your custom PNG image
        size: new google.maps.Size(52, 58), // Size of the image
        origin: new google.maps.Point(0, 0), // Origin of the image (usually 0,0)
        anchor: new google.maps.Point(24, 48) // Anchor point (center of the image)
    };
    homeCustomMarkerIcon = { //variable for the custom marker
        url: '/images/whitePin.png', // Path to your custom PNG image
        size: new google.maps.Size(50, 58), // Size of the image
        origin: new google.maps.Point(0, 0), // Origin of the image (usually 0,0)
        anchor: new google.maps.Point(24, 48) // Anchor point (center of the image)
    };

    var input = document.getElementById('addressInput'); //getting the input
    autocomplete = new google.maps.places.Autocomplete(input); //using autocomplete here
    
}

                // Moving the map to the user input
                function petFinder(){
                    var address = document.getElementById('addressInput').value; //getting the value of the address
                    clearPetStoreMarkers(); //clear the pet store markers from default value
                    geocoder.geocode({'address' :address}, function(results, status){ //using it here    
                        if(status === 'OK'){ //if valid
                        map.setCenter(results[0].geometry.location); //move to location
                        if (prevMarker) { //if there is a previous marker
                        prevMarker.setMap(null); // Remove the previous user-entered address marker
                    }
                        prevMarker = new google.maps.Marker({ //mark it
                        map: map,
                        position: results[0].geometry.location,
                        icon: homeCustomMarkerIcon
                        });
                    }
                    else{ //if not valid
                        alert('Address was not found');
                    }
                    searchPetStores(); // If pet stores were previously visible, search for them again
                });
                }

            //searches for pet stores
            function searchPetStores() {
            var location = map.getCenter(); //get the center of it
            var radius =  16093.44 ; // 10 miles in meters
            var name = 'Pet Store' //pet store 

            var request = { //used to store an object that contains parameters for an API request
                location: location,
                radius: radius,
                name: name
            };

            var service = new google.maps.places.PlacesService(map); //using places api
            service.nearbySearch(request, callback); //use nearby search to search for nearby places with pet store 

        }
        //function to search for all of them
        function callback(results, status) { 
            clearPetStoreMarkers(); //clearing the previous one
            if (status == google.maps.places.PlacesServiceStatus.OK) { //if valid
                var center = map.getCenter(); //getting the center of the map (location)
                for (var i = 0; i < results.length; i++) { //for loop going through how many places
                    var place = results[i]; //get the place
                    if (place.types.includes('pet_store')) { //check the places that include pet store
                            var distance = google.maps.geometry.spherical.computeDistanceBetween( //get the distance between the location and the pet stores
                            center,
                            place.geometry.location
                            );
                        if(distance <= 16093.44){ //if its less than 10 miles
                            var marker = new google.maps.Marker({  //marks it and stores it with parameters
                            map: map,
                            position: place.geometry.location,
                            title: place.name,
                            icon: petCustomMarkerIcon
                            });
                        petStoreMarkers.push(marker); //store it
                        }
                    }
                }
            }
        }
        //function to clear the petstore markers of default address
        function clearPetStoreMarkers() {
            for (var i = 0; i < petStoreMarkers.length; i++) { //going through each markers
                petStoreMarkers[i].setMap(null); // Remove pet store markers from the map
            }
            petStoreMarkers = []; // Clear the array
        }

        document.head.appendChild(script);