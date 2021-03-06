"use strict";
import React, { Component } from "react";
import PropTypes from "prop-types";
import moment from "moment";
import ReactTooltip from "react-tooltip";
import { getDeviceType } from "./utils";
import "./BookingTimeline.scss";

// moment.locale("fr");


export default class DateTimeline extends Component {
  static propTypes = {
    config: PropTypes.object,
    onSelect: PropTypes.func,
    startdate: PropTypes.string,
    enddate: PropTypes.string,
    contentTooltipRender: PropTypes.func,
  };

  constructor(props) {
    // console.time("init");
    super(props);
    let { startdate, enddate, groups, items, config } = props;
    if (config.locale) {
      moment.locale(config.locale)
    }
    let canSelectedFreeEvent =
      config && config.canSelectedFreeEvent !== undefined
        ? config.canSelectedFreeEvent
        : true;
    startdate = moment(startdate);
    enddate = enddate ? moment(enddate) : moment(startdate).add(6, "months");
    let nbDays = enddate.diff(startdate, "days");
    let data = {};
    let listItems = Array.from(items);
    if (nbDays && items && items.length) {
      let nbItems = items.length;
      for (let i = 0; i < nbItems; i++) {
        let { id, group, title, start, end, bgColor } = items[i];
        if (
          id !== undefined &&
          group !== undefined &&
          start &&
          end &&
          enddate.isAfter(start)
        ) {
          id = id + "";
          group = group + "";
          if (!data[group]) {
            data[group] = {
              days: Array.from(Array(nbDays)),
              events: {}
            };
          }
          
          let diffDays = moment(moment(start).format('YYYY-MM-DD'), 'YYYY-MM-DD').diff(moment(startdate.format('YYYY-MM-DD'), 'YYYY-MM-DD'), "days");
            
          let startMiddle = moment(start).hours() > 13;
          let endMiddle = moment(end).hours() <= 13;
          let index = diffDays;
          data[group].days[index] = { id, bgColor, start, end, startMiddle };
          if (
            !data[group].days[index - 1] ||
            data[group].days[index - 1].id !== id
          ) {
            data[group].days[index].title = title;
          }
          let duration = moment(moment(end).format('YYYY-MM-DD'), 'YYYY-MM-DD').diff(moment(moment(start).format('YYYY-MM-DD'), 'YYYY-MM-DD'), "days");
          /*
          console.log(
            "infos",
            moment(start).format("LLL"),
            moment(end).format("LLL"),
            diffDays,
            duration
          );
          */
          if (diffDays < 0) {
            // duration = 1;
            // console.log("endMiddle", endMiddle, moment(start).format('LLL'))
          }
          if (duration === 0) {
            // data[id].days[diffDays].style = "s_e";
          } else {
            data[group].days[index].style = "s";
            data[group].days[index].startMiddle = startMiddle;
            index++;
            while (index < diffDays + duration) {
              data[group].days[index] = {
                id,
                style: "b",
                bgColor,
                start,
                end
              };
              index++;
            }
            data[group].days[index] = {
              id,
              style: "e",
              bgColor,
              start,
              end,
              endMiddle
            };
          }
        } 
      }
    }
    if (groups && groups.length) {
      for (let i = 0; i < groups.length; i++) {
        let { id, title } = groups[i];
        id = id + "";
        if (id && data[id]) {
          data[id].title = title;
        }
      }
    }
    if (canSelectedFreeEvent) {
      for (let i = 0; i < groups.length; i++) {
        let groupId = (groups[i].id || "") + "";
        let j = 0;
        let dataGroup = data[groupId];
        if (!dataGroup) {
          return;
        }
        let infos;
        let itemId = dataGroup.days[j] && dataGroup.days[j].id;
        let itemChanged = false;
        let isMiddleStart = false;
        let isMiddleEnd = false;
        let previousItem;
        while (j < nbDays) {
          if (itemId !== undefined) {
            infos = undefined;
            previousItem = dataGroup.days[j];
            isMiddleStart =
              (previousItem && moment(previousItem.start).hours() > 13) ||
              false;
            isMiddleEnd =
              (previousItem && moment(previousItem.end).hours() <= 13) || false;

            while (!itemChanged && j < nbDays) {
              itemChanged =
                itemId !== (dataGroup.days[j] && dataGroup.days[j].id);
              itemId = dataGroup.days[j] && dataGroup.days[j].id;
              if (itemChanged && itemId !== undefined) {
                previousItem = dataGroup.days[j];
                isMiddleStart =
                  (previousItem && moment(previousItem.start).hours() > 13) ||
                  false;
                isMiddleEnd =
                  (previousItem && moment(previousItem.end).hours() <= 13) ||
                  false;

                itemChanged = false;
              }
              j++;
            }
          } else {
            infos = {
              isFreeEvent: true,
              id: `${Math.floor(Math.random() * 1000)}-${Math.floor(
                Math.random() * 1000
              )}`,
              group: groupId,
              style: "s",
              start: moment(startdate)
                .add(j, "days")
                .valueOf(),
              bgColor: "grey"
            };
            isMiddleStart =
              (previousItem && moment(previousItem.end).hours() <= 13) || false;
            if (j > 1) {
              j = j - 1;
            }
            let start = j;
            if (j > 0 && isMiddleStart) {
              start -= 1;
              infos.start = moment(previousItem.end).valueOf();
            } else {
              infos.start = moment(startdate)
                .add(j, "days")
                .set("hour", 8)
                .set("minute", 0)
                .valueOf();
            }
            itemChanged = false;

            while (!itemChanged && j < nbDays) {
              itemChanged =
                itemId !== (dataGroup.days[j] && dataGroup.days[j].id);
              itemId = dataGroup.days[j] && dataGroup.days[j].id;
              /*
              console.log(
                "is 2 :",
                j,
                itemId,
                itemChanged,
                previousItem && previousItem.id
              );
              */
                if (itemChanged){
                  previousItem = dataGroup.days[j];
                }
              j++;
            }
            j--;
            isMiddleEnd =
              (previousItem && moment(previousItem.end).hours() <= 13) || false;

            infos.end = moment(startdate)
              .add(j, "days")
              .valueOf();
            if (j < (nbDays - 1) && isMiddleEnd) {
              infos.end = moment(previousItem.start).valueOf();
            } else {
              infos.end = moment(infos.end)
                .set("hour", 20)
                .set("minute", 0)
                .valueOf();
              // console.log("=> ", j, nbDays,dataGroup.days[j] && moment(dataGroup.days[j].start).hours(), dataGroup.days[j] && moment(dataGroup.days[j].start).format("LLL"));
            }
            /*
            console.log(
              "=> infos.end",
              start,
              j,
              isMiddleStart,
              isMiddleEnd,
              moment(infos.start).format("LLL"),
              moment(infos.end).format("LLL")
            );
            */

            for (let k = start; k <= j; k++) {
              // console.log("dataGroup.days[k]", dataGroup.days[k]);
              if (dataGroup.days[k]) {
                dataGroup.days[k] = [dataGroup.days[k]];
                if (k !== j) {
                  // console.log("infos end", infos, moment(infos.start).format('LLL'), moment(infos.end).format('LLL'))
                  dataGroup.days[k].push({
                    ...infos,
                    style:
                      k === start
                        ? "s" + (isMiddleStart ? " startMiddle" : "")
                        : k === j
                        ? "e" + (isMiddleEnd ? " endMiddle" : "")
                        : "b"
                  });
                } else {
                  // console.log("infos start", infos, moment(infos.start).format('LLL'), moment(infos.end).format('LLL'))
                  dataGroup.days[k].unshift({
                    ...infos,
                    style:
                      k === start
                        ? "s" + (isMiddleStart ? " startMiddle" : "")
                        : k === j
                        ? "e" + (isMiddleEnd ? " endMiddle" : "")
                        : "b"
                  });
                }
              } else {
                dataGroup.days[k] = {
                  ...infos,
                  style:
                    k === start
                      ? "s" + (isMiddleStart ? " startMiddle" : "")
                      : k === j
                      ? "e" + (isMiddleEnd ? " endMiddle" : "")
                      : "b"
                };
              }
            }
            listItems.push(infos);
            j++;
          }
          itemChanged = false;
        }
      }
    }
    this.state = {
      list: [],
      startdate,
      enddate,
      nbDays,
      data,
      items: listItems || [],
      groupLabel: (config && config.groupLabel) || "",
      freeEventBgColor:
        (config && config.freeEventBgColor) || "#d2cdcd",
      freeEventSelectedBgColor:
        (config && config.freeEventSelectedBgColor) || "#d2cdcd",
      defaultBgColor: (config && config.bgColor) || "#8dc149",
      selectedBgColor: (config && config.SelectedBgColor) || "#ffc149",
      headerBgColor: (config && config.headerBgColor) || "#519aba",
      headerColor: (config && config.headerColor) || "white",
      showGroups:
        config && config.showGroups !== undefined
          ? config.showGroups
          : true,
      showTooltip:
        config && config.showTooltip !== undefined
          ? config.showTooltip
          : true,
      canSelectedFreeEvent,
      defaultSelectedBgColor:
        (config && config.selectedBgColor) || "#a074c4",
        tooltipClassName : config && config.tooltipClassName,
      isDesktop: getDeviceType() === "Desktop"
    };
  }

