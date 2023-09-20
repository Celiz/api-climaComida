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

def get_provincia(latitude, longitude):
    complete_url = f"https://apis.datos.gob.ar/georef/api/ubicacion?lat={latitude}&lon={longitude}"
    response = requests.get(complete_url)
    data = response.json()
    
    return data

def format_provincia_data(data):
    if data.get("cantidad") != 0:
        data_provincia = {
            "provincia": data["ubicacion"]["provincia"]["nombre"]
        }
        return data_provincia
    else:
        return None
    
def format_weather_data(data):
    if data.get("cod") != 404:
        main_data = data["list"][0]["main"]
        weather_data = data["list"][0]["weather"][0]
        clouds_data = data["list"][0]["clouds"]
        wind_data = data["list"][0]["wind"]

        today = datetime.datetime.now().strftime('%A')
        today = today.capitalize()
        date = datetime.datetime.now().strftime('%d %B %Y')
        
        nextDays = []
        for i in range(1, 5):
            nextDay = datetime.datetime.now() + datetime.timedelta(days=i)
            nextDay = nextDay.strftime('%A')
            nextDay = nextDay.capitalize()
            nextDay = nextDay[:3]
            
            nextDays.append(nextDay)
            
            nextDaysData = data["list"][i]["main"]
            
            nextDaysData = {
                "temperature": round(nextDaysData["temp"]),
                "icon": data["list"][i]["weather"][0]["icon"],
                "pop": data["list"][i]["pop"],
                "max": round(data["list"][i]["main"]["temp_max"]),
            }
            
            nextDays[i-1] = {
                "day": nextDays[i-1],
                "data": nextDaysData,
                "icon": data["list"][i]["weather"][0]["icon"],
                "pop": data["list"][i]["pop"],
                "temperature": round(nextDaysData["temperature"]),
                "max": round(nextDaysData["max"])
            }
            
        formatted_data = {
            "temperature": round(main_data["temp"]),
            "humidity": main_data["humidity"],
            "description": weather_data["description"],
            "feelsLike": round(main_data["feels_like"]),
            "icon": weather_data["icon"],
            "clouds": clouds_data["all"],
            "pop": data["list"][0]["pop"],
            "today": today,
            "date": date,
            "wind": round(wind_data["speed"]*2.63),
            "city": data["city"]["name"],
            "country": data["city"]["country"],
            "nextDaysData": nextDays,
            "maxTemp": round(main_data["temp_max"]),
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
        formatted_weather_data = format_weather_data(weather_data)
        if formatted_weather_data:
            return jsonify(formatted_weather_data)
        else:
            return jsonify({"error": "City Not Found"})
    else:
        return jsonify({"error": "Weather data not available"})
    
    
@app.route('/provincia')
def provincia():
    latitude = request.args.get('lat')
    longitude = request.args.get('lon')
    
    provincia_data = get_provincia(latitude, longitude)
    
    if provincia_data:
        formatted_provincia_data = format_provincia_data(provincia_data)
        if formatted_provincia_data:
            return jsonify(formatted_provincia_data)
        else:
            return jsonify({"error": "City Not Found"})
    else:
        return jsonify({"error": "Weather data not available"})

if __name__ == '__main__':
    app.run()
