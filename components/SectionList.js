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
const returnTrue = () => true;

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    backgroundColor: '#fff',
    alignItems:'center',
    justifyContent:'center',
    right: 0,
    top: 0,
    bottom: 0,
    width: 15
  },

  item: {
    padding: 0
  },

  text: {
    fontWeight: '700',
    color: '#008fff'
  },
});

class SectionList extends Component {
  static propTypes = {

    /**
     * A component to render for each section item
     */
    component: PropTypes.func,

    /**
     * Function to provide a title the section list items.
     */
    getSectionListTitle: PropTypes.func,

    /**
     * Function to be called upon selecting a section list item
     */
    onSectionSelect: PropTypes.func,

    /**
     * The sections to render
     */
    sections: PropTypes.array.isRequired,

    /**
     * A style to apply to the section list container
     */
    style: PropTypes.oneOfType([
      PropTypes.number,
      PropTypes.object,
    ]),

    /**
     * A style to apply to the section list item
     */
    itemStyle: PropTypes.oneOfType([
      PropTypes.number,
      PropTypes.object,
    ]),

    /**
     * A style to apply to the section list text item
     */
    itemTextStyle: PropTypes.oneOfType([
      PropTypes.number,
      PropTypes.object,
    ])
  };

  constructor(props, context) {
    super(props, context);

    this.sections = this.generateSectionsList();

    this.onSectionSelect = this.onSectionSelect.bind(this);
    this.resetSection = this.resetSection.bind(this);
    this.detectAndScrollToSection = this.detectAndScrollToSection.bind(this);
    this.lastSelectedIndex = null;
  }

  onSectionSelect(sectionId, fromTouch) {
    this.props.onSectionSelect && this.props.onSectionSelect(sectionId);

    if (!fromTouch) {
      this.lastSelectedIndex = null;
    }
  }

  resetSection() {
    this.lastSelectedIndex = null;
  }

  detectAndScrollToSection(e) {
    const sectionItem = this.refs.sectionItem0;

    var { data } = this.props;
    var ev = e.nativeEvent.touches[0];
    var targetY = ev.pageY;

    sectionItem.measure((x, y, width, height, pageX, pageY) => {
      if(!pageY || targetY < y){
        return;
      }

      var index = Math.floor((targetY - pageY) / height);
      index = Math.min(index, this.sections.length - 1);

      var currentSection = this.sections[index];

      while ( (!data[currentSection] || !data[currentSection].length) && index > 0 ) {
        index--;
        currentSection = this.sections[index];
      }

      if (this.lastSelectedIndex !== index) {
        this.lastSelectedIndex = index;
        this.onSectionSelect(currentSection, true);
      }
    });
  }

  generateSectionsList() {
    var sections = [];

    var letterCode = 64;

    for(var i = 0; i < 26; i++) {
      letterCode++;

      sections.push(String.fromCharCode(letterCode));
    }

    sections.push("#");
    return sections;
  }

  componentWillUnmount() {
    this.measureTimer && clearTimeout(this.measureTimer);
  }

  render() {
    var SectionComponent = this.props.component;
    var { itemStyle, itemTextStyle } = this.props;

    var sections = this.sections.map((section, index) => {
      var child = SectionComponent ?
        <SectionComponent
          sectionId={section}
          title={section}
        /> :
        <View
          style={[styles.item, itemStyle]}
        >
          <Text style={[styles.text, itemTextStyle]}>{section}</Text>
        </View>;

        return (
          <View key={index} ref={'sectionItem'+index} pointerEvents="none">
            {child}
          </View>
        );
    });

    return (
      <View ref="view" style={[styles.container, this.props.style]}
        onStartShouldSetResponder={returnTrue}
        onMoveShouldSetResponder={returnTrue}
        onResponderGrant={this.detectAndScrollToSection}
        onResponderMove={this.detectAndScrollToSection}
        onResponderRelease={this.resetSection}
      >
        {sections}
      </View>
    );
  }
}

module.exports = SectionList;
