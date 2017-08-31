var postcss = require('postcss')
var _ = require('lodash')

module.exports = postcss.plugin('postcss-beard-font-scale', function(opts) {
    opts = opts || {}

    var breakpoints = opts.breakpoints
    var fontScale = opts.fontScale

    return function(root, result) {
        var rules = _.map(fontScale, function(value, key) {
            return createRule(key, value)
        })

        root.append(rules)

        var responsiveRules = _.flatMap(fontScale, function(
            fontValue,
            fontKey
        ) {
            return _.flatMap(breakpoints, function(value, key) {
                return createResponsiveRule(key, value, fontKey, fontValue)
            })
        })

        return root.append(responsiveRules)
    }
})

function createResponsiveRule(prefix, query, selector, value) {
    return postcss
        .atRule({
            name: 'media',
            params: query,
        })
        .append(createRule(`${prefix}-${selector}`, value))
}

function createRule(selector, value) {
    return postcss
        .rule({
            selector: `.${selector}`,
        })
        .append(
            postcss.decl({
                prop: 'font-size',
                value: value,
            })
        )
}
