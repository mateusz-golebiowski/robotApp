import React, {Component} from 'react';
import './App.css';

import nipplejs from 'nipplejs';
import io from 'socket.io-client';


class App extends Component {
  componentDidMount() {
    const socket = io('http://192.168.1.206');
    
    socket.emit('register controller');

    const options = {
        zone: document.getElementById('joyStick'),
        color: 'blue',
        mode: 'static',
        position: {left: '50%', top: '50%'},
    };
    const manager = nipplejs.create(options);
    manager.on('move', (evt, data) => {
        console.log({
            distance: data.distance,
            angle: data.angle

            });
        socket.emit('move device', {
            distance: data.distance,
            angle: data.angle

            });
    
    }).on('end', (evt, data)=>{
        socket.emit('move device',  {
            distance: data.distance,
            angle: data.angle

            });
    });
        console.log('mount it!');
        
  };

  clicked(e) {
      console.log('You clicked me');
  }
  render() {
    return (
        <div>
            <div id='id' className="grid-container">
                <div className="up">
                    <button onClick={this.clicked}><i class="upButton"></i></button>
                </div>
                <div className="left">
                    <button onClick={this.clicked}><i class="leftButton"></i></button>
                </div>
                <div className="pad" id='joyStick'></div>
                <div className="right">
                    <button onClick={this.clicked}><i class="rightButton"></i></button>
                </div>
                <div className="down">
                    <button onClick={this.clicked}><i class="downButton"></i></button>
                </div>
            </div>
        </div>
    );
  }
}

export default App;
