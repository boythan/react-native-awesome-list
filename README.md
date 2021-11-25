# React Native Custom List (Using FLatList, SectionList)

Help to implement FlatList, SectionList from React Native faster, iOS + Android

## Setup

```sh
npm install --save https://github.com/boythan/react-native-awesome-list.git
# --- or ---
yarn add https://github.com/boythan/react-native-awesome-list.git
```

## Using

```js
### FlatList with raw data
import AwesomeListComponent from "react-native-awesome-list";

//...


export default const RawDataAwesomeList = () => {
  const listRef = useRef(null)
  //...

  const source = () => {
    return Promise.resolve(YOUR_RAW_DATA_LIST)
  }

  //When you want to reload data in list
  //after this function called, awesomeList will run source then transformer again to fetch new data for list
  const refreshData = () => {
    listRef.refresh()
  }

  //render row item in list
  const renderItem = ({item, index}) => <Text>{item.name}</Text>

  return <AwesomeListComponent
            source={source}
            renderItem={(renderItem}
            ref={listRef}
        />

  //...
}

### FlatList with Promise, API call

import AwesomeListComponent from "react-native-awesome-list";

//...


export default const CustomerAwesomeList = () => {
  const listRef = useRef(null)
  //...

  //Receive a promise that return the data will be displayed in list
  const source = (paging) => {
    return API.customerList(paging)
  }

  //Custom data from source function, ensure return an array
  const transformer = (res) => {
    return res?.data?.data ?? []
  }

  //When you want to reload data in list
  //after this function called, awesomeList will run source then transformer again to fetch new data for list
  const refreshData = () => {
    listRef.refresh()
  }

  //render row item in list
  const renderItem = ({item, index}) => <Text>{item.name}</Text>

  return <AwesomeListComponent
            isPaging
            source={source}
            transformer={transformer}
            renderItem={renderItem}
            ref={listRef}
        />

  //...
}
### SectionList

import AwesomeListComponent from "react-native-awesome-list";

//...


export default const CustomerAwesomeList = () => {
  const listRef = useRef(null)
  //...

  //Receive a promise that return the data will be displayed in list
  const source = () => {
    return API.customerList()
  }

  //Custom data from source function, ensure return an array
  const transformer = (res) => {
    return res?.data?.data ?? []
  }
  //Custom data from source function, ensure return an array
  const createSections = (res) => {
    return [{
      title: "Section 1",
      data: []
    }]
  }

  //When you want to reload data in list
  //after this function called, awesomeList will run source then transformer again to fetch new data for list
  const refreshData = () => {
    listRef.refresh()
  }

  //render row item in list
  const renderItem = ({item, index}) => <Text>{item.name}</Text>
  const renderSectionHeader = ({section}) => <Text>{section?.title}</Text>

  return <AwesomeListComponent
            ref={listRef}
            isSectionList={true}
            source={source}
            renderItem={renderItem}
            transformer={transformer}
            renderSectionHeader={renderSectionHeader}
            createSections={createSections}

          />

  //...
}
```

## API

### Props

| Prop   |          Default          |      Type       | Description    |
| :----- | :-----------------------: | :-------------: | :------------- |
| source | () => Promise.resolve([]) | `() => Promise` | Source of data |

| transformer | (response) => response | `() => array` | Array will be displayed in list |
| renderItem | ({item, index}) => <View/> | `func` | render function for list item rendering |
| keyExtractor | (item) => item?.id ?? item | `func` | unique key for row |
| isPaging | false | `boolean` | list will be paging(load more) or not |
| pageSize | 20 | `number` | number of item will be load in each page |
| containerStyle | undefined | `style` | root wrapper style |
| listStyle | undefined | `style` | list style |
| emptyViewStyle | undefined | `style` | empty view style |
| renderSeparator | undefined | `func` | separator component |
| isSectionList | false | `boolean` | is section list or not |
| renderSectionHeader | undefined | `func` | section header component |
| createSections | undefined | `func` | receive section data follow format [{title: `string`, data: `array`}] |
| renderEmptyView | undefined | `func` | empty view (when data is empty) component |
| renderErrorView | undefined | `func` | error view (when source function is rejected) component |
| renderProgress | undefined | `func` | progress view (when source function is waiting promise) component |
| listHeaderComponent | undefined | `func` | List's header component |
| emptyText | "No result" | `text` | Custom empty text (when data is empty) |
| filterEmptyText | "No filter result" | `text` | Custom filter empty text (when filter data is empty) |
| numColumns | 1 | `number` | number of column in list |

### Methods

| method  | params |                          Description                          |
| :------ | :----: | :-----------------------------------------------------------: |
| refresh |  null  | Refresh data, awesomeList will re-run source then transformer |

| applyFilter | actionFilter | when you want to apply some filter for this list E.g listRef.applyFilter(item => item.isSelect) |
| removeFilter | null | when you want to remove all filter that you applied before |

## Enjoy

## Questions or suggestions?

Feel free to [open an issue](https://github.com/boythan/react-native-awesome-list/issues)
