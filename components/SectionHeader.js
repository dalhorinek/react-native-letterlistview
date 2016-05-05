'use strict';

import React, {
  Component,
  PropTypes,
  StyleSheet,
  View,
  Text,
  NativeModules
} from 'react-native';

const UIManager = NativeModules.UIManager;

const styles = StyleSheet.create({
  container: {
    backgroundColor:'#f8f8f8',
    borderTopWidth: 1,
    borderTopColor: '#ececec'
  },
  text: {
    fontWeight: '700',
    paddingTop:2,
    paddingBottom:2,
    paddingLeft: 2
  }
});

class SectionHeader extends Component {

  static propTypes = {

    /**
     * The id of the section
     */
    sectionId: PropTypes.oneOfType([
      PropTypes.number,
      PropTypes.string
    ]),

    /**
     * A component to render for each section item
     */
    component: PropTypes.func,
  };

  render() {
    var SectionComponent = this.props.component;

    if (SectionComponent) {
      return (
        <View ref={this.props.sectionHeaderRef} onLayout={this.props.onLayout}>
          <SectionComponent {...this.props} />
        </View>
      );
    }

    return (
      <View ref={this.props.sectionHeaderRef} style={styles.container} onLayout={this.props.onLayout}>
        <Text style={styles.text}>{this.props.title}</Text>
      </View>
    );
  }
}

module.exports = SectionHeader;
