import { StyleSheet, Dimensions } from 'react-native';
import { width } from 'react-native-dimension';
import Fonts from '../../Themes/Fonts';

let Window = Dimensions.get('window');

export default StyleSheet.create({
  // Header styles
  header: {
    width: '100%',
    zIndex: 3000,
    flexDirection: 'row',
    padding: 5,
    alignItems: 'center',
    justifyContent: 'center',
    height: 65,
    elevation: 4,
    shadowOffset: { width: 2, height: 10 },
    shadowColor: 'lightgrey',
    shadowOpacity: 0.5,
    shadowRadius: 4,
  },
  heading: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    width: '70%',
    height: 65,
  },
  headingText: {
    fontSize: Fonts.size.medium,
    fontFamily: 'OpenSans-Bold',
    color: '#fff',
    textAlign: 'center',
  },
  backlogo: {
    flexDirection: 'row',
    backgroundColor: 'transparent',
    width: '13%',
    height: 65,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerDiv: {
    width: '15%',
    height: 65,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  rightHeader: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    right: 10,
    height: 80,
  },
  backgroundImage: {
    resizeMode: 'stretch',
    width: '30%',
    height: 80,
    zIndex: 0,
  },

  // Footer styles
  footer: {
    bottom: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    backgroundColor: 'transparent',
    height: 65,
    zIndex: 3000,
  },
  footerDiv: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: 65,
    position: 'absolute',
  },
  footerLoader: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  footerTextContent: {
    color: 'white',
    fontSize: Fonts.size.regular,
  },
  footerDivContent: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Body styles
  auditPageBody: {
    flex: 1,
    zIndex: 10,
    marginLeft: 0,
    marginRight: 0,
    padding: 5,
    backgroundColor: 'white',
    justifyContent: 'center',
    paddingBottom: 0,
    marginBottom: 0,
    alignSelf: 'stretch',
  },
  wrapper: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-start',
  },

  // Card view styles
  scrollViewBody: {
    height: '100%',
    backgroundColor: 'transparent',
  },
  cardBox: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginVertical: 10,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    borderLeftWidth: 5,
    borderLeftColor: '#2CB5FD',
  },
  sectionTop: {
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    paddingBottom: 8,
  },
  sectionBottom: {
    paddingTop: 8,
  },
  sectionContent: {
    marginBottom: 4,
  },
  boxHeader: {
    color: '#888',
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 2,
    fontFamily: 'OpenSans-SemiBold',
  },
  boxContent: {
    fontSize: 14,
    color: '#2a2a2a',
    fontWeight: '500',
    fontFamily: 'OpenSans-Regular',
  },
});
