import React, {Component} from 'react';

import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import nipplejs from 'nipplejs';
import KeyHandler, { KEYPRESS, KEYUP } from 'react-key-handler';

const styles = theme => ({
    controlPanel: {
        position: 'absolute',
        width: 200,
        height: 200
    },
    pad: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        left: 0
    }
   
});

class JoyStick extends Component {
    constructor(props) {
        super(props);
        this.handleMove = this.handleMove.bind(this);
        
        this.state = {
            lastOutput:{}
        };
 
    }

    componentDidMount() {
        console.log('JoyStick is ready');
        const options = {
            zone: document.getElementById('joyStick'),
            color: 'blue',
            mode: 'static',
            position: {left: '50%', top: '50%'},
        };
        const manager = nipplejs.create(options);
        
        manager.on('move', (evt, data) => {
            const output = this.prepareOutput(data);
            if(!this.isEqual(this.state.lastOutput,output)){
                console.log(output);
                this.handleMove(output);
                this.setState({lastOutput: output});
            }
        }).on('end', (evt, data)=>{
            const output = this.prepareOutput(data);
            if(!this.isEqual(this.state.lastOutput,output)){
                console.log(output);
                this.handleMove(output);
                this.setState({lastOutput: output});
            }
        });
    }

    isEqual = (val, obj) => {
        if(val.speedLeft === obj.speedLeft && val.speedRight === obj.speedRight 
            && val.direction === obj.direction){
            return true;
        }
        return false;
    }

    map = (val, fromLow, fromHigh, toLow, toHigh) =>{
        return Math.round((val - fromLow) * (toHigh - toLow) / (fromHigh - fromLow) + toLow);
    }

    prepareOutput = (data) => {
        let output = {
            speedLeft: 0,
            speedRight: 0,
            direction: 'up',
        };
        if(data !== 0 && data.direction){
            const posX = data.direction.x;
            const posY = data.direction.y;
            const posAngle = data.direction.angle;
            const distance = data.distance < 25 ? 25 : 50;
            if(posX === posAngle) {
                output.speedLeft = posX === 'left' ? this.map(distance , 0, 50, 0, 255) : 0;
                output.speedRight = posX === 'right' ? this.map(distance, 0, 50, 0, 255) : 0;
            }
            if(posY === posAngle){
                output.speedLeft = output.speedRight = this.map(distance, 0, 50, 0, 255);
            }
            output.direction = posY;
        }
        return output;
     }
 
    handleMove = (data) => {
        this.props.onMove(data);            
    }
    
    handleKeyClicked = (event)=> {
        
        let move;
        if(event.key==='w')
            move= { speedLeft: 255, speedRight: 255, direction: "up" };
        else if(event.key === 's')
            move= { speedLeft: 255, speedRight: 255, direction: "down" };
        else if(event.key === 'a')
            move= { speedLeft: 255, speedRight: 0, direction: "up" };
        else if(event.key === 'd')
            move= { speedLeft: 0, speedRight: 255, direction: "up" };

        if(!this.isEqual(this.state.lastOutput,move)){
            console.log(move);
            this.handleMove(move);
            this.setState({lastOutput: move});
        }
        
    }
    handleKeyUp = (event)=> {
        
        const move= { speedLeft: 0, speedRight: 0, direction: "up" };
        
        if(!this.isEqual(this.state.lastOutput,move)){
            console.log(move);
            this.handleMove(move);
            this.setState({lastOutput: move});
        }
    }
    render() {
        const { classes } = this.props;
        return (
            
            <div id='ControlPanel' className={classes.controlPanel}>
                <KeyHandler
                    keyEventName={KEYPRESS}
                    keyValue="w"
                    onKeyHandle={this.handleKeyClicked}
                />
                <KeyHandler
                    keyEventName={KEYPRESS}
                    keyValue="s"
                    onKeyHandle={this.handleKeyClicked}
                />
                <KeyHandler
                    keyEventName={KEYPRESS}
                    keyValue="a"
                    onKeyHandle={this.handleKeyClicked}
                />
                <KeyHandler
                    keyEventName={KEYPRESS}
                    keyValue="d"
                    onKeyHandle={this.handleKeyClicked}
                />
                <KeyHandler
                    keyEventName={KEYUP}
                    keyValue="w"
                    onKeyHandle={this.handleKeyUp}
                />
                <KeyHandler
                    keyEventName={KEYUP}
                    keyValue="s"
                    onKeyHandle={this.handleKeyUp}
                />
                <KeyHandler
                    keyEventName={KEYUP}
                    keyValue="a"
                    onKeyHandle={this.handleKeyUp}
                />
                <KeyHandler
                    keyEventName={KEYUP}
                    keyValue="d"
                    onKeyHandle={this.handleKeyUp}
                />

                <div className={classes.pad} id='joyStick'></div>
            </div>
        );
    }
}


JoyStick.propTypes = {
    classes: PropTypes.object.isRequired,
};
  
export default withStyles(styles)(JoyStick);