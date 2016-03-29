'use strict';
/* jshint esnext: true */

import React, {
  Component,
  ListView,
  StyleSheet,
  View,
  PropTypes,
  NativeModules
} from 'react-native';

import merge from 'merge';

import SectionHeader from './SectionHeader';
import SectionList from './SectionList';

const UIManager = NativeModules.UIManager;

const stylesheetProp = PropTypes.oneOfType([
  PropTypes.number,
  PropTypes.object,
]);

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
});

class LetterListView extends Component {

  static propTypes = {
    /**
     * The data to render in the listview
     */
    data: PropTypes.oneOfType([
      PropTypes.array,
      PropTypes.object,
    ]).isRequired,

    /**
     * Whether to show the section listing or not
     */
    hideSectionList: PropTypes.bool,

    /**
     * Functions to provide a title for the section header and the section list
     * items. If not provided, the section ids will be used (the keys from the data object)
     */
    getSectionTitle: PropTypes.func,
    getSectionListTitle: PropTypes.func,

    /**
     * Callback which should be called when a cell has been selected
     */
    onCellSelect: PropTypes.func,

    /**
     * Callback which should be called when the user scrolls to a section
     */
    onScrollToSection: PropTypes.func,

    /**
     * The cell element to render for each row
     */
    cell: PropTypes.func.isRequired,

    /**
     * A custom element to render for each section list item
     */
    sectionListItem: PropTypes.func,

    /**
     * A custom element to render for each section header
     */
    sectionHeader: PropTypes.func,

    /**
     * A custom element to render as footer
     */
    footer: PropTypes.func,

    /**
     * A custom element to render as header
     */
    header: PropTypes.func,

    /**
     * A custom function to render as footer
     */
    renderHeader: PropTypes.func,

    /**
     * A custom function to render as header
     */
    renderFooter: PropTypes.func,

    /**
     * An object containing additional props, which will be passed
     * to each cell component
     */
    cellProps: PropTypes.object,

    /**
     * Whether to set the current y offset as state and pass it to each
     * cell during re-rendering
     */
    updateScrollState: PropTypes.bool,

    /**
     * Styles to pass to the container
     */
    style: stylesheetProp,

    /**
     * Styles to pass to the section list container
     */
    sectionListStyle: stylesheetProp,

    /**
     * Styles to pass to the section list item container
     */
    sectionListItemStyle: stylesheetProp,

    /**
     * Styles to pass to the section list item text
     */
    sectionListItemTextStyle: stylesheetProp
  };

  constructor(props, context) {
    super(props, context);

    this.state = {
      dataSource: new ListView.DataSource({
        rowHasChanged: (row1, row2) => row1 !== row2,
        sectionHeaderHasChanged: (prev, next) => prev !== next
      })
    };

    this.sections = {};
    this.renderFooter = this.renderFooter.bind(this);
    this.renderHeader = this.renderHeader.bind(this);
    this.renderRow = this.renderRow.bind(this);
    this.renderSectionHeader = this.renderSectionHeader.bind(this);
    this.scrollToSection = this.scrollToSection.bind(this);
  }

  componentDidMount() {
    // push measuring into the next tick
    setTimeout(() => {
      UIManager.measure(React.findNodeHandle(this.refs.view), (x,y,w,h) => {
        this.containerHeight = h;
      });
    }, 0);
  }

  scrollToSection(section) {
    var y = this.props.headerHeight || 0;
    y = y - this.props.sectionHeaderHeight;

    var sectionY = this.sections[section];

    this.refs.listview.refs.listviewscroll.scrollTo(sectionY, 0, false);
    this.props.onScrollToSection && this.props.onScrollToSection(section);
  }

  renderSectionHeader(sectionData, sectionId) {
    var title = this.props.getSectionTitle ?
      this.props.getSectionTitle(sectionId) :
      sectionId;

    return (
      <SectionHeader
        component={this.props.sectionHeader}
        ref={`section_${sectionId}`}
        sectionHeaderRef={ ref => {
          setTimeout(() => {
            ref.measure((x, y, w, h) => {
              this.sections[sectionId] = y;
            });
          }, 0);
        }}
        title={title}
        sectionId={sectionId}
        sectionData={sectionData}
      />
    );
  }

  renderFooter() {
    var Footer = this.props.footer;
    return <Footer />;
  }

  renderHeader() {
    var Header = this.props.header;
    return <Header />;
  }

  renderRow(item, sectionId, index) {
    var CellComponent = this.props.cell;
    index = parseInt(index, 10);

    var isFirst = index === 0;

    var props = {
      isFirst,
      sectionId,
      index,
      item,
      onSelect: this.props.onCellSelect
    };

    return <CellComponent {...props} {...this.props.cellProps} />;
  }

  render() {
    var data = this.props.data;
    var dataIsArray = Array.isArray(data);
    var sectionList;
    var renderSectionHeader;
    var dataSource;

    if (dataIsArray) {
      dataSource = this.state.dataSource.cloneWithRows(data);
    } else {
      sectionList = !this.props.hideSectionList &&
        <SectionList
          style={this.props.sectionListStyle}
          itemStyle={this.props.sectionListItemStyle}
          itemTextStyle={this.props.sectionListItemStyle}
          onSectionSelect={this.scrollToSection}
          sections={Object.keys(data)}
          data={data}
          getSectionListTitle={this.props.getSectionListTitle}
          component={this.props.sectionListItem}
        />

      renderSectionHeader = this.renderSectionHeader;
      dataSource = this.state.dataSource.cloneWithRowsAndSections(data);
    }

    var renderFooter = this.props.footer ?
      this.renderFooter :
      this.props.renderFooter;

    var renderHeader = this.props.header ?
      this.renderHeader :
      this.props.renderHeader;

    var props = merge({}, this.props, {
      //onScroll: this.props.onScroll,
      dataSource,
      renderFooter,
      renderHeader,
      renderRow: this.renderRow,
      renderSectionHeader
    });

    return (
      <View ref="view" style={styles.container}>
        <ListView
          ref="listview"
          {...props}
        />
        {sectionList}
      </View>
    );
  }
}

module.exports = LetterListView;
