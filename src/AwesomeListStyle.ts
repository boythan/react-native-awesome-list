import { StyleSheet } from 'react-native';

export default StyleSheet.create({
    emptyContainer: {
        flex: 1,
        position: 'absolute',
        left: 0,
        top: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center',
        
    },
    pagingContainer: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    textEmpty: {
        fontSize: 16,
        color: 'rgba(69,90,100,0.5)',
        backgroundColor: 'transparent'
    },
    textError: {
        fontSize: 16,
        color: 'black',
        backgroundColor: 'white'
    },
    textButtonRetry: {
        fontSize: 16,
        color: 'red',
        backgroundColor: 'white'
    },
    buttonRetry: {
        padding: 16,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white'

    },
    containerListStyle: {
        flex: 1,
        width: '100%',
        height: '100%',
        backgroundColor: 'white', 

    },
    listStyle: {
        flex: 1,
        width: '100%',
        height: '100%',
        backgroundColor: 'white', 
        
    }
});
