
import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import * as mopidyActions from '../../services/mopidy/actions'

class ProgressSlider extends React.Component{

	constructor(props){
		super(props);
	}

	handleClick(e){
		var slider = e.target;
		if (slider.className != 'slider' ) slider = slider.parentElement;

		var sliderX = e.clientX - slider.getBoundingClientRect().left;
		var sliderWidth = slider.getBoundingClientRect().width;
		var percent = (sliderX / sliderWidth ).toFixed(2);
		
		if (this.props.connected && this.props.current_track){
			var destination_time = this.props.current_track.duration * percent;
			this.props.mopidyActions.setTimePosition(destination_time);
			this.setState({ animating: false });
		}
	} 

	render(){
		var percent = 0;
		if (this.props.connected && this.props.current_track){
			percent = this.props.time_position / this.props.current_track.duration;
			percent = percent * 100;
			if (percent > 1000){
				percent = 100;
			}
		}

		return (
			<div className={"progress slider horizontal "+this.props.play_state} onClick={ (e) => this.handleClick(e) } >
				<div className="track">
					<div className="progress" style={{ width: (percent)+'%' }}></div>
				</div>
			</div>
		);
	}
}

/**
 * Export our component
 *
 * We also integrate our global store, using connect()
 **/

const mapStateToProps = (state, ownProps) => {
	return {
		current_track: (state.core.current_track && state.core.tracks[state.core.current_track.uri] !== undefined ? state.core.tracks[state.core.current_track.uri] : null),
		connected: state.mopidy.connected,
		time_position: state.mopidy.time_position,
		play_state: state.mopidy.play_state
	}
}

const mapDispatchToProps = (dispatch) => {
	return {
		mopidyActions: bindActionCreators(mopidyActions, dispatch)
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(ProgressSlider)