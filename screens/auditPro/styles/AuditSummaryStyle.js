// Updated AuditSummaryStyle.js with modern and attractive design
import { StyleSheet, Dimensions } from 'react-native';
import { width } from 'react-native-dimension';
import Fonts from '../Themes/Fonts';

const Window = Dimensions.get('window');

export default StyleSheet.create({
  wrapper: {
    flex: 1,
   // backgroundColor: '#F5F7FA'
  },
  header: {
    width: '100%',
    flexDirection: 'row',
   // backgroundColor: '#00BAC8',
    paddingHorizontal: 10,
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 65,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  backlogo: {
    width: width(15),
    alignItems: 'center',
    justifyContent: 'center',
  },
  heading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  headingText: {
    fontSize: Fonts.size.mediump,
    color: '#fff',
    fontFamily: 'OpenSans-Bold'
  },
  headerDiv: {
    width: width(15),
    alignItems: 'center',
    justifyContent: 'center'
  },
  subHeading: {
    height: 50,
    backgroundColor: '#fff',
    borderBottomWidth: 3,
    borderBottomColor: '#123C95',
    alignItems: 'center',
    justifyContent: 'center'
  },
  subText: {
    fontSize: 18,
    color: '#123C95',
    fontFamily: 'OpenSans-Bold'
  },
  scrollViewBody: {
    padding: 15,
    backgroundColor: '#F5F7FA'
  },
  Carddiv1: {
    marginBottom: 20
  },
  box1: {
    flexDirection: 'row',
    marginBottom: 10
  },
  boxcard: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    marginRight: 5,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3
  },
  boxcard1: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    marginLeft: 5,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3
  },
  boxcard2: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    marginRight: 5,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3
  },
  boxcard3: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    marginLeft: 5,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3
  },
  boxcard31: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3
  },
  TextStyle: {
    fontSize: Fonts.size.small,
    color: '#888',
    fontFamily: 'OpenSans-Regular',
    marginBottom: 5
  },
  TextStyle1: {
    fontSize: 28,
    color: '#333',
    fontFamily: 'OpenSans-Bold'
  }
});