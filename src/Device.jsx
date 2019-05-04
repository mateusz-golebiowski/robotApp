import React, {Component} from 'react';

import PropTypes from 'prop-types';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import VideocamIcon from '@material-ui/icons/Videocam';
import VpnKeyIcon from '@material-ui/icons/VpnKey';
import ToysIcon from '@material-ui/icons/Toys';
import LockIcon from '@material-ui/icons/Lock';
import Avatar from '@material-ui/core/Avatar';
import { withStyles } from '@material-ui/core/styles';


const styles = theme => ({


});

class Device extends Component {
    constructor(props) {
        super(props);
        this.state = {
            
        };
 
    }

    componentDidMount() {
        console.log('Device is ready');
        
    };

    render() {
        const { classes } = this.props;
        
        return (
            <>
                <Avatar>
                    <ToysIcon />
                </Avatar>
             
                <ListItemText primary={this.props.name} secondary={this.props.desc}/>
                {this.props.password && 
                <ListItemIcon>
                    <VpnKeyIcon />
                </ListItemIcon>
                }
                {this.props.cam &&
                <ListItemIcon>
                    <VideocamIcon />
                </ListItemIcon>
                }
                {this.props.status === 'busy' &&
                    <ListItemIcon>
                        <LockIcon />
                    </ListItemIcon>
                }
                </>
            
        );
    }
}

Device.propTypes = {
    classes: PropTypes.object.isRequired,
};
  
export default withStyles(styles)(Device);