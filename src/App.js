import React, {Component} from 'react';
import './App.css';

import nipplejs from 'nipplejs';
import net from 'net';


class App extends Component {
  componentDidMount() {
    const options = {
        zone: document.getElementById('joyStick'),
        color: 'blue'
    };
    const manager = nipplejs.create(options);
    manager.on('move', function(evt, data) {
        console.log(data);
    });
        console.log('mount it!');
  };

  render() {
    return (
        <div>
            <div id='id' className="grid-container">
                <div className="up">
                    <button>up</button>
                </div>
                <div className="left">
                    <button>left</button>
                </div>
                <div className="pad" id='joyStick'></div>
                <div className="right">
                    <button>right</button>
                </div>
                <div className="down">
                    <button>down</button>
                </div>
            </div>
        </div>
    );
  }
}

export default App;
