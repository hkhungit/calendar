import React, { Component } from 'react';
import {
  View,
  Text,
  Alert,
  Platform,
  ListView,
  ScrollView,
  StyleSheet,
  TouchableWithoutFeedback
} from 'react-native';
import stores from './store'
import Moment from 'moment'
import Icon from 'react-native-vector-icons/FontAwesome'
import DatePicker from 'react-native-datepicker'
import {observable} from 'mobx'
import {observer} from 'mobx-react/native'
import Table from './components/tables'

@observer
class Calendar extends Component {
  @observable date = new Date()

  renderDayOfWeek() {
    return ["CN","T2","T3","T4","T5","T6","T7"]
  }

  render() {
    const title = "Danh sách kế hoạch sản xuất"
    return (
      <View style={styles.container}>
        <View style={styles.topBar}>
          <Icon name="chevron-left" size={25} color="#FFFFFF" onPress={() => Alert.alert("Back", "Updating")} />
          <Text style={styles.title}>{title}</Text>
        </View>
        <View style={styles.sideBar}>
          <DatePicker
            style={{width: 100}}
            date={this.date}
            mode="date"
            showIcon={false}
            placeholder="Chọn ngày"
            format="YYYY-MM"
            confirmBtnText="Chọn"
            cancelBtnText="Huỷ"
            style={{flex: 1}}
            onDateChange={(date) => (this.date = date)}
          />
          <Icon.Button
            name="search"
            color="#6a6a6a"
            backgroundColor="transparent"
            onPress={() => Alert.alert("Search", "Updating...")}
            />
        </View>
        <Table date={this.date} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5FCFF',
  },
  topBar: {
    padding: 10,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    backgroundColor: 'green',
    ...Platform.select({
      ios: {
        marginTop: 20
      }
    })
  },
  title: {
    flex: 1,
    fontSize: 18,
    marginLeft: -25,
    zIndex: -1,
    color: '#FFFFFF',
    textAlign: 'center'
  },
  sideBar: {
    flexDirection: 'row'
  }
})

export default Calendar 
