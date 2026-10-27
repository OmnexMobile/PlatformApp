import { StyleSheet } from 'react-native'
import { width } from 'react-native-dimension'
import {Fonts, Metrics, Colors} from '../Themes/'

export default StyleSheet.create({
    container: {
        flex: 1,
        width: '100%',
        backgroundColor: '#F4F8FD',
    },
    flex_one: {
        flex: 1, paddingRight: 2, backgroundColor: "grey"
    },
    errorWrapper: {
        flex: 1,
        justifyContent: "center",
        alignItems: 'center'
    },
    wrapper: {
        flex: 1,
        flexDirection: "column",
        justifyContent: 'flex-start'
    },
    loaderParent: {
        paddingVertical: 20,
        width: "100%",
        justifyContent: 'center',
        alignItems: 'center'
    },
    //header
    header: {
        width:width(100),
        zIndex: 3000,
        flexDirection: 'row',
        padding: 5,
        alignItems: 'center',
        justifyContent: 'center',
        height: 65,
        elevation: 4,
        shadowOffset: { width: 2, height: 10 },
        shadowColor: "lightgrey",
        shadowOpacity: 0.5,
        shadowRadius: 4,
    },
    backlogo:{
        flexDirection: 'row',
        backgroundColor:'transparent',
        width: width(15),
        height: 65,
        justifyContent: 'center', 
        alignItems:'center'
    },
    heading:{
        flexDirection: 'column',
        justifyContent: 'center', 
        alignItems:'center', 
        width: width(70),
        height: 65
    },
    headingText:{
        fontSize: Fonts.size.h6,
        color: '#fff',
        textAlign: 'center',
        // fontWeight:'bold'
        fontFamily:'OpenSans-Bold'
    },
    headerDiv:{
        width:width(15),
        height: 65,
        flexDirection:'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    calendar: {
        paddingTop: 0,
        paddingBottom: 8,
        fontFamily: 'OpenSans-Regular',
        backgroundColor: 'transparent',
    },
    datePickersRow: {
        flexDirection: 'row',
        paddingHorizontal: 18,
        paddingTop: 20,
        paddingBottom: 18,
        gap: 14,
    },
    datePickerCard: {
        flex: 1,
        minHeight: 76,
        borderRadius: 22,
        borderWidth: 1.5,
        borderColor: '#D7E6FA',
        backgroundColor: '#FFFFFF',
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        shadowColor: '#527BAF',
        shadowOpacity: 0.06,
        shadowRadius: 6,
        shadowOffset: { width: 0, height: 2 },
        elevation: 2,
    },
    datePickerTextWrap: {
        flex: 1,
        minWidth: 0,
        marginLeft: 12,
    },
    datePickerLabel: {
        color: '#7C8CA5',
        fontFamily: 'OpenSans-Regular',
        fontSize: Fonts.size.small,
    },
    datePickerDropdown: {
        height: 30,
        flexDirection: 'row',
        alignItems: 'center',
    },
    datePickerValue: {
        color: '#102344',
        fontFamily: 'OpenSans-SemiBold',
        fontSize: Fonts.size.regular,
    },
    datePickerItem: {
        color: '#102344',
        fontFamily: 'OpenSans-Regular',
        fontSize: Fonts.size.regular,
    },
    calendarCard: {
        marginHorizontal: 18,
        paddingHorizontal: 14,
        paddingTop: 14,
        paddingBottom: 22,
        borderRadius: 28,
        backgroundColor: '#FFFFFF',
        shadowColor: '#567BAA',
        shadowOpacity: 0.08,
        shadowRadius: 14,
        shadowOffset: { width: 0, height: 5 },
        elevation: 3,
    },
    calendarDateHeader: {
        minHeight: 66,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 12,
    },
    calendarArrowButton: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: '#EFF5FD',
        alignItems: 'center',
        justifyContent: 'center',
    },
    calendarDateTitle: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 8,
    },
    calendarDateText: {
        marginLeft: 12,
        color: '#102344',
        fontFamily: 'OpenSans-SemiBold',
        fontSize: Fonts.size.regular,
        textAlign: 'center',
    },
})