  findItem = id => {
    let item;
    let itemId = id;
    if (id) {
      if (id.startsWith("slot")) {
        itemId = id.substring(4);
      }
      item = this.state.items.find(it => it.id + "" === itemId);
    }
    return item;
  };

  selectItem = id => {
    let item = this.findItem(id);
    if (item) {
      if (item.isFreeEvent) {
        this.selectFreeItem(id, item);
      } else {
        document.querySelectorAll(`[id=${id}]`).forEach(el => {
          el.style.background =
            item.selectedBgColor || this.state.defaultSelectedBgColor;
        });
      }
    }
    return item;
  };

  unselectItem = id => {
    let item = this.findItem(id);
    if (item) {
      if (item.isFreeEvent) {
        // console.log("is FreeEvent");
        this.unselectFreeItem(id, item);
      } else {
        document.querySelectorAll(`[id=${id}]`).forEach(el => {
          el.style.background = item.bgColor || this.state.defaultBgColor;
        });
      }
    }
  };

  selectFreeItem = (id, item, isHover) => {
    item = item || this.findItem(id);
    if (item) {
      document.querySelectorAll(`[id=${id}]`).forEach(el => {
        el.style.background = isHover
          ? this.state.freeEventBgColor
          : this.state.freeEventSelectedBgColor;
        el.style.opacity = 1;
      });
    }
    return item;
  };

