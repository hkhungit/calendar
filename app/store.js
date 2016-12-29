import datas from './data'
import {observable, computed} from 'mobx'
import Moment from 'moment'

class Farm {
  @computed get datas() {
    return datas.map(farm => {
      const areas = farm.areas.map(area => {
        const typesTmp = []
        const length = area.types.length
        const firstItem = area.types[0]
        const startMonth = Moment(firstItem.startDate).clone().startOf('month')
        typesTmp.push({
          startDate: new Date(startMonth.toString()),
          endDate: firstItem.startDate
        })
        typesTmp.push(firstItem)
        for (let i = 1; i < area.types.length; i++) {
          const current = area.types[i]
          const previous = area.types[i - 1]
          if (Moment.duration(Moment(current.startDate).diff(Moment(previous.endDate))) > 0) {
            typesTmp.push({
              startDate: previous.endDate,
              endDate: current.startDate
            })
          }
          typesTmp.push(current)
        }

        const types = typesTmp.map(type => {
          const startDate = Moment(type.startDate)
          const endDate = Moment(type.endDate)
          const duration = Moment.duration(endDate.diff(startDate))
          const months = duration.months()
          const aranges = [...Array(months + 1)].map((_, i) => {
            const currentMonth = startDate.clone().add(i , 'M')
            const startMonth = currentMonth.startOf('month')
            const endMonth = currentMonth.clone().endOf('month')
            const start = Moment.duration(startDate.diff(startMonth)) > 0 ? startDate : startMonth
            const end = Moment.duration(endMonth.diff(endDate)) > 0 ? endDate : endMonth
            const days = Moment.duration(end.diff(start) + 1) / (24 * 60 * 60 * 1000)
            const month = currentMonth.months()
            const key = currentMonth.format('YYYYMM')
            return { month, days, end, start, key}
          }).reduce((obj, arange) => {
              obj[arange.key] = arange
              return obj
            }, {})
          return {...type, aranges}
        })
        return {...area, types}
      })
      return {...farm, areas}
    })
  }
}

export default new Farm()