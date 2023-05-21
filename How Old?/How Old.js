// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: deep-purple; icon-glyph: calendar-alt;

///////////////////////////////////////////////////////////
// SET YOUR BIRTHDAY IN YYYY-MM-DD FORMAT IN THE WIDGET! //
///////////////////////////////////////////////////////////

const birthdate = args.widgetParameter || '1970-01-01',
      today = new Date()
      widget = createWidget(birthdate)

Script.setWidget(widget)

if (!config.runsInWidget) widget.presentSmall()

function createWidget() {
  const birthdayObj = toDate(birthdate),
        age = findAge(birthdayObj).toString(),
        ageOrdinal = ordinalSuffixOf(age),
        daysUntil = daysUntilNext(birthdayObj.getMonth() + 1, birthdayObj.getDate() + 1)
  
  let w = new ListWidget(),
      line1,
      line2,
      line3
  
  if (daysUntil >= 365) {
    
    let gradient = new LinearGradient()
    gradient.colors = [Color.blue(), Color.purple()]
    gradient.locations = [0, 1]
    w.backgroundGradient = gradient
    
    line1 = w.addText("HAPPY")
    line2 = w.addText(ageOrdinal)
    line3 = w.addText("BIRTHDAY!")
    
    line1.textColor = Color.white()
    line2.textColor = Color.white()
    line3.textColor = Color.white()
    
  } else {
    w.backgroundColor = Color.dynamic(Color.white(), Color.black())
    line1 = w.addText('You are')
    line2 = w.addText(age)
    if (daysUntil > 1) {
      line3 = w.addText(`for ${daysUntil} more ${daysUntil > 1 ? "days" : "day"}!`)
    } else {
      line3 = w.addText("Tomorrow is your birthday!")
    }
  }
  
  line1.font = Font.systemFont(18)
  line1.centerAlignText()
  line2.font = Font.boldSystemFont(45)
  line2.centerAlignText()
  line3.font = Font.systemFont(18)
  line3.centerAlignText()
  
  return w
}

function findAge(birthObj) {
  var ageDifMs = today.valueOf() - birthObj
  var ageDate = new Date(ageDifMs)
  return Math.abs(ageDate.getUTCFullYear() - 1970)
}

function toDate(dateStr) {
  return new Date(Date.parse(dateStr))
}

function daysUntilNext(month, day){
    var tday= today,
        y= tday.getFullYear(),
        next= new Date(y, month-1, day);
    tday.setHours(0, 0, 0, 0);
    if(tday>next) next.setFullYear(y+1);
    return Math.round((next-tday)/8.64e7);
}

function findDaysUntil(target) {
  if (today > target) {
    target.setFullYear(today.getFullYear() + 1)
  } else {
    target.setFullYear(today.getFullYear())
  }
  return Math.floor((target - today) / (1000*60*60*24)) + 1
}

function ordinalSuffixOf(i) {
  var j = i % 10,
      k = i % 100
  if (j == 1 && k != 11) return i + "st"
  if (j == 2 && k != 12) return i + "nd"
  if (j == 3 && k != 13) return i + "rd"
  return i + "th"
}