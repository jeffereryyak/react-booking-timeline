# react-booking-timeline

React booking timeline generated.

This component has been developed to be able to display room or place reservations. It is therefore not planned to display several events at the same time for the same room/place.
It also allows you to select free areas.

*Note that react-booking-timeline is based on React 15.*

## Install

```sh
npm install react-booking-timeline
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

## Props


Name	|Type	|Default Value  |  Description
|:---|:---|:---|:---
|startdate| String | moment().valueOf() | Start date of timeline
|enddate|string|moment().add(6,'months').valueOf()|End date of timeline
|onSelect|Function||Function called when the user selects an event
|contentTooltipRender|Function|(evt) => (<div>{evt.title}</div>) | Function called to render the content of the tooltip. Tooltip is shown when the user clicks an event.
|config|Object|see below| Config of component

### Details of config prop
See below all props for the config prop

Name	|Type	|Default Value  |  Description
|:---|:---|:---|:---
locale|String|"fr"|Language
bgColor|String| "#8dc149"| Background color of events
selectedBgColor|String| "#ffc149"| Background color of the selected event
headerBgColor|String| "#519aba"| Background color of the header
headerColor|String| "white"| Text color of the header
freeEventBgColor|String| "#d2cdcd"| Background color of free events
freeEventSelectedBgColor|String| "#d2cdcd"| Background color of the selected free event
groupLabel|String| ""| Label of the first column
showGroups|bool| true| Show the group's column
canSelectedFreeEvent|bool| true| Show free events. User can select free events
showTooltip|bool| true| Show tooltip of events
tooltipClassName|String||Classname of tooltip

Example of class for tooltip:
```css
.customeTheme {
  color: black !important;
  background-color: burlywood !important;
  &.place-top {
    &:after {
    border-top-color: burlywood !important;
    border-top-style: solid !important;
    border-top-width: 6px !important;
    }
  }
 }
```

## Limitations
- Test and design for React 15
- Show only on event by group. If you have 2 events at the same time in the same group, events will be displayed on top of each other
   
## License

MIT