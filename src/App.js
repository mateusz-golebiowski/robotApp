import React, {Component} from 'react';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import PropTypes from 'prop-types';
import CssBaseline from '@material-ui/core/CssBaseline';
import { withStyles } from '@material-ui/core/styles';

import './App.css';
import JoyStick from './JoyStick';


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
            address: "",
            devices: [],
            page:0
        };
 
        this.connect = this.connect.bind(this);
        
    }
  componentDidMount() {
    
        console.log('mount it!');
        
        
  };

  connect(e){
    e.preventDefault();
    this.setState({connected: true});
    const socket = io(this.state.address);
    this.setState({socket: socket});
    

    socket.on('connect_error', function() {

        console.log("Sorry, there seems to be an issue with the connection!");
        socket.close();
    });

    socket.on('add device', data =>{
        console.log(data);
    });

    socket.on('devices list', data =>{
        console.log(data);
        this.setState({devices: data});
    });

    socket.on('connect', () => {
        socket.emit('register controller');
        socket.emit('get devices');
        this.setState({page: 1});

     });


    
    
  }

  handleChange = name => event => {
    this.setState({ [name]: event.target.value });
  };

  handleMove = data =>{
      console.log(data);
        this.state.socket.emit('move device', {
        distance: data.distance,
        angle: data.angle

        });
  }

  render() {
    const { classes } = this.props;

    let content = "";
    if(this.state.page === 0 ){
        content = 
        <Paper className={classes.root}>
        
            <form onSubmit={this.connect} id="form" className={classes.form}> 
                <Typography component="h1" variant="h5">
                        Connect to the server
                </Typography>
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
    }else if(this.state.page === 1 ){
        content = 
        <Paper className={classes.root}>
            {this.state.devices.map(data =><h1>{data.id}</h1>)}
        </Paper>
    }else if(this.state.page === 2){
        content = <JoyStick onMove={this.handleMove} />
    }
    return (
        <div className={classes.main}>
        <CssBaseline />
            {content}
            
        </div>
    );
  }
}


App.propTypes = {
    classes: PropTypes.object.isRequired,
};
  
export default withStyles(styles)(App);
  