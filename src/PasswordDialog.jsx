import React, {Component} from 'react';

import PropTypes from 'prop-types';

import { withStyles } from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';


const styles = theme => ({

    
});

class PasswordDialog extends Component {
    constructor(props) {
        super(props);
        
        this.state = {
            password: null,
        };
        this.handleClosePasswordDialog = this.handleClosePasswordDialog.bind(this);
        this.handleConnect = this.handleConnect.bind(this);
    }

    componentDidMount() {
        console.log('PasswordDialog is ready!');
        
    };

    handleClosePasswordDialog = () => {
        this.props.onClose();  
    }

    handleConnect = () =>{
        this.props.onConnect(this.state.password);
    }

    handleChange = name => event =>{
        this.setState({ [name]: event.target.value });
    }

    render() {
        const { classes } = this.props;
        return (
            <div>
                <Dialog
                    open={this.props.open}
                    onClose={this.handleClosePasswordDialog}
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
                    <Button onClick={this.handleClosePasswordDialog} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={this.handleConnect} color="primary">
                        Connect
                    </Button>
                </DialogActions>
            </Dialog>

        </div>
        );
    }
}

PasswordDialog.propTypes = {
    classes: PropTypes.object.isRequired,
};
  
export default withStyles(styles)(PasswordDialog);

