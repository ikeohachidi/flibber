import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import utc from 'dayjs/plugin/utc';

dayjs.extend(relativeTime);
dayjs.extend(utc);

const timeFromNow = (date: string): string => {
	return dayjs(date).fromNow();
}

const timeNow = () => {
	return dayjs.utc().format();
}

export {
	timeFromNow,
	timeNow
}