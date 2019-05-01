import React, {Component} from 'react';
import './App.css';

import nipplejs from 'nipplejs';
import io from 'socket.io-client';


class App extends Component {
    constructor(props) {
        super(props);
        
        this.state = {connected: false};
 
        this.connect = this.connect.bind(this);
    }
  componentDidMount() {
    
        console.log('mount it!');
        
  };

  clicked(e) {
      console.log('You clicked me');
  }

  connect(e){
    e.preventDefault();
    this.setState({connected: true});


    console.log(e.target.ip.value);
    const socket = io(e.target.ip.value);
    socket.emit('register controller');

    socket.on('connect_error', function() {

        console.log("Sorry, there seems to be an issue with the connection!");
        socket.close();
    })
    socket.on('connect', function() {
        const x = document.getElementsByClassName("grid-container")[0];
        x.style.display = "grid";
    
        const y =  document.getElementById("form");
        y.style.display = "none";
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
     });


    
    
  }
  render() {

    return (
        <div>
            <form onSubmit={this.connect} id="form">
                <label htmlFor="ip">Ip</label><input type="text" id="ip" name="ip"></input>
            </form>
            <div id='id' className="grid-container">
                <div className="up">
                    <button onClick={this.clicked}><i className="upButton"></i></button>
                </div>
                <div className="left">
                    <button onClick={this.clicked}><i className="leftButton"></i></button>
                </div>
                <div className="pad" id='joyStick'></div>
                <div className="right">
                    <button onClick={this.clicked}><i className="rightButton"></i></button>
                </div>
                <div className="down">
                    <button onClick={this.clicked}><i className="downButton"></i></button>
                </div>
            </div>

        </div>
    );
  }
}

export default App;
