import React, { Component } from 'react'
import {
  View,
  Text,
  Alert,
  Platform,
  ListView,
  ScrollView,
  StyleSheet,
  TouchableWithoutFeedback
} from 'react-native'
import stores from '../../store'
import Moment from 'moment'
import {observer} from 'mobx-react/native'

@observer
class Table extends Component {
  render() {
    const moment = Moment(this.props.date)
    const colNum = moment.clone().endOf('month').dates()
    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2})
    return (
      <ScrollView horizontal contentContainerStyle={{flexDirection: 'column'}}>
        <TableHeader colNum={colNum} moment={moment} />
        <ListView
          dataSource={ds.cloneWithRows(stores.datas)}
          renderRow={(data) => {
            const { name, areas } = data
            return <Row style={styles.renderRow}>
              <View style={styles.left}><Text>{name}</Text></View>
              <View >
                {areas.map((cell, index) => {
                  return (
                    <Row key={index}>
                      <Cell key={-1} style={{backgroundColor: cell.bg, width: colWidth * (cell.arange || 1)}}><Text>{cell.name}</Text></Cell>
                      {cell.types.map((type, i) => {
                        if (!type.aranges[moment.format('YYYYMM')]) return null
                        return <Cell onPress={() => Alert.alert(`${name} - ${type.name}`, "Updating...")} key={i} style={{backgroundColor: type.color, width: colWidth * ((type.aranges[moment.format('YYYYMM')] || {}).days || 0)}}><Text>{type.name}</Text></Cell>
                      })}
                    </Row>
                  )
                })}
              </View>
            </Row>
          }}
        />
      </ScrollView>
    )
  }
}

const TableHeader = (props) => {
  const { colNum, moment } = props
  return (
    <Row style={styles.top}>
      <View style={styles.left} />
      <View style={{width: colWidth}} />
      {[...Array(colNum)].map((_,index) => {
        const now = Moment()
        const startMonth = moment.startOf('month')
        const current = startMonth.add(index, 'd')
        const active = now.format('YYYY-MM-DD') === current.format('YYYY-MM-DD')
        return <CellHeader key={index} active={active} days={current.days()} date={current.dates()} />
      })}
    </Row>
  )
}

const CellHeader = (props) => {
  const { width = colWidth, active, date, days } = props
  const color = active ? 'red' : '#303030'
  return (
    <Cell style={{width: width}}>
      <Text style={{fontSize: 20, fontWeight: 'bold', color}}>{date}</Text>
      <Text style={{fontSize: 10, color}}>{renderDayOfWeek[days]}</Text>
    </Cell>
  )
}

const Cell = (props) => {
  const { style = {}, children} = props
  return (
    <TouchableWithoutFeedback onPress={props.onPress}>
      <View style={[styles.cell, style]}>
        {children}
      </View>
    </TouchableWithoutFeedback>
  )
}

const Row = (props) => {
  const { style = {}} = props
  return (
    <View style={[{flexDirection: 'row'}, style]}>
      {props.children}
    </View>
  )
}

const renderDayOfWeek = ["CN","T2","T3","T4","T5","T6","T7"]
const colWidth = 70

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5FCFF',
  },
  renderRow: {
    borderWidth: 0.5,
    flexDirection: 'row',
    borderTopWidth: 0
  },
  calendar: {
    minWidth: 100,
    minHeight: 100
  },
  left: {
    width: 50,
    maxWidth: 50,
    justifyContent: 'center',
    backgroundColor: '#fafafa'
  },
  top: {
    height: 50,
    left: 0,
    borderBottomWidth: 1,
    right: 0
  },
  cell: {
    minWidth: 30,
    minHeight: 50,
    borderWidth: 0.5,
    alignItems: 'center',
    justifyContent: 'center'
  }
})

export default Table
