// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: deep-purple; icon-glyph: vial;
// Requires Sugarmate app
// Set up the Sugarmate apple watch calendar. It must be named "Sugarmate Readings".

const widget = await createWidget()

if (config.runsInWidget) {
  Script.setWidget(widget)
} else {
//   widget.presentAccessoryInline()
  widget.presentAccessoryRectangular()
}

async function createWidget() {
  let reading = await getReading()
  
  if (reading) reading = reading.replace(/\(.*?\)/g, "").replace(/\[.*?\]/g, "OLD").trim();
  const readingNumber = reading?.match(/\d*/)[0]
  const readingInfo = reading?.replace(/\d*/, "").trim()
  
  let output = new ListWidget()
  output.url ="sugarmate://"
  
  switch (config.widgetFamily) {
    default: {
      if (reading) {
        
        output.addText(reading)
        
      } else {
        
        output.addText("No Data")
      }
      
      break
    }
    case "accessoryInline": {
      if (reading) {
        
        output.addText(`|  ${reading}`)
        
      } else {
        
        output.addText("|  No Data")
      }
      
      break
    }
    case "accessoryCircular": {
      output.addAccessoryWidgetBackground = true
      output.spacing = -5
      if (reading) {
        
        if (readingNumber) {
          let numberOut = output.addText(readingNumber)
          numberOut.font = Font.boldSystemFont(22)
          numberOut.minimumScaleFactor = 0.5
          numberOut.centerAlignText()
        }
        let infoOut = output.addText(readingInfo)
        infoOut.centerAlignText()
        infoOut.lineLimit = 1
        infoOut.minimumScaleFactor = 0.6
        
      } else {
        
        let errText = output.addText("No")
        errText.centerAlignText()
        let errText2 = output.addText("Data")
        errText2.centerAlignText()
      }
      
      break
    }
    case "accessoryRectangular": {
      if (reading) {
        
        const stack = output.addStack()
      stack.centerAlignContent()
        const outNumber = stack.addText(readingNumber + "  ")
        outNumber.font = Font.boldSystemFont(40)
        outNumber.minimumScaleFactor = 0.75
        // stack.addSpacer(10)
        // stack.addSpacer()
        const outInfo = stack.addText(readingInfo)
        outInfo.font = Font.systemFont(26)
        outInfo.lineLimit = 2
        outInfo.minimumScaleFactor = 0.5
        outInfo.centerAlignText()
        
      } else {
        
        const stack = output.addStack()
        stack.centerAlignContent()
        const outInfo = stack.addText("No Data")
        outInfo.font = Font.systemFont(35)
      }
      
      break
    }
  }
  
  return output;
}


async function getReading() {
  const oldTime = addMinutes(new Date(), -12)
  const newTime = addMinutes(new Date(), 12)  
  const smCal = await Calendar.forEventsByTitle("Sugarmate Readings")
  
  const readings = await CalendarEvent.between(oldTime, newTime, [smCal]);

  return readings[readings.length - 1]?.title
  // Test cases
  // return "204 ↑↑ +17  (mg/dL)"
  // return "282 → [OLD] (mg/dL)"
  // return "122 ➚ +24  (mg/dL)"
}

function addMinutes(date, minutes) {
  return new Date(date.getTime() + minutes*60000);
}
