import _ from "lodash";
import React, { Component } from "react";
import { FlatList, SectionList, View } from "react-native";
import Mode from "./AwesomeListMode";
import AwesomeListStyle from "./AwesomeListStyle";
import { isArray, isString } from "./AwesomeListUtils";
import EmptyView from "./EmptyView";
import PagingView from "./PagingView";

const DEFAULT_PAGE_SIZE = 20;

interface IAwesomeListProps {
  source?: any;
  transformer?: any;
  renderItem: any;
  keyExtractor?: any;
  isPaging?: boolean;
  pageSize?: number;

  containerStyle?: object;
  listStyle?: object;
  emptyViewStyle?: object;

  renderSeparator?: any;

  isSectionList?: boolean;
  renderSectionHeader?: any;
  createSections?: any;

  renderEmptyView?: any;
  renderErrorView?: any;
  renderProgress?: any;

  listHeaderComponent?: any;
  emptyText?: string;
  filterEmptyText?: string;
  numColumns?: number;
}

interface IAwesomeListState {
  data: any[];
  refreshing: boolean;
  emptyMode: typeof Mode.PROGRESS;
  pagingMode: typeof Mode.HIDDEN;
  sections: any[];
}

class AwesomeListComponent extends Component<
  IAwesomeListProps,
  IAwesomeListState
