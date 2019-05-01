import React, {Component} from 'react';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import PropTypes from 'prop-types';
import CssBaseline from '@material-ui/core/CssBaseline';
import { withStyles } from '@material-ui/core/styles';

import './App.css';

import nipplejs from 'nipplejs';
import io from 'socket.io-client';



const styles = theme => ({
    
    main: {
        width: 'auto',
        display: 'block', // Fix IE 11 issue.
        
        [theme.breakpoints.up(400 + theme.spacing.unit * 3 * 2)]: {
          width: 400,
          marginLeft: 'auto',
          marginRight: 'auto',
        },
    },
    button: {
        margin: theme.spacing.unit,
      },
    form:{
        width: '100%', // Fix IE 11 issue.
        marginTop: theme.spacing.unit,
    },
    root: {
        marginTop: theme.spacing.unit * 8,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: `${theme.spacing.unit * 2}px ${theme.spacing.unit * 3}px ${theme.spacing.unit * 3}px`,
    },
    submit: {
        marginTop: theme.spacing.unit * 3,
    },
  });

class App extends Component {
    
    constructor(props) {
        super(props);
        
        this.state = {
            connected: false,
            address: ""
        };
 
        this.connect = this.connect.bind(this);
    }
  componentDidMount() {
    
        console.log('mount it!');
        const x = document.getElementById("ControlPanel");
        x.style.display = "none";
        
  };

  clicked(e) {
      console.log('You clicked me');
  }

  connect(e){
    e.preventDefault();
    this.setState({connected: true});


    console.log(this.state.address);
    const socket = io(this.state.address);
    socket.emit('register controller');

    socket.on('connect_error', function() {

        console.log("Sorry, there seems to be an issue with the connection!");
        socket.close();
    })
    socket.on('connect', function() {
        const x = document.getElementById("ControlPanel");
        x.style.display = "block";
    
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

  handleChange = name => event => {
    this.setState({ [name]: event.target.value });
  };


  render() {
    const { classes } = this.props;
    return (
        <div className={classes.main}>
        <CssBaseline />
            <Paper className={classes.root}>
            
                <form onSubmit={this.connect} id="form" className={classes.form}> 
                    <TextField
                        id="standard-name"
                        label="Server Address"
                        className={classes.textField}
                        value={this.state.address}
                        onChange={this.handleChange('address')}
                        margin="normal"
                        required fullWidth
                    />
                    <Button variant="contained" color="primary" className={classes.button} type="submit">
                        Connect
                    </Button>
                </form>
                
            </Paper>
            <div id='ControlPanel'>
                <div className="pad" id='joyStick'></div>
            </div>
        </div>
    );
  }
}


App.propTypes = {
    classes: PropTypes.object.isRequired,
};
  
export default withStyles(styles)(App);
  