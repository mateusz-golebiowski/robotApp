import React, {Component} from 'react';

import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import nipplejs from 'nipplejs';

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
            
        };
 
    }
  componentDidMount() {
    console.log('mount it!');
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
            const move = {
                distance: data.distance,
                angle: data.angle
            }
            this.handleMove(move);
        
    
    }).on('end', (evt, data)=>{
        const move = {
            distance: data.distance,
            angle: data.angle
        }
        this.handleMove(move);

    });

  };

  handleMove = (data) => {
    
    this.props.onMove(data);            
    }
  render() {
    const { classes } = this.props;
    return (
        <div id='ControlPanel' className={classes.controlPanel}>
                <div className={classes.pad} id='joyStick'></div>
        </div>
    );
  }
}


JoyStick.propTypes = {
    classes: PropTypes.object.isRequired,
};
  
export default withStyles(styles)(JoyStick);