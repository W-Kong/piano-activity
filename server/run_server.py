import os
from flask import Flask, request, render_template, send_from_directory, jsonify
app = Flask(__name__, static_folder=None)

CLIENT_FOLDER = os.path.abspath('../client/build')

@app.route('/')
def welcome():
    return render_template('welcome.html')

# hard code some sequence
sequence = [
            ['G', 'A', 'G', 'F', 'E', 'F', 'G'],
            ['D', 'E', 'F', 'E', 'F', 'G'],
            ['G', 'A', 'G', 'F', 'E', 'F', 'G'],
            ['D', 'G', 'E', 'C']
           ]
part = 0
currentNote = 0
end = False

@app.route('/note', methods=['GET', 'POST'])
def note():
    result = None
    
    global currentNote
    global part
    global end

    if request.method == 'POST':
        notes = request.get_json()
        if sequence[part][currentNote] in notes:
            result = True
            
            #loopback sequence and note if all exhausted
            currentNote = (currentNote + 1) % len(sequence[part])
            if currentNote == 0:
                part = (part + 1) % len(sequence)
                if part == 0:
                    end = True
        else:
            result = False
    else:
        if not end:
           result = {'note': sequence[part][currentNote]}
        else :
           result = {'note': 'Fine'}
    
    return jsonify(result)

@app.route('/piano/', methods=['GET'])
def serve_app():
    return send_from_directory(CLIENT_FOLDER, 'index.html')

@app.route('/<path:path>', methods=['GET'])
def serve_static(path):
    print(path)
    return send_from_directory(CLIENT_FOLDER, path)

if __name__ == "__main__":
    app.debug = True
    app.run()
