let scheduledCall = null;

const throttle = (fn, delay, ...args) => {
    if (scheduledCall) {
        clearTimeout(scheduledCall);
    }

    scheduledCall = setTimeout(() => {
        scheduledCall = null;
        fn(...args);
    }, delay);
}

export default throttle;