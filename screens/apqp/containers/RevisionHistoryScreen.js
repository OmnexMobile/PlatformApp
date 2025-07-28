import React, { Component } from 'react'
import { ScrollView, Text, Image, View, TextInput, TouchableOpacity, Button, FlatList, ImageBackground, CheckBox } from 'react-native'
import { Images } from '../themes'
import Icon from 'react-native-vector-icons/FontAwesome'
import { connect } from 'react-redux'

// Styles
import styles from './styles/RevisionHistoryStyles';
import { SPACING } from 'constants/theme-constants'

class RevisionHistoryScreen extends Component {
  constructor() {
    super()
    this.state = {
      checked: false,
    };
  }

  oncheckChange() {
    console.log('changed')
    this.setState({
      checked: this.state.checked == false ? true : false
    })
  }

  render() {

    const Filterdata = [
      {
        name: 'Doc Status',
        id: 1
      },
      {
        name: 'Input Doc',
        id: 2
      },
      {
        name: 'output Doc',
        id: 4
      },
      {
        name: 'Remarks',
        id: 5
      },
      {
        name: 'History',
        id: 6
      },
    ]

    return (

      <View style={styles.mainContainer}>
        {Platform.OS === 'ios' ? <View style={{ padding: SPACING.NORMAL, flexDirection: 'row' }}/> : <View style={{ padding: SPACING.NORMAL, flexDirection: 'row' }}/> }

        <Image source={Images.apqpmanagerbg} style={styles.bgImage} />
        <View style={styles.apqpTextView}>
          <ImageBackground
            source={Images.headerBG}
            style={{
              resizeMode: 'stretch',
              width: '100%',
              height: 73,
              flexDirection: 'column'
            }}>
            <View>
              <View style={{ flexDirection: 'row' }}>
                <View style={styles.backLogo}>
                  <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
                    <Icon name="angle-left" size={40} color="white" />
                  </TouchableOpacity>
                </View>
                <View style={styles.headerTextDiv}>
                  <Text style={styles.apqpTextStyle}>Revision History</Text>
                </View>
              </View>

            </View>
          </ImageBackground>
        </View>

        <View style={styles.flatListWholeView}>
          <FlatList
            data={Filterdata}

            renderItem={({ item }) =>
              <View style={styles.buttonView}>
                <View style={{ paddingTop: 10 }}>
                  <TouchableOpacity style={styles.boxView}>

                    <View style={styles.listView}>
                      <Text style={styles.listText}>Doc Status:</Text>

                      <CheckBox
                        style={{ height: 30 }}
                        title='Click Here'
                        value={this.state.checked}
                        onValueChange={this.oncheckChange.bind(this)}
                      />
                    </View>
                    <View style={styles.listView}>
                      <Text style={styles.listText}> Input Doc :</Text>
                      <Text style={styles.listNextText}>MR IP</Text>
                    </View>
                    <View style={styles.listView}>
                      <Text style={styles.listText}>Output Doc:</Text>
                      <Text style={styles.listNextText}>Document R</Text>

                    </View>

                    <TextInput
                      placeholder={'Remarks'}
                      style={styles.textInputStyle}
                    />

                  </TouchableOpacity>
                </View>

              </View>
            }
          />
        </View>

        <View style={[styles.footerDiv, {display: 'none'}]}>
          <View style={styles.footerDiv}>
            <ImageBackground
              source={Images.headerBG}
              style={{
                resizeMode: 'stretch',
                width: '100%',
                height: 80,
              }}>

            </ImageBackground>
          </View>
        </View>

      </View>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    data: state
  }
}

const mapDispatchToProps = (dispatch) => {
  return {

  }
}

export default connect(mapStateToProps, mapDispatchToProps)(RevisionHistoryScreen)