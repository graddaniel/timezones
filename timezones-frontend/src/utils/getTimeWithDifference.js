import moment from 'moment';

const getTimeWithDifference = (timezone) => {
    const sign = timezone.charAt(0);

    const timeOffset = timezone.slice(1);
    const [hoursOffset, minutesOffset] = timeOffset.split(':');

    const operation = sign === '+' ? 'add' : 'subtract';

    return moment()
        [operation](hoursOffset, 'hours')
        [operation](minutesOffset, 'minutes')
        .format('HH:mm:ss');
}

export default getTimeWithDifference;