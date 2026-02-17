from flask import Flask

app = Flask(__name__)

@app.route("/")
def hello_world():
    return "<p>Python Hello, World!!!!</p>"

@app.route("/healthcheck")
def health_check():
    return "<p>200, 'Ok'</p>"

@app.route("/stam")
def hello_stam():
    return "<p>stam Hello, World!!!!</p>"

if __name__ == "__main__":
    app.run(debug=True, host='0.0.0.0',port=5000)
# flask run --port 8080 — запустить на другом порту.
# flask run --host=0.0.0.0 — сделать сервер доступным в локальной сети.
# flask --app app.py --debug run — запустить в режиме отладки (сервер будет сам перезагружаться при изменении кода).