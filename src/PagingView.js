import React, { Component } from 'react';
import { View, Text, ActivityIndicator, TouchableOpacity } from 'react-native';
import Mode from './AwesomeListMode';
import AwesomeListStyle from './AwesomeListStyle';
import PropTypes from 'prop-types';

// create a component
class PagingView extends Component {
  static propTypes = {
    mode: PropTypes.oneOf(Mode.HIDDEN, Mode.PROGRESS, Mode.ERROR),
    renderProgress: PropTypes.func,
    renderErrorView: PropTypes.func,
    retry: PropTypes.func,
  }

  static defaultProps = {
    mode: Mode.HIDDEN,
    renderProgress: null,
    renderErrorView: null,
    retry: null,
  }

  /**
   * Should not be override this method
   */
  renderProgressInternal() {
    if (this.props.mode === Mode.PROGRESS) {
      if (!this.props.renderProgress) {
        return this.renderProgress();
      }
      return this.props.renderProgress();
    }
    return null;
  }

  /**
   * Should not be override this method
   */
  renderErrorViewInternal() {
    if (this.props.mode === Mode.ERROR) {
      if (!this.props.renderErrorView) {
        return this.renderErrorView();
      }
      return this.props.renderErrorView();
    }
    return null;
  }

  retryInternal() {
    if (this.props.retry) {
      this.props.retry();
    }
  }

  /**
   * Override incase build another EmptyView in whole system
   * Incase change only few cases, we should use props.renderProgress
   */
  renderProgress() {
    return (<ActivityIndicator />);
  }

  /**
   * Override incase build another EmptyView in whole system
   * Incase change only few cases, we should use props.renderErrorView
   */
  renderErrorView() {
    return (
      <View>
        <Text style={AwesomeListStyle.textError}>Error View, insert a button to retry</Text>
        <TouchableOpacity activeOpacity={0.8} onPress={() => this.retryInternal()} style={AwesomeListStyle.buttonRetry}>
          <Text style={AwesomeListStyle.textButtonRetry}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  render() {
    // If mode not set or hidden do not render EmptyView
    if (!this.props.mode || this.props.mode === Mode.HIDDEN) return null;
    // Render EmptyView coresponds with it's mode
    return (
      <View style={AwesomeListStyle.pagingContainer}>
        {this.renderErrorViewInternal()}
        {this.renderProgressInternal()}
      </View>
    );
  }
}

export default PagingView;
