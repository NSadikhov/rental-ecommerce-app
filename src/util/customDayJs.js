import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import isBetween from 'dayjs/plugin/isBetween';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import updateLocale from 'dayjs/plugin/updateLocale';
import az from 'dayjs/locale/az';

dayjs.extend(relativeTime);
dayjs.extend(isBetween);
dayjs.extend(isSameOrBefore);
dayjs.extend(isSameOrAfter);
dayjs.extend(updateLocale)
dayjs.locale(az);

dayjs.updateLocale('az', {
    months: [
        "Yanvar", "Fevral", "Mart", "Aprel", "May", "İyun", "İyul",
        "Avqust", "Sentyabr", "Oktyabr", "Noyabr", "Dekabr"
    ],
    monthsShort: [
        "Yan", "Fev", "Mart", "Apr", "May", "İyun",
        "İyul", "Avq", "Sen", "Okt", "Noy", "Dek"
    ]
})

export default dayjs;