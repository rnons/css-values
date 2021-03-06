import getArguments from './getArguments';
import isKeyword from './isKeyword';
import isLengthPercentage from './isLengthPercentage';
import isSpace from './isSpace';
import isVariable from './isVariable';

const left = 'left';
const center = 'center';
const right = 'right';
const top = 'top';
const bottom = 'bottom';

const horizontals = [left, right, center];
const verticals = [top, bottom, center];

function isKeywordOrVar (node, keywords) {
    return isKeyword(node, keywords) || isVariable(node);
}

function isLengthPercentageOrVar (node) {
    return isLengthPercentage(node) || isVariable(node);
}

function validateGroup (group) {
    const {length} = group;
    if (length === 1) {
        if (
            !isKeywordOrVar(group[0], [left, center, right, top, bottom]) &&
            !isLengthPercentage(group[0])
        ) {
            return false;
        }
    }
    if (length === 3) {
        if (!isSpace(group[1])) {
            return false;
        }
        if (
            (isKeywordOrVar(group[0], horizontals) && isKeywordOrVar(group[2], verticals)) ||
            (isKeywordOrVar(group[0], verticals) && isKeywordOrVar(group[2], horizontals))
        ) {
            return true;
        }
        if (!isKeywordOrVar(group[0], horizontals) && !isLengthPercentage(group[0])) {
            return false;
        }
        if (!isKeywordOrVar(group[2], verticals) && !isLengthPercentage(group[2])) {
            return false;
        }
    }
    if (length >= 5 && length <= 7) {
        if (
            isKeywordOrVar(group[0], [left, right]) &&
            isSpace(group[1]) &&
            isLengthPercentageOrVar(group[2]) &&
            isSpace(group[3]) &&
            isKeywordOrVar(group[4], verticals)
        ) {
            if (group[6] && isSpace(group[5]) && (!isLengthPercentageOrVar(group[6]) || group[4].value === center)) {
                return false;
            }
            return true;
        }
        if (
            isKeywordOrVar(group[0], [top, bottom]) &&
            isSpace(group[1]) &&
            isLengthPercentageOrVar(group[2]) &&
            isSpace(group[3]) &&
            isKeywordOrVar(group[4], horizontals)
        ) {
            if (group[6] && isSpace(group[5]) && (!isLengthPercentageOrVar(group[6]) || group[4].value === center)) {
                return false;
            }
            return true;
        }
        return false;
    }
    return length < 8;
}

function isPositionFactory (repeating) {
    return function isPosition (valueParserAST) {
        if (repeating && valueParserAST.nodes[valueParserAST.nodes.length - 1].type === 'div') {
            return false;
        }

        return getArguments(valueParserAST).every(validateGroup);
    };
}

export const isPositionRepeat = isPositionFactory(true);
export const isPositionNoRepeat = isPositionFactory(false);
