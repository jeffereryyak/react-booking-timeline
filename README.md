# react-booking-timeline

React booking timeline generated

## Install

```
$ npm install react-booking-timeline
```

## Usage

```js
const BookingTimeline = require("react-booking-timeline");

const groups = [{ id: 1, title: 'group 1' }, { id: 2, title: 'group 2' }]
const items = [
    {
        id: 1,
        group: 1,
        title: 'First item very very very long...',
        start: moment().add(1, 'day').valueOf(),
        end: moment().add(4, 'day').valueOf(),
    },
    {
        id: 2,
        group: 2,
        title: 'item 2',
        start: moment().add(-0.5, 'day').valueOf(),
        end: moment().add(10, 'day').valueOf(),
    },
]

handleSelect = (item) => {
    console.log("item:", item)
}

render () {
    <DateTimeline
      groups={groups}
      items={items}
      onSelect=(this.handleSelect)
    />
}

```