  unselectFreeItem = (id, item) => {
    item = item || this.findItem(id);
    if (item) {
      document.querySelectorAll(`[id=${id}]`).forEach(el => {
        el.style.background = this.state.freeEventBgColor;
        el.style.opacity = 0.1;
      });
    }
  };

  handleClick = e => {
    if (!this.isMoving) {
      // console.log("Click!", e.target.id);
      this.unselectItem(this.selectedItemId);
      let item = this.selectItem(e.target.id);
      this.selectedItemId = e.target.id;
      if (item && typeof this.props.onSelect === "function") {
        let it = Object.assign({}, item)
        if (it.isFreeEvent) {
          it = {
            group: item.group,
            start : item.start,
            end : item.end,
          }
        }
        this.props.onSelect(it);
      }
    }
    this.isMoving = false;
  };

  onMouseDown = evt => {
    if (this.state.isDesktop) {
      this.down = true;
      this.lastPosX = evt.pageX;
      this.lastPosY = evt.pageY;
    }
  };
  onMouseUp = event => {
    this.down = false;
  };

  onMouseMove = event => {
    if (this.down) {
      let diffX = this.lastPosX - event.pageX;
      let diffY = this.lastPosY - event.pageY;
      console.log("diff",diffX, diffY)
      if (Math.abs(diffX) > 1 || Math.abs(diffY) > 1) {
        this.myRef.scrollLeft += diffX;
        this.myRef.scrollTop += diffY;
        this.lastPosX = event.pageX;
        this.lastPosY = event.pageY;
        this.isMoving = true;
      } else {
        //this.isMoving = false;
      }
    } else {
      this.isMoving = false;
    }
  };

