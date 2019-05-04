import React, {Component} from 'react';

import PropTypes from 'prop-types';

import { withStyles } from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';

const styles = theme => ({

    
});

class Device extends Component {
    constructor(props) {
        super(props);
        
        this.state = {
            
        };
        this.handleCloseErrorDialog = this.handleCloseErrorDialog.bind(this);

    }
    componentDidMount() {
        console.log('ErrorDialog is ready!');
        
    };

    handleCloseErrorDialog = () => { 
        this.props.onClose();               
    }

    render() {
        const { classes } = this.props;
        return (
            <div>
                <Dialog
                    open={this.props.open}
                    onClose={this.handleCloseErrorDialog}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogTitle id="alert-dialog-title">{"Error"}</DialogTitle>
                    <DialogContent>
                        <DialogContentText id="alert-dialog-description">
                            Cannot connect to the server
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.handleCloseErrorDialog} color="primary" autoFocus>
                            Ok
                        </Button>
                    </DialogActions>
                </Dialog>
            </div>
        );
    }
}

Device.propTypes = {
    classes: PropTypes.object.isRequired,
};
  
export default withStyles(styles)(Device);

