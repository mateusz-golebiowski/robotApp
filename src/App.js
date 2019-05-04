import React, {Component} from 'react';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';

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
import ErrorDialog from './ErrorDialog';
import PasswordDialog from './PasswordDialog';
import Camera from './Camera';
import io from 'socket.io-client';



const styles = theme => ({
    
    main: {
        width: 'auto',
        display: 'block', // Fix IE 11 issue.
        
        [theme.breakpoints.up(800 + theme.spacing.unit * 3 * 2)]: {
            width: '95%',
            marginLeft: 'auto',
            marginRight: 'auto',
        },
    },
    button: {
        margin: theme.spacing.unit,
    },
    buttonBack:{
        margin: theme.spacing.unit*12,
        marginLeft: '80%',
        
    }, 
    form: {
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
        display: 'inline',
        backgroundColor: theme.palette.background.paper,
      },
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
            openPasswordDialog: false,
            openErrorDialog: false,
            camera: false,
            
        };
 
        this.connect = this.connect.bind(this);
    }

    componentDidMount() {
            console.log('App is ready!');
    };

    connect(e) {
        e.preventDefault();
        this.setState({connected: true});
        const socket = io(this.state.address);
        this.setState({socket: socket});
        
        socket.on('connect_error', () => {
            this.handleOpenErrorDialog();
            socket.close();
        });

        socket.on('add device', data =>{
            let x = this.state.devices;
            x.push(data);
            this.setState({devices: x});
        });

        socket.on('remove device', data => {
            let x = this.state.devices;
            x.forEach((item, index) => {
                if(item.id === data)
                x.splice(index);
            });
            this.setState({devices: x});
        });

        socket.on('validation result', data => {
            if(data.result){
                this.state.socket.emit('control device',{
                deviceId: this.state.deviceId,
                password: this.state.password
                });
                this.setState({page: 2});
            }
            else
                this.handleOpenErrorDialog();
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

        socket.on('update status', data => {
            let x = this.state.devices;
            
            x.forEach((item, index)=>{
                if(item.id === data.id){
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
        this.state.socket.emit('move device', data);
    }

    handleCloseErrorDialog = () => {
        this.setState({ openErrorDialog: false });
    };

    handleOpenErrorDialog = () => {
        this.setState({ openErrorDialog: true });
    };

    handleClosePasswordDialog = () => {
        this.setState({ openPasswordDialog: false });
        this.setState({ password:null });
    };

    handleOpenPasswordDialog = () => {
        this.setState({ openPasswordDialog: true });
        
    };
    handlePasswordSet = pass => {
        this.setState({ openPasswordDialog: false });
        this.setState({ password: pass });
        const data = {
            deviceId: this.state.deviceId,
            password: pass
        }

        this.state.socket.emit('validate password',data);
    }

    handleDeviceListItemClick = (event, index, idDevice) => {
        this.setState({ selectedIndex: index });
        this.setState({ deviceId: idDevice });
        this.setState({ camera: this.state.devices[index].cameraAvailable });
        if(this.state.devices[index].passwordProtected){
            this.handleOpenPasswordDialog();
        }else{
            const data = {
                deviceId: this.state.devices[index].id,
                password: null
            }

            this.state.socket.emit('control device',data);
            this.setState({page: 2});
        }
    };
    handleSignOut = () => {
        this.state.socket.close();
        this.setState({page: 0});
        this.setState({address: ""});
        this.setState({password: null});
    }
    handleButtonBack = () => {
        this.state.socket.emit('disable control');
        this.setState({page: 1});
        this.setState({password: null});
        this.setState({deviceId: null});
        this.setState({selectedIndex: -1});
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
                    <Button 
                        variant="contained" 
                        color="primary" 
                        className={classes.button} 
                        type="submit" 
                        message="Can't connect to the server"
                    >
                        Connect
                    </Button>
                </form>
                <ErrorDialog open={this.state.openErrorDialog} onClose={this.handleCloseErrorDialog}/>
            </Paper>
        }else if(this.state.page === 1 ){
            content = 
            <Paper className={classes.root}>
                <List className={classes.list}>
                    {this.state.devices.map((data, index) =>
                    {
                        if(data.status==='idle'){
                            return (
                            <ListItem
                                button
                                selected={this.state.selectedIndex === index}
                                onClick={event => this.handleDeviceListItemClick(event, index, data.id)}
                            >
                                <Device 
                                    key={index} 
                                    id={data.id} 
                                    name={data.name} 
                                    desc={data.description}
                                    cam={data.cameraAvailable}
                                    password={data.passwordProtected}
                                    status={data.status}
                                />
                            </ListItem>)
                        }else{
                            return (
                            <ListItem
                                button
                                selected={this.state.selectedIndex === index}    
                            >
                                <Device 
                                    key={index} 
                                    id={data.id} 
                                    name={data.name} 
                                    desc={data.description}
                                    cam={data.cameraAvailable}
                                    password={data.passwordProtected}
                                    status={data.status}
                                />
                            </ListItem>)
                                
                        }
                    })
                    }
                            
                </List>
                <Button  onClick={this.handleSignOut} variant="contained" color="primary" className={classes.button}>
                    Sign Out
                </Button>
                <PasswordDialog 
                    open={this.state.openPasswordDialog} 
                    onClose={this.handleClosePasswordDialog} 
                    onConnect={this.handlePasswordSet}
                />
                <ErrorDialog 
                    open={this.state.openErrorDialog}
                    onClose={this.handleCloseErrorDialog}
                    message="Wrong password"
                />
            </Paper>
        }else if(this.state.page === 2){
            content = 
            <>
                <Camera camera={this.state.camera}/>
                <JoyStick onMove={this.handleMove} />
                <Button  onClick={this.handleButtonBack} variant="contained" color="primary" className={classes.buttonBack}>
                    Back
                </Button>
            </>
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
  