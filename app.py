import datetime
import locale
from flask import Flask, render_template, request, jsonify
import requests

app = Flask(__name__)

API_KEY = "31e3dfa472160d5972bfc0a67c451fc0"
API_URL = "http://api.openweathermap.org/data/2.5/forecast?"

locale.setlocale(locale.LC_TIME, 'es_ES')

def get_weather_data(latitude, longitude):
    complete_url = f"{API_URL}appid={API_KEY}&lat={latitude}&lon={longitude}&units=metric&lang=es"
    response = requests.get(complete_url)
    data = response.json()

    print(complete_url)
    return data

def format_weather_data(data):
    if data.get("cod") != 404:
        main_data = data["list"][0]["main"]
        weather_data = data["list"][0]["weather"][0]
        clouds_data = data["list"][0]["clouds"]
        wind_data = data["list"][0]["wind"]

        today = datetime.datetime.now().strftime('%A')
        today = today.capitalize()
        date = datetime.datetime.now().strftime('%d %B %Y')
        
        nextDaysData = []
        for i in range(1, 5):
            nextDay = datetime.datetime.now() + datetime.timedelta(days=i)
            nextDay = nextDay.strftime('%A')
            nextDay = nextDay.capitalize()
            nextDaysData.append(nextDay)


        formatted_data = {
            "temperature": round(main_data["temp"]),
            "humidity": main_data["humidity"],
            "description": weather_data["description"],
            "feelsLike": round(main_data["feels_like"]),
            "icon": weather_data["icon"],
            "clouds": clouds_data["all"],
            "today": today,
            "date": date,
            "wind": round(wind_data["speed"]*2.63),
            "city": data["city"]["name"],
            "country": data["city"]["country"],
            "nextDaysData": nextDaysData

        }

        print(formatted_data)
        return formatted_data
    else:
        return None

@app.route('/')
def index():
    return render_template('app.html')

@app.route('/weather')
def weather():
    latitude = request.args.get('lat')
    longitude = request.args.get('lon')
    
    weather_data = get_weather_data(latitude, longitude)

    if weather_data:
        formatted_data = format_weather_data(weather_data)
        if formatted_data:
            return jsonify(formatted_data)
        else:
            return jsonify({"error": "City Not Found"})
    else:
        return jsonify({"error": "Weather data not available"})

if __name__ == '__main__':
    app.run()