  handleContent = id => {
    let item = this.findItem(id);
    let result = "";
    if (typeof this.props.contentTooltipRender === 'function') {
      let it = Object.assign({}, item)
        if (it.isFreeEvent) {
          it = {
            group: item.group,
            start : item.start,
            end : item.end,
          }
        }
      result = this.props.contentTooltipRender(it)
    }
    if (!result && item && item.title) {
      result = (
        <div>
          <div>
            <b>{item.title}</b>
          </div>
          <div>
            {moment(item.start).format("LLLL") +
              " - " +
              moment(item.end).format("LLLL")}
          </div>
        </div>
      );
    }
    return result;
  };

  handleMouseMoveFreeEvent = event => {
    if (!this.isMoveOnFreeEvent) {
      this.isMoveOnFreeEvent = true;
      if (this.selectedItemId !== event.target.id) {
        // console.log("Event mouse", event.target.id);
        this.selectFreeItem(event.target.id, undefined, true);
      }
    }
  };
  handleMouseLeaveFreeEvent = event => {
    if (this.isMoveOnFreeEvent) {
      this.isMoveOnFreeEvent = false;
      if (this.selectedItemId !== event.target.id) {
        // console.log("Event leave", event.target.id);
        this.unselectFreeItem(event.target.id);
      }
    }
  };

