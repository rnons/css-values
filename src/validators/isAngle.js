/**
 * See the specification for more details:
 * https://drafts.csswg.org/css-values-3/#angles
 */

import isNumber from './isNumber';

const angles = [
    'deg',
    'grad',
    'rad',
    'turn',
];

export default num => {
    let int = isNumber(num);
    return int && (int.number === '0' || ~angles.indexOf(int.unit));
};