import * as  intl from 'nativescript-intl'

export const currencyToLocale = {
    'USD': 'en_US',
    'GBP': 'en_GB',
    'EUR': 'en_IE',
    'JPY': 'ja_JP',
    'CNY': 'zh_CN',
    'HKD': 'zh_HK',
    'CHF': 'fr_CH',
    'CAD': 'en_CA',
    'AUD': 'en_AU',
};

export function display(value, currency) { //process the value and the currency to a fromated number with a symbol
    const locale = currencyToLocale[currency]
    let output = new intl.NumberFormat(locale, {'style': 'currency', 'currency': currency, 'currencyDisplay': 'symbol'}).format(parseFloat(value))
    return output
};

export function localeToCurrency(locale) { //convert a locale to a currency
    let output = Object.keys(currencyToLocale).find(key => currencyToLocale[key] == locale)
    return output
};