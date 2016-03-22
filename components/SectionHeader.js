'use strict';

var React = require('react-native');
var {Component, PropTypes, StyleSheet, View, Text, NativeModules} = React;
var UIManager = NativeModules.UIManager;

var styles = StyleSheet.create({
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

export default class SectionHeader extends Component {

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
    var content = SectionComponent ?
      <SectionComponent {...this.props} /> :
      <Text style={styles.text}>{this.props.title}</Text>;

    return (
      <View ref="view" style={styles.container}>
        {content}
      </View>
    );
  }
}
