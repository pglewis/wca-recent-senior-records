/**
 * The global rankings object and its sub-objects
 *
 * @typedef {Object} GlobalRankingsSnapshot
 * @property {string}        refreshed      date/time string of the data snapshot in UTC
 * @property {WCAEvent[]}    events
 * @property {Person[]}      persons
 * @property {Competition[]} competitions
 * @property {Continent[]}   continents
 * @property {Country[]}     countries
 *
 * @typedef {Object} WCAEvent
 * @property {string}         id        eg 333bf
 * @property {string}         name      eg 3x3x3 Blindfolded
 * @property {string}         format    (time, number, multi)
 * @property {EventRanking[]} rankings
 *
 * @typedef {Object} EventRanking
 * @property {string} type     single, average
 * @property {string} age      40, 50, 60, ...
 * @property {Rank[]} ranks
 * @property {Object} missing  needs documentation
 *
 * @typedef {Object} Rank
 * @property {string}      rank         estimated numeric rank (considers missing records)
 * @property {string}      id           persons.id
 * @property {string}      best         the result
 * @property {string}      competition  competition ID
 * @property {string|null} [age]        sometimes included
 *
 * @typedef {Object} Competition
 * @property {string} id
 * @property {string} webId
 * @property {string} name
 * @property {string} country     2 character code
 * @property {string} startDate   competition start date, UTC YYYY-MM-DD
 *
 * @typedef {Object} Continent
 * @property {string} id
 * @property {string} name
 *
 * @typedef {Object} Country
 * @property {string} id
 * @property {string} name
 * @property {string} continent
 *
 * @typedef {Object} Person
 * @property {string}   id       WCA ID
 * @property {string}   name     full name
 * @property {string}   country  2 character code
 * @property {string}   age      40, 50, 60, ...
 * @property {string[]} events   Array of event IDs competed in
 */

/**
 * @typedef {Object}                ResultRowData
 * @property {string}               eventID       e.g. 333bf
 * @property {string}               eventName     e.g. 3x3x3 Blindfolded
 * @property {string}               eventType     single, average
 * @property {string}               eventFormat   "time", "number", "multi"
 * @property {string}               age           40, 50, 60, ...
 * @property {string}               date          competition start date, UTC YYYY-MM-DD
 * @property {string}               rank          estimated numeric rank (considers missing records)
 * @property {string}               name          persons.name
 * @property {string}               wcaID         persons.id
 * @property {string}               result        result as time, number, multi
 * @property {string}               compName      competition full name
 * @property {string}               compWebID     competition web ID for linking
 * @property {string}               compCountry   2 character country code
 *
 * @typedef {Object}                AppState
 * @property {ResultRowData[]|null} results
 * @property {string}               dataLastUpdated  date/time string of the data snapshot in UTC
 * @property {number}               topN
 * @property {number}               recentInDays
 * @property {Filters}              filters
 * @property {SortColumn[]}         sortColumns
 *
 * @typedef {Object}                Filters
 * @property {string|null}          search
 *
 * @typedef {Object}                SortColumn
 * @property {string}               name
 * @property {string}               label
 * @property {number}               direction
 *
 * @typedef {Object} 				SortChange
 * @property {string} 				SortChange.name
 * @property {string} 				SortChange.label
 * @property {number} 				SortChange.position
 * @property {number} 				SortChange.defaultDirection

 *
 * @typedef {Object}                DataStore
 * @property {GetStateCB}           DataStore.getState   Returns a the current state
 * @property {DispatchCB}           DataStore.dispatch   Dispatch an action, all state mutations go through here
 * @param {Action}                  action
 *
 * @callback                        GetStateCB
 * @returns {AppState}
 *
 * @callback                        DispatchCB
 * @param {Action}                  action
 * @returns {void}
 *
 * @typedef {Object}                Action
 * @property {string}               Action.type       Unique identifier for the action
 * @property {*}                    [Action.payload]  Optional context-specific data
 *
 * Returns a new state resulting from performing an action on a state
 * @callback                        ReducerCB
 * @param {AppState}                state
 * @param {Action}                  action
 * @returns {AppState}
 *
 * @typedef {Object}                Root
 * @property {RenderCB}             render
 *
 * @callback                        RenderCB
 * @param {Node|Node[]}             node
 * @returns {void}
 */
