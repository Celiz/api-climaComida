if ('geolocation' in navigator) {
    navigator.geolocation.getCurrentPosition(function(position) {

        const locButton = document.querySelector('.loc-button');
        const todayInfo = document.querySelector('.today-info');
        const todayWeatherIcon = document.querySelector('.today-weather i');
        const todayTemp = document.querySelector('.weather-temp');
        const daysList = document.querySelector('.days-list');

        var latitude = position.coords.latitude;
        var longitude = position.coords.longitude;

        var xhr = new XMLHttpRequest();
        xhr.open('GET', `/weather?lat=${latitude}&lon=${longitude}`, true);
        xhr.onreadystatechange = function() {
            if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
                var response = JSON.parse(xhr.responseText);
                
                todayInfo.querySelector('h2').textContent = response.today
                todayInfo.querySelector('span').textContent = response.date
                todayWeatherIcon.className = `bx bx-${response.icon}`;
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