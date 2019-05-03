import React, {Component} from 'react';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';

import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';


import PropTypes from 'prop-types';
import CssBaseline from '@material-ui/core/CssBaseline';
import { withStyles } from '@material-ui/core/styles';

import './App.css';
import JoyStick from './JoyStick';
import Device from './Device';


import io from 'socket.io-client';



const styles = theme => ({
    
    main: {
        width: 'auto',
        display: 'block', // Fix IE 11 issue.
        
        [theme.breakpoints.up(700 + theme.spacing.unit * 3 * 2)]: {
          width: 700,
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
    list: {
        width: '100%',
    }
  });

class App extends Component {
    
    constructor(props) {
        super(props);
        
        this.state = {
            connected: false,
            address: "",
            devices: [],
            page:0,
            selectedIndex: -1,
            password: null,
            deviceId: null,
            openPassword: false,
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

     socket.on('update status', (data) => {
        console.log(data);
        let x = this.state.devices;
        x.forEach((item, index)=>{
            if(item.deviceId === data.deviceId){
                x[index].status = data.status;
            }
        });
        this.setState({devices: x});

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

  handleClickOpen = () => {
    this.setState({ openPassword: true });
    
  };

  handleClose = () => {
    this.setState({ password:null });

    this.setState({ openPassword: false });
  };
  handleConnect = () => {
    this.setState({ openPassword: false });
    const data = {
        deviceId: this.state.deviceId,
        password: this.state.password
    }
    this.state.socket.emit('control device',data);
  };

  handleDeviceListItemClick = (event, index, idDevice) => {

    this.setState({ selectedIndex: index });
    this.setState({ deviceId: idDevice });
    if(this.state.devices[index].passwordProtected){
        this.handleClickOpen();
    }else{
        const data = {
            deviceId: this.state.devicesId,
            password: null
        }
        this.state.socket.emit('control device',data);
    }
        
    
    

  };
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
            <List className={classes.list}>
                
                    {this.state.devices.map((data, index) =>
                    {
                        if(data.status==='idle'){
                            return (<ListItem
                            button
                            selected={this.state.selectedIndex === index}
                            onClick={event => this.handleDeviceListItemClick(event, index, data.id)}
                        >
                            <Device key={index} id={data.id} name={data.name} password={data.passwordProtected}/>
                        </ListItem>)
                        }else{
                            return (<ListItem
                            button
                            selected={this.state.selectedIndex === index}
                            
                        >
                            <Device key={index} id={data.id} name={data.name} password={data.passwordProtected}/>
                        </ListItem>)
                            
                        }
                    })}
                         
            </List>
            <Dialog
                open={this.state.openPassword}
                onClose={this.handleClose}
                aria-labelledby="form-dialog-title"
            >
          <DialogTitle id="form-dialog-title">Password</DialogTitle>
          <DialogContent>
            <DialogContentText>
              To connect to this device you need a password
            </DialogContentText>
            <TextField
              autoFocus
              margin="dense"
              id="password"
              label="Password"
              type="password"
              onChange={this.handleChange('password')}
              fullWidth
            />
          </DialogContent>
          <DialogActions>
          
            <Button onClick={this.handleClose} color="primary">
              Cancel
            </Button>
            <Button onClick={this.handleConnect} color="primary">
              Connect
            </Button>
          </DialogActions>
        </Dialog>
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
  