> {
  static defaultProps = {
    source: () => Promise.resolve([]),
    transformer: (response: any) => {
      return response;
    },

    isPaging: false,
    pageSize: DEFAULT_PAGE_SIZE,

    keyExtractor: (item: any) => {
      if (item.id) {
        return item.id;
      }

      if (isString(item)) return item;

      console.log("You need to provide a key extractor");
    },

    containerStyle: AwesomeListStyle.containerListStyle,
    listStyle: AwesomeListStyle.listStyle,

    renderSeparator: () => <View />,
    isSectionList: false,

    renderSectionHeader: null,
    createSections: null,
    renderEmptyView: null,
    listHeaderComponent: null,
    emptyText: "No result",
    filterEmptyText: "No filter result",
    renderErrorView: null,
    renderProgress: null,
    numColumns: 1,
  };

  DEFAULT_PAGING_DATA: { pageIndex: number; pageSize: number | undefined };
  private _unmounted: boolean | undefined;
  noMoreData: any;
  pagingData: any;
  originData: any;

  constructor(props: IAwesomeListProps) {
    super(props);
    this.state = {
      data: [],
      refreshing: true,
      emptyMode: Mode.PROGRESS,
      pagingMode: Mode.HIDDEN,
      sections: [],
    };

    this.DEFAULT_PAGING_DATA = {
      pageIndex: 1,
      pageSize: props.pageSize,
    };
  }

  componentDidMount() {
    this.start();
  }

  componentWillMount() {
    this._unmounted = false;
  }

  componentWillUnmount() {
    this._unmounted = true;
  }

  /**
   * Logic
   */
  isNoMoreData(newData: any[]) {
    if (
      !newData ||
      !isArray(newData) ||
      !this.props.isPaging ||
      this.isSectionsList()
    )
      return true;
    return this.pagingData ? newData.length < this.pagingData.pageSize : false;
  }

  isSectionsList() {
    return this.props.isSectionList;
  }

  /**CONTROL VIEW */

  /**
   * call API from source, and fill data to the list
   * if the component is unmounted => return;
   * if error, show emptyView with error mode, reset data to empty,
   *
   * if reponse is passed, fill data to the list, set empty mode is hidden
   */

  start() {
    if (this.noMoreData) return;

    const { source, transformer } = this.props;
    /**
     * if the first load in paging list, construct to pagingData,
     */
    if (!this.pagingData) {
      this.pagingData = this.DEFAULT_PAGING_DATA;
    }

    source(this.pagingData)
      .then((response: any) => {
        this.pagingData = {
          ...this.pagingData,
          pageIndex: this.pagingData.pageIndex + 1,
        };
        let data = transformer(response);
        let sections: any[] = [];
        this.noMoreData = this.isNoMoreData(data);

        if (!isArray(data)) {
          throw "Data is not an array";
        }

        if (_.isEmpty(data) && this.state.data.length === 0) {
          this.setState({
            data: [],
            sections,
            pagingMode: Mode.HIDDEN,
            emptyMode: Mode.EMPTY,
            refreshing: false,
          });
          return;
        }

        if (this.isSectionsList()) {
          sections = this.props.createSections(data);
        }
        this.setState({
          data: this.state.data.concat(data),
          sections,
          pagingMode: Mode.HIDDEN,
          emptyMode: Mode.HIDDEN,
          refreshing: false,
        });
      })
      .catch((error: any) => {
        console.log(error);
        if (this._unmounted) return;
        /**
         * if the first loading
         * display emptyView with error mode
         */
        if (this.pagingData.pageIndex === this.DEFAULT_PAGING_DATA.pageIndex) {
          this.setState({
            pagingMode: Mode.HIDDEN,
            emptyMode: Mode.ERROR,
            data: [],
            sections: [],
            refreshing: false,
          });
        } else {
          this.setState({
            pagingMode: Mode.ERROR,
            emptyMode: Mode.HIDDEN,
            refreshing: false,
          });
        }
      });
  }
  onRetry() {
    this.setState({ emptyMode: Mode.PROGRESS }, () => this.start());
  }
  /**
   * this function help list refresh when list is scrolled down.
   * enable refreshing in list data
   * action refresh
   */

  onRefresh() {
    this.setState(
      {
        refreshing: true,
        emptyMode: Mode.HIDDEN,
        pagingMode: Mode.HIDDEN,
      },
      () => this.refresh()
    );
  }

  /**
   * actual refresh data list
   * set data list is empty list,
   * call start function to recall source function.
   */
  refresh() {
    this.noMoreData = false;
    this.pagingData = null;
    this.setState(
      {
        data: [],
        sections: [],
        emptyMode: Mode.PROGRESS,
        pagingMode: Mode.HIDDEN,
      },
      () => this.start()
    );
  }

  onEndReached() {
    if (
      this.noMoreData ||
      !this.props.isPaging ||
      this.state.data.length === 0 ||
      this.state.pagingMode === Mode.PROGRESS
    ) {
      return;
    }

    this.setState({ pagingMode: Mode.PROGRESS }, () => this.start());
  }

  /** Apply filter  to list*/
  applyFilter(actionFilter: any) {
    if (
      (!this.state.data || this.state.data.length === 0) &&
      !this.originData
    ) {
      console.log("Cannot apply filter case the data is empty");
      return;
    }
    if (!this.originData) {
      this.originData = this.state.data;
    }
    this.setState({ emptyMode: Mode.PROGRESS }, () =>
      this.calculateFilter(actionFilter)
    );
  }
  /**
   * should not be call in acestor component
   * @param {*} actionFilter
   */
  calculateFilter(actionFilter: any) {
    const dataFilter = _.filter(this.originData, (item: any, index: number) => {
      return actionFilter(item, index);
    });

    if (!dataFilter || dataFilter.length === 0) {
      this.setState({
        data: [],
        sections: [],
        emptyMode: Mode.FILTER_EMPTY,
        pagingMode: Mode.HIDDEN,
      });
    } else {
      let sections = [];
      if (this.isSectionsList()) {
        sections = this.props.createSections(dataFilter);
      }
      this.setState({
        data: dataFilter,
        sections,
        emptyMode: Mode.HIDDEN,
        pagingMode: Mode.HIDDEN,
      });
    }
  }

  removeFilter() {
    if (!this.originData) {
      console.log("You have not apply any filter data");
      return;
    }
    let sections = [];
    if (this.isSectionsList()) {
      sections = this.props.createSections(this.originData);
    }

    this.setState(
      { emptyMode: Mode.HIDDEN, data: this.originData, sections },
      () => {
        this.originData = null;
      }
    );
  }

  render() {
    const {
      containerStyle,
      listStyle,
      keyExtractor,
      renderItem,
      renderSeparator,
      renderSectionHeader,
      renderEmptyView,
      listHeaderComponent,
      emptyText,
      renderErrorView,
      renderProgress,
      numColumns,
      filterEmptyText,
    } = this.props;

    return (
      <View style={containerStyle}>
        {this.isSectionsList() ? (
          <SectionList
            style={listStyle}
            renderItem={(item) => renderItem(item)}
            keyExtractor={(item, index) => keyExtractor(item, index)}
            ItemSeparatorComponent={() => renderSeparator()}
            renderSectionHeader={(section) => renderSectionHeader(section)}
            stickySectionHeadersEnabled={true}
            sections={this.state.sections}
            onRefresh={() => this.onRefresh()}
            ListHeaderComponent={listHeaderComponent}
            refreshing={this.state.refreshing}
          />
        ) : (
          <FlatList
            style={listStyle}
            data={this.state.data}
            renderItem={(item) => renderItem(item)}
            keyExtractor={(item, index) => keyExtractor(item, index)}
            ItemSeparatorComponent={() => renderSeparator()}
            refreshing={this.state.refreshing}
            onRefresh={() => this.onRefresh()}
            onEndReached={() => this.onEndReached()}
            ListFooterComponent={() => (
              <PagingView
                mode={this.state.pagingMode}
                retry={() => this.onRetry()}
              />
            )}
            onEndReachedThreshold={0.5}
            ListHeaderComponent={listHeaderComponent}
            numColumns={numColumns}
          />
        )}
        <EmptyView
          mode={this.state.emptyMode}
          retry={() => this.onRetry()}
          renderEmptyView={renderEmptyView}
          emptyText={emptyText}
          renderErrorView={renderErrorView && renderErrorView}
          renderProgress={renderProgress && renderProgress}
          filterEmptyText={filterEmptyText}
        />
      </View>
    );
  }
}

export default AwesomeListComponent;
