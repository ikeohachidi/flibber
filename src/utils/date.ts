import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

const timeFromNow = (date: string): string => {
	return dayjs(date).fromNow();
}

export {
	timeFromNow
}