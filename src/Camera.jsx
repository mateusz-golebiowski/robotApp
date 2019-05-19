import React, {Component} from 'react';

import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

import Paper from '@material-ui/core/Paper';


const styles = theme => ({
   
   Camera: {
        minHeight: 450,
        marginTop: theme.spacing.unit * 2,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: `${theme.spacing.unit * 2}px ${theme.spacing.unit * 3}px ${theme.spacing.unit * 3}px`,
   }
});

class Camera extends Component {
    constructor(props) {
        super(props);
               
        this.state = {
        
        };
 
    }

    componentDidMount() {
        console.log('Camera is ready!');
    };

    render() {
        const { classes } = this.props;
        return (
            <Paper className={classes.Camera}></Paper>
        );
    }
}

Camera.propTypes = {
    classes: PropTypes.object.isRequired,
};
  
export default withStyles(styles)(Camera);