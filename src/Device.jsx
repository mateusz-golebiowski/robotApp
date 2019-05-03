import React, {Component} from 'react';

import PropTypes from 'prop-types';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import InboxIcon from '@material-ui/icons/Inbox';
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
    console.log('mount it!');
    
  };

  
  render() {
    const { classes } = this.props;
    return (
        <div>
            <ListItemIcon>
                <InboxIcon />
            </ListItemIcon>
            <ListItemText primary={this.props.name} />
      </div>
    );
  }
}


Device.propTypes = {
    classes: PropTypes.object.isRequired,
};
  
export default withStyles(styles)(Device);