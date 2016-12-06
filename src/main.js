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
        //'localeMatcher': {'values': ['lookup', 'best fit']},
        //'formatMatcher': {'values': ['basic', 'best fit']},
      },
      'test': (Intl) => {
        if (!Intl.hasOwnProperty("DateTimeFormat")) {
          return false;
        }

        const results = {
          extensionKeys: {},
          options: {}
        };

        for (const key in tests.DateTimeFormat.extensionKeys) {
          const value = tests.DateTimeFormat.extensionKeys[key].values[0];
          const name = tests.DateTimeFormat.extensionKeys[key].name;
          const extKey = { [key]: value };
          const dtf = new Intl.DateTimeFormat(
            constructLocaleString('en-US', extKey)
          );
          results.extensionKeys[key] = dtf.resolvedOptions()[name] === value;
        };

        for (const name in tests.DateTimeFormat.options) {
          const values = tests.DateTimeFormat.options[name].values;
          const optionsBase = tests.DateTimeFormat.options[name].optionsBase || {};

          const res = {};

          for (const val of values) {
            const options = Object.assign({
              [name]: val
            }, optionsBase);
            const dtf = new Intl.DateTimeFormat('en-US', options);
            res[val] = dtf.resolvedOptions()[name] === val;
          };

          if (Object.keys(res).length === 1) {
            results.options[name] = res[Object.keys(res)[0]];
          } else {
            results.options[name] = res;
          }
        }
        return results;
      }
    }
  }


  function runTests() {
    if (typeof Intl === "undefined") {
      return false;
    }

    const results = {};

    for (const key in tests) {
      results[key] = tests[key].test(Intl);
    };

    return results;
  }

  const results = runTests();
  console.log(JSON.stringify(results, null, 2));
}
