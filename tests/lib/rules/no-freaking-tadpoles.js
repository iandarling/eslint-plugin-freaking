'use strict';

var rule = require('../../../lib/rules/no-freaking-tadpoles');
var RuleTester = require('eslint').RuleTester;

var ruleTester = new RuleTester();

ruleTester.run('no-freaking-tadpoles', rule, {
    valid: [
        'var b = 1 + 1;',
        'var b = 0 - 1;',
        'var a = 0; var b = a - 1;',
        'var a = 0; var b = a + 1;',
        'var a = 0; var b = 1; var c = (a + b) - 2;',
        'var a = 0; var b = 1; var c = (a - b) + 2;',
        'var a = 0; var b = ~--a;', // Bitwise ~ of (--a), which isn't actually a tadpole
        'var a = function() { return 0; }; var b = a() + 1;'
    ],
    invalid: [{
        code: 'var b = -~1;',
        errors: [{ message: 'No Freaking Tadpoles, prefer "2" instead' }]
    }, {
        code: 'var b = -~"1";',
        errors: [{ message: 'No Freaking Tadpoles, prefer "2" instead' }]
    }, {
        code: 'var b = ~-10;',
        errors: [{ message: 'No Freaking Tadpoles, prefer "9" instead' }]
    }, {
        code: 'var b = ~-"10";',
        errors: [{ message: 'No Freaking Tadpoles, prefer "9" instead' }]
    }, {
        code: 'var b = ~-[];',
        errors: [{ message: 'No Freaking Tadpoles, prefer "-1" instead' }]
    }, {
        code: 'var b = -~{};',
        errors: [{ message: 'No Freaking Tadpoles, prefer "1" instead' }]
    }, {
        code: 'var a = []; var b = ~-a[0];',
        errors: [{ message: 'No Freaking Tadpoles, prefer "a[0]-1" instead' }]
    }, {
        code: 'var a = 0; var b = -~a;',
        errors: [{ message: 'No Freaking Tadpoles, prefer "a+1" instead' }]
    }, {
        code: 'var a = 0; var b = ~-a;',
        errors: [{ message: 'No Freaking Tadpoles, prefer "a-1" instead' }]
    }, {
        code: 'var a = 0; var b = 1; var c = ~-~-(a + b);',
        errors: [{ message: 'No Freaking Tadpoles, prefer "(a + b)-2" instead' }]
    }, {
        code: 'var a = 0; var b = 1; var c = -~-~(a - b);',
        errors: [{ message: 'No Freaking Tadpoles, prefer "(a - b)+2" instead' }]
    }, {
        code: 'var a = function() { return 0; }; var b = -~a();',
        errors: [{ message: 'No Freaking Tadpoles, prefer "a()+1" instead' }]
    }, {
        code: 'var a = 0; var b = -~~~~~-~a;',
        errors: [{ message: 'No Freaking Tadpoles, prefer "a+2" instead' }]
    }, {
        code: 'var a = 0; var b = -~~~~~~-~a;',
        errors: [{ message: 'No Freaking Tadpoles, prefer "a-1" instead' }]
    }, {
        code: 'var a = 0; var b = -~-~-~-~-~-~-~-a;',
        errors: [{ message: 'No Freaking Tadpoles, prefer "a+7" instead' }]
    }, {
        code: 'var a = 0; var b = -~-~~-~-a;',
        errors: [{ message: 'No Freaking Tadpoles, prefer "a" instead' }]
    }, {
        code: 'var b = -~+10;', // Tricky to work these out as literals, as we're checking the unary expression + not the literal 10
        errors: [{ message: 'No Freaking Tadpoles, prefer "(+10)+1" instead' }]
    }, {
        code: 'var a = -10; var b = -~+a;',
        errors: [{ message: 'No Freaking Tadpoles, prefer "(+a)+1" instead' }]
    }]
});
