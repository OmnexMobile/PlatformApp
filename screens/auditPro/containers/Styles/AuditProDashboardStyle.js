import {StyleSheet, Platform} from 'react-native';
import {Fonts} from '../../Themes';
import colors from '../../Themes/Colors';
import { android15HeaderPadding } from '../../Themes/AndroidInsets';

const BASE_HEADER_HEIGHT = 60;

export default styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#f2f5f9',
  },
  header: {
    minHeight: BASE_HEADER_HEIGHT + android15HeaderPadding,
    paddingTop: android15HeaderPadding,
    paddingBottom: 10,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
  },
  welcomeTxtView: {
    flex: 1,
  },
  welcomeTxt: {
    fontSize: 18,
    color: '#1d1d1d',
    fontFamily: 'OpenSans-Bold',
  },
  headerIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
  },
  bellIcon: {
    position: 'relative',
    marginHorizontal: 8,
  },
  bellBadge: {
    position: 'absolute',
    top: -4,
    right: -6,
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: 'red',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  statusOuterView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    margin: 12,
  },
  statusView: {
    flex: 1,
    marginHorizontal: 5,
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
    shadowColor: '#aaa',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
  },
  statusheaderTxt: {
    fontSize: 24,
    fontFamily: 'OpenSans-Bold',
    color: '#333',
  },
  statusTxt: {
    fontSize: 13,
    fontFamily: 'OpenSans-Regular',
    color: '#888',
  },
  auditNotifyTxt: {
    fontSize: 14,
    textAlign: 'center',
    paddingVertical: 10,
    backgroundColor: '#ffffff',
    color: '#00b3d6',
    fontFamily: 'OpenSans-SemiBold',
  },
  showMyAll: {
    paddingVertical: 6,
  },
  cardTitle: {
    paddingHorizontal: 10,
    paddingVertical: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: 'white',
  },
  cardTitleTxt: {
    fontSize: 17,
    color: '#333',
    fontFamily: 'OpenSans-Bold',
  },
  moreTxt: {
    fontSize: 14,
    color: '#00A2E5',
    fontFamily: 'OpenSans-Regular',
  },
  bgWhite: {
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingHorizontal: 10,
    marginHorizontal: 12,
    marginBottom: 10,
  },
  noActivityTxt: {
    textAlign: 'center',
    fontSize: 16,
    color: 'grey',
    fontFamily: 'OpenSans-Regular',
  },
  floatingDiv: {
    position: 'absolute',
    bottom: 90,
    right: 20,
    zIndex: 999,
  },
  floatinBtn: {
    width: 60,
    height: 60,
    backgroundColor: '#00b3d6',
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 10,
  },
});
