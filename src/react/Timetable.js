import React from 'react'
import { connect } from 'react-redux'
import type { State } from 'laundree-sdk/lib/redux'
import { FlatList, View, Text, Dimensions  } from 'react-native'

type TimetableProps = {}

class Timetable extends React.PureComponent<TimetableProps> {
  _ref: FlatList
  state = {width: Dimensions.get('window').width, i: 0, data: Array(356).fill(0).map((z, i) => i)}
  _listener = () => {
    const width = Dimensions.get('window').width
    this.setState({width}, this._resetScroll)
  }

  _resetScroll = () => {
    this._ref.scrollToIndex({index: this.state.i})
  }

  _slide = (e) => {
    const x = e.nativeEvent.contentOffset.x
    this.setState(({i: oldI, data}) => {
      const i = Math.round(x / this.state.width)
      return {i}
    })
  }

  _renderItem (i) {
    return (
      <View style={{flex: 1, width: this.state.width}}>
        <Text>
          askfalsdlgafæølksd aølsadfl ksdfølksdf ølskfsdkljsk aljasjhd sadanbnwnbwra asd as afs as asfbasfjba
          asfjahs fjkas f
          askfalsdlgafæølksd aølsadfl ksdfølksdf ølskfsdkljsk aljasjhd sadanbnwnbwra asd as afs as asfbasfjba
          asfjahs fjkas f
          Hello {i}
        </Text>
      </View>
    )
  }

  componentDidMount () {
    Dimensions.addEventListener('change', this._listener)
    setTimeout(this._resetScroll, 0)
  }

  componentWillUnmount () {
    Dimensions.removeEventListener('change', this._listener)
  }

  render () {
    return (
      <FlatList
        getItemLayout={(data, i) => ({length: this.state.width, offset: i * this.state.width, index: i})}
        onMomentumScrollEnd={this._slide}
        pagingEnabled
        style={{flex: 1}}
        horizontal
        ref={ref => this._ref = ref}
        showsHorizontalScrollIndicator={false}
        data={this.state.data}
        keyExtractor={(i) => i}
        renderItem={({item}) => this._renderItem(item)}
      />
    )
  }
}

function mapStateToProps ({machines, bookings}: State): TimetableProps {
  return {machines, bookings}
}

export default connect(mapStateToProps)(Timetable)
