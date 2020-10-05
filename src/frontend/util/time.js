import TimeAgo from 'javascript-time-ago';
import en from 'javascript-time-ago/locale/en'

TimeAgo.locale(en);

const timeAgo = new TimeAgo('en-US')

export const formatTimeAgo = (date, flavour = "short") => {
  if(typeof date !== Date){
    try{
      date = new Date(date);
    }
    catch(e){
      console.error(`[ERROR] timeUtil : Unable to format date ${date} correctly :`, e);
    }
  }
  return timeAgo.format(date, {flavour});
}