{
  /* Helper Functions */

  function constructLocaleString(languageTag, extensionKeys = {}) {
    let extKeys = [];

    for (const [key, value] of Object.entries(extensionKeys)) {
      extKeys.push(`${key}-${value}`); 
    };
    if (extKeys.length === 0) {
      return languageTag;
    }
    return `${languageTag}-u-${extKeys.join('-')}`;
  }

  function testFormatter(fmtName, Intl) {
    if (!Intl.hasOwnProperty(fmtName)) {
      return false;
    }

    const formatter = tests[fmtName];
    const extKeys = formatter.extensionKeys;

    const results = {
      extensionKeys: {},
      options: {}
    };

    for (const key in extKeys) {
      const value = extKeys[key].values[0];
      const name = extKeys[key].name;
      const extKey = { [key]: value };
      const dtf = new Intl[fmtName](
        constructLocaleString('en-US', extKey)
      );
      results.extensionKeys[key] = dtf.resolvedOptions()[name] === value;
    };

    for (const name in formatter.options) {
      const values = formatter.options[name].values;
      const optionsBase = formatter.options[name].optionsBase || {};

      const res = {};

      for (const i in values) {
        const val = values[i];
        const options = Object.assign({
          [name]: val
        }, Array.isArray(optionsBase) ? optionsBase[i] : optionsBase);
        const fmt = new Intl[fmtName]('en-US', options);
        res[val] = fmt.resolvedOptions()[name] === val;
      };

      let allTrue = Object.keys(res).every(name => res[name]);
      let allFalse = Object.keys(res).every(name => !res[name]);

      if (allTrue) {
        results.options[name] = true;
      } else if (allFalse) {
        results.options[name] = false;
      } else {
        results.options[name] = res;
      }
    }
    return results;
  }

  /* Tests */

  const tests = {
    'DateTimeFormat': {
      'locales': 'fr',
      'extensionKeys': {
        'ca': {'name': 'calendar', 'values': ['buddhist']},
        'nu': {'name': 'numberingSystem', 'values': ['arab']},
      },
      'options': {
        'timeZone': {'values': ['Asia/Shanghai']},
        'hour12': {'values': [true, false], 'optionsBase': {'hour': '2-digit'}},
        'weekday': {'values': ['narrow', 'short', 'long'], 'optionsBase': {'day': '2-digit'}},
        'era': {'values': ['narrow', 'short', 'long']},
        'year': {'values': ['numeric', '2-digit']},
        'month': {'values': ['numeric', '2-digit', 'narrow', 'short', 'long']},
        'day': {'values': ['numeric', '2-digit']},
        'hour': {'values': ['numeric', '2-digit'], 'optionsBase': [{}, {'hour12': false}]},
        'minute': {'values': ['numeric', '2-digit'], 'optionsBase': [{}, {'hour': 'numeric'}]},
        'second': {'values': ['numeric', '2-digit'], 'optionsBase': [{}, {'minute': '2-digit'}]},
        'timeZoneName': {'values': ['short', 'long']},

        //'localeMatcher': {'values': ['lookup', 'best fit']},
        //'formatMatcher': {'values': ['basic', 'best fit']},
      },
    },
    'NumberFormat': {
      'locales': 'fr',
      'extensionKeys': {
        'nu': {'name': 'numberingSytsem', 'values': ['arab']},
      },
      'options': {
        'style': {'values': ['decimal', 'currency', 'percent'], 'optionsBase': [{}, {'currency': 'EUR'}, {}]},
        'currency': {'values': ['EUR', 'CNY', 'USD'], 'optionsBase': {'style': 'currency'}},
        'currencyDisplay': {'values': ['symbol', 'code', 'name'], 'optionsBase': {'style': 'currency', 'currency': 'EUR'}},
        'useGrouping': {'values': [true, false]},
        'minimumIntegerDigits': {'values': [1, 2]},
        'minimumFractionDigits': {'values': [1, 2, 3]},
        'maximumFractionDigits': {'values': [1, 2, 3]},
        'minimumSignificantDigits': {'values': [1, 2, 3]},
        'maximumSignificantDigits': {'values': [1, 2, 3]},

        //'localeMatcher': {'values': ['lookup', 'best fit']},
      },
    },
    'Collator': {
      'locales': 'fr',
      'extensionKeys': {
        'co': {'name': 'collation', 'values': ['phonetic']},
        'kn': {'name': 'numeric', 'values': [true]},
        'kf': {'name': 'caseFirst', 'values': ['upper']},
      },
      'options': {
        'usage': {'values': ['sort', 'search']},
        'sensitivity': {'values': ['base', 'accent', 'case', 'variant']},
        'ignorePunctuation': {'values': [true, false]},
        'numeric': {'values': [true, false]},
        'caseFirst': {'values': ['upper', 'lower', 'false']},
      },
    },
  }


  function runTests() {
    if (typeof Intl === "undefined") {
      return false;
    }

    const results = {};

    for (const key in tests) {
      results[key] = testFormatter(key, Intl);
    };

    return results;
  }

  const results = runTests();
  console.log(JSON.stringify(results, null, 2));
}
