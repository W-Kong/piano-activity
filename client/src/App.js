import React, { Component } from 'react';
import Piano from './Piano.js';

import './App.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentNote: null,
      progress: Array(2).fill(0),
      result: [
	{note: "C", correct: 0, incorrect: 0},
	{note: "C#Db", correct:0, incorrect: 0},
	{note: "D", correct: 0, incorrect: 0},
	{note: "D#Eb", correct:0, incorrect: 0},
	{note: "E", correct:0, incorrect: 0},
	{note: "F", correct:0, incorrect: 0},
	{note: "F#Gb", correct:0, incorrect: 0},
	{note: "G", correct:0, incorrect: 0},
	{note: "G#Ab", correct:0, incorrect: 0},
	{note: "A", correct:0, incorrect: 0},
	{note: "A#Bb", correct:0, incorrect: 0},
	{note: "B", correct:0, incorrect: 0},
      ],
    }

    this.props.fetchNextNote().then((data) => {
      this.setState({currentNote: data.note});
    }).catch((err) => {
      this.setState({error: 'Unable to connect to the server'});
    });
  }

  onPress = (octave, keyNames) => {
    this.props.checkAnswer(keyNames).then((data) => {
      console.log(data);
      console.log(this.state.currentNote);
      const result = this.state.result.slice();
      var selected = this.matchNote(); 

      const progress = this.state.progress.slice();
      if (data) {
        progress[0] = progress[0] + 1;
        selected.correct = selected.correct + 1;

	//fetch new note when the answer is correct
	this.props.fetchNextNote().then((data) => {
          this.setState({currentNote: data.note});
        });
      } else {
	progress[1] = progress[1] + 1;
	selected.incorrect = selected.incorrect + 1;
      }

	this.setState({progress: progress});
	this.setState({result: result});

    });
  }

  matchNote() {
    var selected;
    
    const result = this.state.result.slice();
    for( var i = 0; i < result.length; i++ ){
      if (result[i].note === this.state.currentNote) {
        selected = result[i];
        break;
      }
    }
    if (!selected) {
      for( var i = 0; i < result.length; i++ ){
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
      result.map((result) =>
	<ul key={result.note}>
	  {result.note}: 
	  <span className="App-note-correct">{result.correct}</span>/
	  <span className="App-note-incorrect">{result.incorrect}</span>/
	  <span>{result.correct + result.incorrect}</span>
	</ul>)
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
	  {this.getResult()}
	</div>
      </div>
    );
  }
}

export default App;
