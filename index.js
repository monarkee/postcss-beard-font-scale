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

        var responsiveRules = _.flatMap(breakpoints, function(
            breakpointValue,
            breakpointKey
        ) {
            var breakpoint = createBreakpoint(breakpointValue)

            var rules = _.map(fontScale, function(scaleValue, scaleKey) {
                return createRule(`${breakpointKey}-${scaleKey}`, scaleValue)
            })

            return breakpoint.append(rules)
        })

        return root.append(responsiveRules)
    }
})

function createBreakpoint(query) {
    return postcss.atRule({
        name: 'media',
        params: query,
    })
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