  render() {
    let {
      startdate,
      enddate,
      nbDays,
      data,
      showGroups,
      groupLabel,
      headerBgColor,
      headerColor,
      showTooltip,
      tooltipClassName
    } = this.state;
    // console.log("showGroups", showGroups);
    let months = [];
    let days = [];
    let d = moment(startdate);
    let numMonth = d.month();
    let daysInMonth = d.daysInMonth() - parseInt(d.format("DD"), 10) + 1;
    let monthName = d.format("MMMM YYYY");
    let keys = data && Object.keys(data);
    // console.log("data[key]", data[key].days);
    let datas = {};
    // rows = data[key].days;
    // rows.unshift(<td className="fixCol">Lorem. sdf</td>);
    for (let i = 0; i < nbDays; i++) {
      days.push(
        <th key={`thd-${days.length}`} className="subheader">
          {d.format("DD")}
        </th>
      );
      // let theDay = moment(d).add(i, 'days')

      for (let j = 0; j < keys.length; j++) {
        let slots = data[keys[j]].days[i];

        let infos = [];
        let classMultiEvent = "multiEvents";
        let clazzTd = "noPadding ";
        if (d.day() === 6 || d.day() === 0) {
          clazzTd += " item-weekend";
        }
        if (slots) {
          if (!Array.isArray(slots)) {
            if (slots.startMiddle) {
              classMultiEvent = "multiEvents-Invert";
            }

            slots = [slots];

            // clazzTd += " multiEvents";

            // clazzTd += ' multiEvents';
          } else {
          }
          slots.forEach(slot => {
            if (slot) {
              let addHandles = {};

              if (slot.isFreeEvent) {
                addHandles.onMouseMove = this.handleMouseMoveFreeEvent;
                addHandles.onMouseLeave = this.handleMouseLeaveFreeEvent;
              }

              if (slot.style !== "s") {
                // clazzTd += " noBorderLeft";
              }
              // console.log("=>", slot);
              let className =
                `slot${slot.id} ` + slot.style + " pointer red tp ";
              // 'b bSelected bgSelected red pointer'
              if (slot.selected) {
                className += " " + slot.style + "Selected bgSelected";
              }
              if (slot.startMiddle) {
                className += " startMiddle";
              }
              if (slot.endMiddle) {
                className += " endMiddle";
              }
              let defaultBg = slot.bgColor || this.state.defaultBgColor;
              let background = slot.isFreeEvent
                ? slot.selectItem
                  ? this.state.freeEventSelectedBgColor
                  : this.state.freeEventBgColor || defaultBg
                : defaultBg;
              // console.log("className", className);
              infos.push(
                <div
                  key={`infos${infos.length}`}
                  {...addHandles}
                  data-iscapture="true"
                  data-tip={slot.id}
                  data-event="click"
                  id={`slot${slot.id}`}
                  className={className}
                  style={{
                    background: background,
                    opacity: slot.isFreeEvent ? 0.1 : 1
                  }}
                />
              );
            }
          });
        }

        datas[keys[j]] =
          datas[keys[j]] ||
          (showGroups
            ? [
                <td key={"tdd00"} className="fixCol">
                  {data[keys[j]].title}
                </td>
              ]
            : []);

        datas[keys[j]].push(
          <td
            key={`tdd${datas[keys[j]].length}`}
            className={clazzTd}
            onMouseDown={this.onMouseDown}
            onMouseUp={this.onMouseUp}
            onMouseMove={this.onMouseMove}
            onClick={this.handleClick}
          >
            {" "}
            <div className={classMultiEvent}>{infos}</div>
          </td>
        );
      }
      /*
      rows.push(
        <td
          onMouseDown={this.onMouseDown}
          onMouseUp={this.onMouseUp}
          onMouseMove={this.onMouseMove}
          onClick={this.handleClick}
        > {data[key].days[i] ? <div className='b bSelected bgSelected red pointer'></div> : null} </td>
      );
      */
      d = d.add(1, "days");
      if (numMonth !== d.month()) {
        console.log("monthName",i,  monthName)
        months.push(
          <th
            key={`th-${months.length}`}
            className="header c"
            style={{ background: headerBgColor, color: headerColor }}
            colSpan={daysInMonth}
          >
            <div className="stickyH">{monthName}</div>
          </th>
        );

        numMonth = d.month();
        daysInMonth = d.daysInMonth();
        monthName = d.format("MMMM YYYY");
      }
    }
    console.log("==>", nbDays, moment(enddate).month(), numMonth)
    if (moment(enddate).month() === numMonth) {
      months.push(
        <th
          key={`th-${months.length}`}
          className="header c"
          style={{ background: headerBgColor, color: headerColor }}
          colSpan={daysInMonth}
        >
          <div className="stickyH">{monthName}</div>
        </th>
      );
    }
    
    let thGroups = null;
    if (showGroups) {
      thGroups = (
        <th
          className="header fixHeadCol centerText"
          rowSpan="2"
          style={{ background: headerBgColor, color: headerColor }}
        >
          <div className="content">{groupLabel}</div>
        </th>
      );
    }
    let tooltip = null;
    if (showTooltip) {
      tooltip = (
        <ReactTooltip
          getContent={this.handleContent}
          effect="solid"
          className={tooltipClassName}
          // type="info" 
          clickable
          style={{background:'red !important'}}
        />
      );
    }
    return (
      <div
        className="table-scroll"
        ref={ref => {
          this.myRef = ref;
        }}
      >
        <table>
          <thead>
            <tr>
              {thGroups}
              {months}
            </tr>
            <tr>{days}</tr>
          </thead>
          <tbody id="tbody" onMouseLeave={this.onMouseUp}>
            {Object.keys(datas).map(k => {
              return <tr>{datas[k]}</tr>;
            })}
          </tbody>
        </table>
        {tooltip}
      </div>
    );
  }
}
