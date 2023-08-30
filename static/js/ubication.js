if ('geolocation' in navigator) {
    navigator.geolocation.getCurrentPosition(function(position) {
        var latitude = position.coords.latitude;
        var longitude = position.coords.longitude;

        var xhr = new XMLHttpRequest();
        xhr.open('GET', `/weather?lat=${latitude}&lon=${longitude}`, true);
        xhr.onreadystatechange = function() {
            if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
                var response = JSON.parse(xhr.responseText);
                document.getElementById('temperature').textContent = response.temperature + "°C";
                document.getElementById('humidity').textContent = response.humidity + "%";
                document.getElementById('description').textContent = response.description;
                document.getElementById('clouds').textContent = response.clouds + "%";
            }
        };
        xhr.send();
    });
} else {
    console.log('Geolocation is not available');
}