'use strict';
import _ from 'lodash';

function makeLayout(calendarData) {

  calendarData = _.cloneDeep(calendarData);

  calendarData.forEach(function(d) {
    if (!d.dateObj) {
      d.dateObj = {
        start : new Date(d.start.dateTime),
        end : new Date(d.end.dateTime)
      };

    }
    if (!d.id) {
      d.id = _.uniqueId('event');
    }
    if (!d.layout) {
      d.layout = {};
    }
  });

  //this needs to be sorted by time
  calendarData.sort(function(a, b) {
    if (a.dateObj.start < b.dateObj.start) return -1
    else if (b.dateObj.start < a.dateObj.start) return 1
  });

  //add top and height vals
  calendarData.forEach(function(d) {

    let minutesFromTop = d.dateObj.start.getHours() * 60 + d.dateObj.start.getMinutes();
    d.layout.top = minutesFromTop / (24 * 60) * 100;

    d.totalMinutes = (d.dateObj.end.getHours() * 60 + d.dateObj.end.getMinutes()) - (d.dateObj.start.getHours() * 60 + d.dateObj.start.getMinutes());
    d.layout.height = d.totalMinutes / (24 * 60) * 100;

  });

  calendarData.forEach(function(d) {

    d.layout.earlyOverlap = calendarData.filter(function(c) {
      if (c == d) return false;
      if (c.dateObj.start < d.dateObj.start && c.dateObj.end > d.dateObj.start) {
        return true
      } else if (d.dateObj.start.toString() == c.dateObj.start.toString()) {
        if (c.totalMinutes > d.totalMinutes) return true
        else if (c.totalMinutes === d.totalMinutes && c.id < d.id) return true;
      }
    });

    d.layout.lateOverlap = calendarData.filter(function(c) {
      if (c == d) return false;
      if (c.dateObj.start > d.dateObj.start && c.dateObj.start < d.dateObj.end) {
        return true
      } else if (d.dateObj.start.toString() == c.dateObj.start.toString()) {
        if (c.totalMinutes < d.totalMinutes) return true;
        else if (c.totalMinutes === d.totalMinutes && c.id > d.id) return true;
      }
    });

  });

  //what is the longest consecutive set of items that are to each item's right?
  //this will help determine the width
  calendarData.forEach(function(d) {
    let mostEntries = 0;

    function getLater(d, num) {
      //we've reached the end of a branch
      if (!d.layout.lateOverlap.length) {
        if (num > mostEntries) mostEntries = num;
      } else {
        num += 1;
        d.layout.lateOverlap.forEach(function(d) {
          return getLater(d, num)
        });
      }
    };
    getLater(d, 0);

    d.layout.maxRight = mostEntries;

  });

  //finally, calculate the widths
  calendarData.forEach(function(d) {

    function getWidthAndPosition(d) {
      let beforeWidth, immediatelyBefore;

      if (!d.layout.earlyOverlap.length) {
        beforeWidth = 0;
      } else {
        //because the sort might not be perfect
        immediatelyBefore = (function() {
          let farthestRight;
          d.layout.earlyOverlap.forEach(function(item) {
            if (!farthestRight || item.layout.left > farthestRight.layout.left) {
              farthestRight = item;
            }
          });
          return farthestRight;
        })();

        beforeWidth = immediatelyBefore.layout.left + immediatelyBefore.layout.width;
      }

      //divide the remaining width equally between this block
      //and the later overlapping ones
      d.layout.width = (100 - beforeWidth) / (1 + d.layout.maxRight);
      d.layout.left = beforeWidth;

      d.layout.lateOverlap.forEach(function(l) {
        if (l.layout.earlyOverlap[l.layout.earlyOverlap.length - 1] == d) {
          getWidthAndPosition(l);
        }
      });

    } //end getWidth

    //it's a top level
    if (!d.layout.earlyOverlap.length) {
      getWidthAndPosition(d);
    }
  });

  return calendarData;

};


export default makeLayout;
