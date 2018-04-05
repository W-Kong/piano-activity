import React, { Component } from 'react';
import Piano from './Piano.js';

import './App.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentNote: null,
      progress: Array(2).fill(0),
      result: {
	'C': Array(2).fill(0),
	'C#Db': Array(2).fill(0),
	'D': Array(2).fill(0),
	'D#Eb': Array(2).fill(0),
	'E': Array(2).fill(0),
	'F': Array(2).fill(0),
	'F#Gb': Array(2).fill(0),
	'G': Array(2).fill(0),
	'G#Ab': Array(2).fill(0),
	'A': Array(2).fill(0),
	'A#Bb': Array(2).fill(0),
	'B': Array(2).fill(0),
      },
    }

    this.props.fetchNextNote().then((data) => {
      this.setState({currentNote: data.note});
    }).catch((err) => {
      this.setState({error: 'Unable to connect to the server'});
    });
  }

  onPress = (octave, keyNames) => {
    
    let audio = new Audio("/" + keyNames.join("") + 
	                  (octave+3).toString() + ".mp3");
    audio.play();

    //do not check answer after sequence ended
    if (this.state.currentNote === "Fine") {
      return;
    }
    
    this.props.checkAnswer(keyNames).then((data) => {
      console.log(data);
      
      const result = Object.assign(this.state.result);
      const currentNote = this.state.currentNote;
      const progress = this.state.progress.slice();

      if (data) {
        progress[0] = progress[0] + 1;
        result[currentNote][0] = result[currentNote][0] + 1; 
	
	//fetch new note when the answer is correct
	this.props.fetchNextNote().then((data) => {
          this.setState({currentNote: data.note});
	});
      } else {
	progress[1] = progress[1] + 1;
	result[currentNote][1] = result[currentNote][1] + 1;
      }
 
      this.setState({
        progress: progress,
        result: result
      });

    });
  }

  //fully match note first before fuzzy match
  matchNote() {

    var selected;
    const result = this.state.result.slice();

    for(var i = 0; i < result.length; i++){
      if (result[i].note === this.state.currentNote) {
        selected = result[i];
        break;
      }
    }

    if (!selected) {
      for(var i = 0; i < result.length; i++){
        if (result[i].note.includes(this.state.currentNote)) {
          selected = result[i];
          break;
        }
      }
    }
    return selected;
  }

  getNote() {
    return this.state.currentNote.replace('#', '♯').replace('b', '♭');
  }

  getResult() {
    const result = this.state.result;
    return (
      Object.keys(result).map((key) => 
        <li key={key}>
          {key}:    
	  <span className="App-note-correct"> {result[key][0]}</span>/
	  <span className="App-note-incorrect">{result[key][1]}</span>/
	  <span>{result[key][0] + result[key][1]}</span>
        </li>
      )
    );
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          {this.state.error ? `An error occurred: ${this.state.error}` : null}

        	  {
            this.state.currentNote ?
              <div className="App-note-name-display">{this.getNote()}</div>
            :
              <div className="App-note-loading">loading...</div>
          }
          When a note appears above, play the corresponding note on the piano keyboard.
        </header>
        <Piano
          numOctaves={3}
          onPress={this.onPress}
        />
        <div className="App-summary">
	  <span className="App-note-correct">{this.state.progress[0]}</span>/
	  <span className="App-note-incorrect">{this.state.progress[1]}</span>/
	  <span>{this.state.progress[0] + this.state.progress[1]}</span>
	</div>
	<div className="App-info">
	  <h>Breakdown</h>
          <ul className="App-list">{this.getResult()}</ul>
	</div>
      </div>
    );
  }
}

export default App;
