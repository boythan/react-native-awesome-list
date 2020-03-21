import React, { Component, PropTypes } from 'react';
import { StyleSheet, View, TouchableOpacity, Image, ImageBackground, ViewPropTypes, FlatList, SectionList } from 'react-native';
import AwesomeListMode from './AwesomeListMode';
import AwesomeListStyle from './AwesomeListStyle';
import { isObject, isArray, isString } from './AwesomeListUtils';
import EmptyView from './EmptyView';
import PagingView from './PagingView';
import _ from 'lodash'
const DEFAULT_PAGING_DATA = {
    pageIndex: 1,
    pageSize: 20,
};

class AwesomeListComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            refreshing: true,
            emptyMode: AwesomeListMode.PROGRESS,
            pagingMode: AwesomeListMode.HIDDEN,
            sections: []
        };

    }

    static propTypes = {
        containerStyle: ViewPropTypes.style,
        listStyle: ViewPropTypes.style,
        emptyViewStyle: ViewPropTypes.style,

        source: ViewPropTypes.func,
        keyExtractor: ViewPropTypes.func,
        type: ViewPropTypes.string,

        renderItem: ViewPropTypes.func,
        renderSeparator: ViewPropTypes.func,

        transformer: ViewPropTypes.func,

        isPaging: ViewPropTypes.bool,
        isSectionList: ViewPropTypes.bool,

        renderSectionHeader: ViewPropTypes.func,
        createSections: ViewPropTypes.func,
        renderEmptyView: ViewPropTypes.func,
        renderErrorView: ViewPropTypes.func,
        renderProgress: PropTypes.func,

        listHeaderComponent: ViewPropTypes.func,
        emptyText: ViewPropTypes.string,
        filterEmptyText: ViewPropTypes.string,
        numColumns: ViewPropTypes.string,

    };

    static defaultProps = {
        keyExtractor: (item) => {
            if (item.id) {
                return item.id
            }

            if (isString(item))
                return item;

            console.log('You need to provide a key extractor')
        },
        renderSeparator: () => <View />,
        source: Promise.resolve([]),
        transformer: (response) => { return response },

        containerStyle: AwesomeListStyle.containerListStyle,
        listStyle: AwesomeListStyle.listStyle,

        isPaging: false,
        isSectionList: false,

        renderSectionHeader: null,
        createSections: null,
        renderEmptyView: null,
        listHeaderComponent: null,
        emptyText: 'No result',
        filterEmptyText: 'No filter result',
        renderErrorView: null,
        renderProgress: null,
        numColumns: 1

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
    isNoMoreData(newData) {
        if (!newData || !isArray(newData) || !this.props.isPaging || this.isSectionsList()) return true;
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
            this.pagingData = DEFAULT_PAGING_DATA
        }

        source(this.pagingData).then(response => {
            this.pagingData = { ...this.pagingData, pageIndex: this.pagingData.pageIndex + 1 }
            let data = transformer(response);
            let sections = [];
            this.noMoreData = this.isNoMoreData(data)

            if (!isArray(data)) {
                throw ('Data is not an array')
                return;
            }

            if (_.isEmpty(data) && this.state.data.length == 0) {
                this.setState({ data: [], sections, pagingMode: AwesomeListMode.HIDDEN, emptyMode: AwesomeListMode.EMPTY, refreshing: false })
                return;
            }

            if (this.isSectionsList()) {
                sections = this.props.createSections(data)
            }
            this.setState({ data: this.state.data.concat(data), sections, pagingMode: AwesomeListMode.HIDDEN, emptyMode: AwesomeListMode.HIDDEN, refreshing: false })


        }).catch(error => {
            console.log(error)
            if (this._unmounted) return;
            /**
             * if the first loading
             * display emptyView with error mode
             */
            if (this.pagingData.pageIndex === DEFAULT_PAGING_DATA.pageIndex) {
                this.setState({ pagingMode: AwesomeListMode.HIDDEN, emptyMode: AwesomeListMode.ERROR, data: [], sections: [], refreshing: false })
            } else {
                this.setState({ pagingMode: AwesomeListMode.ERROR, emptyMode: AwesomeListMode.HIDDEN, refreshing: false })

            }
        })
    }
    onRetry() {
        this.setState({ emptyMode: AwesomeListMode.PROGRESS }, this.start())
    }
    /**
     * this function help list refresh when list is scrolled down.
     * enable refreshing in list data
     * action refresh
     */

    onRefresh() {
        this.setState({ refreshing: true, emptyMode: AwesomeListMode.HIDDEN, pagingMode: AwesomeListMode.HIDDEN }, () => this.refresh())
    }

    /**
     * actual refresh data list
     * set data list is empty list,
     * call start function to recall source function.
     */
    refresh() {
        this.noMoreData = false;
        this.pagingData = null;
        this.setState({ data: [], sections: [], emptyMode: AwesomeListMode.PROGRESS, pagingMode: AwesomeListMode.HIDDEN }, () => this.start())
    }

    onEndReached() {
        if (this.noMoreData || !this.props.isPaging || this.state.data.length == 0 || this.state.pagingMode === AwesomeListMode.PROGRESS) {
            return;
        }

        this.setState({ pagingMode: AwesomeListMode.PROGRESS }, () => this.start())
    }

    /** Apply filter  to list*/
    applyFilter(actionFilter) {
        if ((!this.state.data || this.state.data.length === 0) && !this.orginData) {
            console.log('Cannot apply filter case the data is empty')
            return;
        }
        if (!this.orginData) {
            this.orginData = this.state.data
        }
        this.setState({ emptyMode: AwesomeListMode.PROGRESS }, () => this.calculateFilter(actionFilter))
    }
    /**
     * should not be call in acestor component
     * @param {*} actionFilter
     */
    calculateFilter(actionFilter) {
        const dataFilter = _.filter(this.orginData, (item, index) => {
            return actionFilter(item, index)
        })

        if (!dataFilter || dataFilter.length == 0) {
            this.setState({ data: [], sections: [], emptyMode: AwesomeListMode.FILTER_EMPTY, pagingMode: AwesomeListMode.HIDDEN })
        } else {
            let sections = []
            if (this.isSectionsList()) {
                sections = this.props.createSections(dataFilter)
            }
            this.setState({ data: dataFilter, sections, emptyMode: AwesomeListMode.HIDDEN, pagingMode: AwesomeListMode.HIDDEN })
        }
    }

    removeFilter() {
        if (!this.orginData) {
            console.log('You have not apply any filter data')
            return;
        }
        let sections = []
        if (this.isSectionsList()) {
            sections = this.props.createSections(this.orginData)
        }

        this.setState({ emptyMode: AwesomeListMode.HIDDEN, data: this.orginData, sections }, () => { this.orginData = null })
    }

    render() {
        const {
            containerStyle,
            listStyle,
            emptyViewStyle,
            source,
            type,
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
            filterEmptyText
        } = this.props;

        return (
            <View style={containerStyle}>
                {this.isSectionsList() ? <SectionList
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


                /> : <FlatList
                        style={listStyle}
                        data={this.state.data}
                        renderItem={(item) => renderItem(item)}
                        keyExtractor={(item, index) => keyExtractor(item, index)}
                        ItemSeparatorComponent={() => renderSeparator()}
                        refreshing={this.state.refreshing}
                        onRefresh={() => this.onRefresh()}
                        onEndReached={() => this.onEndReached()}
                        ListFooterComponent={() => (<PagingView mode={this.state.pagingMode} retry={() => this.onRetry()} />)}
                        onEndReachedThreshold={0.5}
                        ListHeaderComponent={listHeaderComponent}
                        numColumns={numColumns}
                    />

                }
                <EmptyView
                    mode={this.state.emptyMode}
                    retry={() => this.onRetry()}
                    renderEmptyView={renderEmptyView}
                    emptyText={emptyText} 
                    renderErrorView={renderErrorView && renderErrorView}
                    renderProgress={renderProgress && renderProgress}
                    filterEmptyText={filterEmptyText} />
            </View>
        )
    }
}

export default AwesomeListComponent;
