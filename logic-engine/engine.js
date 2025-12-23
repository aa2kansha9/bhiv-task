class LogicEngine {
    constructor() {
        this.rules = [];
    }

    /**
     * Add a rule to the engine
     * @param {Object} rule - Rule object with condition and action
     */
    addRule(rule) {
        this.rules.push(rule);
    }

    /**
     * Evaluate all rules against input data
     * @param {Object} data - Input data to evaluate
     * @returns {Object} - Structured output with results
     */
        evaluate(data) {
        const results = [];
        const tags = new Set();
        const alerts = [];
        
        for (const rule of this.rules) {
            try {
                // Check if condition is met
                let conditionMet = false;
                
                if (typeof rule.condition === 'function') {
                    // Condition is a function
                    conditionMet = rule.condition(data);
                } else if (rule.condition.type === 'threshold') {
                    // Threshold condition
                    const value = data[rule.condition.field];
                    conditionMet = this.checkThreshold(value, rule.condition);
                } else if (rule.condition.type === 'keyword') {
                    // Keyword condition
                    const text = data[rule.condition.field] || '';
                    conditionMet = this.checkKeyword(text, rule.condition);
                } else if (rule.condition.type === 'custom') {
                    // Custom JavaScript condition
                    conditionMet = this.evaluateCustomCondition(rule.condition.expression, data);
                }
                
                // If condition is met, execute actions
                if (conditionMet) {
                    results.push({
                        ruleId: rule.id || rule.name,
                        condition: rule.condition,
                        met: true
                    });
                    
                    // Process actions
                    if (rule.actions) {
                        this.processActions(rule.actions, data, tags, alerts);
                    }
                }
            } catch (error) {
                console.error(`Error evaluating rule ${rule.id || rule.name}:`, error);
            }
        }
        
        return {
            input: data,
            results: results,
            tags: Array.from(tags),
            alerts: alerts,
            summary: {
                totalRules: this.rules.length,
                triggeredRules: results.length,
                tagsGenerated: tags.size,
                alertsGenerated: alerts.length
            }
        };
    }
        checkThreshold(value, condition) {
        const { operator, threshold } = condition;
        
        switch (operator) {
            case 'greaterThan':
                return value > threshold;
            case 'greaterThanOrEqual':
                return value >= threshold;
            case 'lessThan':
                return value < threshold;
            case 'lessThanOrEqual':
                return value <= threshold;
            case 'equal':
                return value === threshold;
            case 'notEqual':
                return value !== threshold;
            case 'between':
                return value >= threshold.min && value <= threshold.max;
            default:
                return false;
        }
    }
    
    checkKeyword(text, condition) {
        const searchText = String(text).toLowerCase();
        const keywords = condition.keywords.map(k => k.toLowerCase());
        
        if (condition.match === 'any') {
            return keywords.some(keyword => searchText.includes(keyword));
        } else if (condition.match === 'all') {
            return keywords.every(keyword => searchText.includes(keyword));
        } else if (condition.match === 'exact') {
            return keywords.includes(searchText);
        }
        return false;
    }
    
    evaluateCustomCondition(expression, data) {
        // Very basic custom expression evaluation
        // In production, use a proper expression evaluator or sandbox
        try {
            const func = new Function('data', `return ${expression}`);
            return func(data);
        } catch (error) {
            console.error('Error evaluating custom condition:', error);
            return false;
        }
    }
    
    processActions(actions, data, tags, alerts) {
        if (actions.addTags) {
            actions.addTags.forEach(tag => tags.add(tag));
        }
        
        if (actions.raiseAlert) {
            alerts.push({
                message: actions.raiseAlert.message || 'Alert triggered',
                severity: actions.raiseAlert.severity || 'medium',
                timestamp: new Date().toISOString(),
                data: data
            });
        }
        
        if (actions.transform) {
            // In a real implementation, you might apply transformations to data
            console.log('Transform action would be applied:', actions.transform);
        }
    }
}

module.exports = LogicEngine;

// Example rule definitions
const exampleRules = {
    // Threshold rule
    temperatureHigh: {
        id: 'temp_high',
        name: 'High Temperature Alert',
        condition: {
            type: 'threshold',
            field: 'temperature',
            operator: 'greaterThan',
            threshold: 30
        },
        actions: {
            addTags: ['high-temp', 'needs-review'],
            raiseAlert: {
                message: 'Temperature exceeds safe limit',
                severity: 'high'
            }
        }
    },
    
    // Keyword rule
    urgentKeyword: {
        id: 'urgent_keyword',
        name: 'Urgent Request Detector',
        condition: {
            type: 'keyword',
            field: 'message',
            keywords: ['urgent', 'asap', 'emergency'],
            match: 'any'
        },
        actions: {
            addTags: ['urgent', 'priority'],
            raiseAlert: {
                message: 'Urgent request detected',
                severity: 'medium'
            }
        }
    },
    
    // Custom function rule
    complexCondition: {
        id: 'complex_rule',
        name: 'Complex Business Rule',
        condition: function(data) {
            return data.temperature > 25 && 
                   data.humidity < 70 && 
                   (data.status === 'active' || data.priority === 'high');
        },
        actions: {
            addTags: ['optimal-conditions']
        }
    }
};

// Helper function to create a pre-configured engine with example rules
function createExampleEngine() {
    const engine = new LogicEngine();
    Object.values(exampleRules).forEach(rule => engine.addRule(rule));
    return engine;
}

// Export everything
module.exports = {
    LogicEngine,
    exampleRules,
    createExampleEngine
};