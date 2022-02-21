export function interpolateStringWithParams(
    textToInterpolate: string,
    params: { [key: string]: number | string | boolean },
    options: { openSeparator: string, closeSeparator: string } = { openSeparator: '{{', closeSeparator: '}}' }): string {
    if (params) {
        Object.keys(params).forEach((key) => {
            textToInterpolate = textToInterpolate.replace(`${options.openSeparator}${key}${options.closeSeparator}`, params[key].toString());
        });
    }

    return textToInterpolate;
}
