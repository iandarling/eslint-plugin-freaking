'use strict';

function getTadpoles(context, node) {
    // Get all "UnaryExpression" parents that might be relevant
    var tadpoleTokens = [];
    var notCount = 0;
    var minusCount = 0;
    var parent = node.parent;
    while(parent.type === "UnaryExpression") {
        if(parent.operator === '~') {
            notCount++;
        } else if(parent.operator === '-') {
            minusCount++;
        } else {
            break;
        }

        tadpoleTokens.unshift(parent.operator);
        parent = parent.parent;
    }

    // We need at least one of each type for a tadpole
    if(notCount < 1 || minusCount < 1) {
        return {
            hasTadpoles: false
        };  
    }

    // Now we have to evaulate the stack of operations to get a before and after value so we can work out what the difference is
    // Easiest way is to use eval (which only includes - and ~ characters and this variable)
    var tadpole = tadpoleTokens.join('');
    var evil = `${tadpole}0;`;
    var result = eval(evil);
    // console.log(`Eval: "${evil}" => ${result}`);

    var sourceCode = context.getSourceCode();
    var nodeCode = sourceCode.getText(node);

    if(result === 0 || result === -0) {
        return {
            hasTadpoles: true,
            literal: result,
            preferred: '',
            code: nodeCode
        }
    }

    return {
        hasTadpoles: true,
        literal: result,
        preferred: result > 0 ? `+${result}` : `${result}`,
        code: nodeCode
    }
}

function reportNumberLiteral(context, node, literal) {
    var message = `No Freaking Tadpoles, prefer "${literal}" instead`;
    context.report({
        node: node,
        message: message
    });
}

function reportCode(context, node, code, preferred) {
    var message = `No Freaking Tadpoles, prefer "${code}${preferred}" instead`;
    context.report({
        node: node,
        message: message
    });
}

function reportExpression(context, node, code, preferred) {
    var message = `No Freaking Tadpoles, prefer "(${code})${preferred}" instead`;
    context.report({
        node: node,
        message: message
    });
}

module.exports = function(context) {
    return {
        "Literal" : function(node) {
            var result = getTadpoles(context, node);

            if(result.hasTadpoles) {
                var actualNumber = Number(node.value);
                reportNumberLiteral(context, node, result.literal + actualNumber);
            }
        },
        "Identifier": function(node) {
            var result = getTadpoles(context, node);
            if(result.hasTadpoles) {
                if(result.code === 'undefined' || result.code === 'null') {
                    reportNumberLiteral(context, node, result.literal);
                }
                else {
                    reportCode(context, node, result.code, result.preferred);
                }
            }
        },
        "BinaryExpression": function(node) {
            var result = getTadpoles(context, node);
            if(result.hasTadpoles) {
                reportExpression(context, node, result.code, result.preferred);
            }
        },
        "CallExpression": function(node) {
            var result = getTadpoles(context, node);
            if(result.hasTadpoles) {
                reportCode(context, node, result.code, result.preferred);
            }
        },
        "MemberExpression": function(node) {
            var result = getTadpoles(context, node);
            if(result.hasTadpoles) {
                reportCode(context, node, result.code, result.preferred);
            }
        },
        "ObjectExpression": function(node) {
            var result = getTadpoles(context, node);
            if(result.hasTadpoles) {
                reportNumberLiteral(context, node, result.literal);
            }
        },
        "ArrayExpression": function(node) {
            var result = getTadpoles(context, node);
            if(result.hasTadpoles) {
                reportNumberLiteral(context, node, result.literal);
            }
        },
        "UnaryExpression": function(node) {
            if(node.operator !== '~' && node.operator !== '-') {
                var result = getTadpoles(context, node);
                if(result.hasTadpoles) {
                    reportExpression(context, node, result.code, result.preferred);
                }
            }
        }
    };
};