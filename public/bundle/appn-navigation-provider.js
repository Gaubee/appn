import { i, r, _ as __esDecorate, t, b as __runInitializers, x as x$1 } from './custom-element-T1yNbIOj.js';
import { i as i$1, e as e$1 } from './provide-BBrWF2C4.js';
import { n } from './property-CF65yZga.js';
import { e } from './base-uB2zMOXV.js';
import { h, e as eventProperty } from './event-property-dUqnKvcM.js';
import { z as z$1 } from './index-Ccu0cnQI.js';
import { s as safeProperty } from './safe-property-BaHsMKyU.js';
import { e as enumToSafeConverter } from './enum-to-safe-converter-BKItebm4.js';
import './css-starting-style.js';
import { a as appnNavigationContext, b as appnNavigationHistoryEntryContext } from './appn-navigation-context-CU3HWNup.js';
import { c as cssLiteral } from './lit-helper-BL1WAkuv.js';
import { i as iter_map_not_null } from './iterable-BLBaa199.js';
import './create-context-CT4pxGTb.js';
import './directive-DAJw2ZJj.js';
import './decorators-D_q1KxA8.js';
import './map-lhWNNA3b.js';

/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */function o(o){return (e$1,n)=>{const{slot:r,selector:s}=o??{},c="slot"+(r?`[name=${r}]`:":not([name])");return e(e$1,n,{get(){const t=this.renderRoot?.querySelector(c),e=t?.assignedElements(o)??[];return void 0===s?e:e.filter((t=>t.matches(s)))}})}}

let globalNavigation = undefined;
if (typeof window !== "undefined" && window.navigation) {
    const navigation = window.navigation;
    assertNavigation(navigation);
    globalNavigation = navigation;
}
function assertNavigation(value) {
    if (!value) {
        throw new Error("Expected Navigation");
    }
}

function isEvent(value) {
    function isLike(value) {
        return !!value;
    }
    return (isLike(value) &&
        (typeof value.type === "string" || typeof value.type === "symbol"));
}
function assertEvent(value, type) {
    if (!isEvent(value)) {
        throw new Error("Expected event");
    }
    if (typeof type !== "undefined" && value.type !== type) {
        throw new Error(`Expected event type ${String(type)}, got ${value.type.toString()}`);
    }
}

function isParallelEvent(value) {
    return isEvent(value) && value.parallel !== false;
}

class AbortError extends Error {
    constructor(message) {
        super(`AbortError${message ? `: ${message}` : ""}`);
        this.name = "AbortError";
    }
}
function isAbortError(error) {
    return error instanceof Error && error.name === "AbortError";
}
class InvalidStateError extends Error {
    constructor(message) {
        super(`InvalidStateError${message ? `: ${message}` : ""}`);
        this.name = "InvalidStateError";
    }
}
function isInvalidStateError(error) {
    return error instanceof Error && error.name === "InvalidStateError";
}

function isAbortSignal(value) {
    function isAbortSignalLike(value) {
        return typeof value === "object";
    }
    return (isAbortSignalLike(value) &&
        typeof value.aborted === "boolean" &&
        typeof value.addEventListener === "function");
}
function isSignalEvent(value) {
    function isSignalEventLike(value) {
        return value.hasOwnProperty("signal");
    }
    return (isEvent(value) && isSignalEventLike(value) && isAbortSignal(value.signal));
}
function isSignalHandled(event, error) {
    if (isSignalEvent(event) &&
        event.signal.aborted &&
        error instanceof Error &&
        isAbortError(error)) {
        return true;
    }
}

/**
 * @experimental
 */
const EventTargetListeners$1 = Symbol.for("@opennetwork/environment/events/target/listeners");
/**
 * @experimental
 */
const EventTargetListenersIgnore = Symbol.for("@opennetwork/environment/events/target/listeners/ignore");
/**
 * @experimental
 */
const EventTargetListenersMatch = Symbol.for("@opennetwork/environment/events/target/listeners/match");
/**
 * @experimental
 */
const EventTargetListenersThis = Symbol.for("@opennetwork/environment/events/target/listeners/this");

const EventDescriptorSymbol = Symbol.for("@opennetwork/environment/events/descriptor");

function matchEventCallback(type, callback, options) {
    const optionsDescriptor = isOptionsDescriptor(options) ? options : undefined;
    return (descriptor) => {
        if (optionsDescriptor) {
            return optionsDescriptor === descriptor;
        }
        return ((!callback || callback === descriptor.callback) &&
            type === descriptor.type);
    };
    function isOptionsDescriptor(options) {
        function isLike(options) {
            return !!options;
        }
        return isLike(options) && options[EventDescriptorSymbol] === true;
    }
}

function isFunctionEventCallback(fn) {
    return typeof fn === "function";
}
const EventTargetDescriptors = Symbol.for("@virtualstate/navigation/event-target/descriptors");
class EventTargetListeners {
    [EventTargetDescriptors] = [];
    [EventTargetListenersIgnore] = new WeakSet();
    get [EventTargetListeners$1]() {
        return [...(this[EventTargetDescriptors] ?? [])];
    }
    [EventTargetListenersMatch](type) {
        const external = this[EventTargetListeners$1];
        const matched = [
            ...new Set([...(external ?? []), ...(this[EventTargetDescriptors] ?? [])]),
        ]
            .filter((descriptor) => descriptor.type === type || descriptor.type === "*")
            .filter((descriptor) => !this[EventTargetListenersIgnore]?.has(descriptor));
        const listener = typeof type === "string" ? this[`on${type}`] : undefined;
        if (typeof listener === "function" && isFunctionEventCallback(listener)) {
            matched.push({
                type,
                callback: listener,
                [EventDescriptorSymbol]: true,
            });
        }
        return matched;
    }
    addEventListener(type, callback, options) {
        const listener = {
            ...options,
            isListening: () => !!this[EventTargetDescriptors]?.find(matchEventCallback(type, callback)),
            descriptor: {
                [EventDescriptorSymbol]: true,
                ...options,
                type,
                callback,
            },
            timestamp: Date.now(),
        };
        if (listener.isListening()) {
            return;
        }
        this[EventTargetDescriptors]?.push(listener.descriptor);
    }
    removeEventListener(type, callback, options) {
        if (!isFunctionEventCallback(callback)) {
            return;
        }
        const externalListeners = this[EventTargetListeners$1] ?? this[EventTargetDescriptors] ?? [];
        const externalIndex = externalListeners.findIndex(matchEventCallback(type, callback, options));
        if (externalIndex === -1) {
            return;
        }
        const index = this[EventTargetDescriptors]?.findIndex(matchEventCallback(type, callback, options)) ??
            -1;
        if (index !== -1) {
            this[EventTargetDescriptors]?.splice(index, 1);
        }
        const descriptor = externalListeners[externalIndex];
        if (descriptor) {
            this[EventTargetListenersIgnore]?.add(descriptor);
        }
    }
    hasEventListener(type, callback) {
        if (callback && !isFunctionEventCallback(callback)) {
            return false;
        }
        const foundIndex = this[EventTargetDescriptors]?.findIndex(matchEventCallback(type, callback)) ?? -1;
        return foundIndex > -1;
    }
}

class AsyncEventTarget extends EventTargetListeners {
    [EventTargetListenersThis];
    constructor(thisValue = undefined) {
        super();
        this[EventTargetListenersThis] = thisValue;
    }
    async dispatchEvent(event) {
        const listeners = this[EventTargetListenersMatch]?.(event.type) ?? [];
        // Don't even dispatch an aborted event
        if (isSignalEvent(event) && event.signal.aborted) {
            throw new AbortError();
        }
        const parallel = isParallelEvent(event);
        const promises = [];
        for (let index = 0; index < listeners.length; index += 1) {
            const descriptor = listeners[index];
            const promise = (async () => {
                // Remove the listener before invoking the callback
                // This ensures that inside of the callback causes no more additional event triggers to this
                // listener
                if (descriptor.once) {
                    // by passing the descriptor as the options, we get an internal redirect
                    // that forces an instance level object equals, meaning
                    // we will only remove _this_ descriptor!
                    this.removeEventListener(descriptor.type, descriptor.callback, descriptor);
                }
                await descriptor.callback.call(this[EventTargetListenersThis] ?? this, event);
            })();
            if (!parallel) {
                try {
                    await promise;
                }
                catch (error) {
                    if (!isSignalHandled(event, error)) {
                        await Promise.reject(error);
                    }
                }
                if (isSignalEvent(event) && event.signal.aborted) {
                    // bye
                    return;
                }
            }
            else {
                promises.push(promise);
            }
        }
        if (promises.length) {
            // Allows for all promises to settle finish so we can stay within the event, we then
            // will utilise Promise.all which will reject with the first rejected promise
            const results = await Promise.allSettled(promises);
            const rejected = results.filter((result) => {
                return result.status === "rejected";
            });
            if (rejected.length) {
                let unhandled = rejected;
                // If the event was aborted, then allow abort errors to occur, and handle these as handled errors
                // The dispatcher does not care about this because they requested it
                //
                // There may be other unhandled errors that are more pressing to the task they are doing.
                //
                // The dispatcher can throw an abort error if they need to throw it up the chain
                if (isSignalEvent(event) && event.signal.aborted) {
                    unhandled = unhandled.filter((result) => !isSignalHandled(event, result.reason));
                }
                if (unhandled.length === 1) {
                    await Promise.reject(unhandled[0].reason);
                    throw unhandled[0].reason; // We shouldn't get here
                }
                else if (unhandled.length > 1) {
                    throw new AggregateError(unhandled.map(({ reason }) => reason));
                }
            }
        }
    }
}

const defaultEventTargetModule = {
    EventTarget: AsyncEventTarget,
    AsyncEventTarget,
    SyncEventTarget: AsyncEventTarget,
};
let eventTargetModule = defaultEventTargetModule;
//
// try {
//     eventTargetModule = await import("@virtualstate/navigation/event-target");
//     console.log("Using @virtualstate/navigation/event-target", eventTargetModule);
// } catch {
//     console.log("Using defaultEventTargetModule");
//     eventTargetModule = defaultEventTargetModule;
// }
const EventTargetImplementation = eventTargetModule.EventTarget || eventTargetModule.SyncEventTarget || eventTargetModule.AsyncEventTarget;
function assertEventTarget(target) {
    if (typeof target !== "function") {
        throw new Error("Could not load EventTarget implementation");
    }
}
class EventTarget extends AsyncEventTarget {
    constructor(...args) {
        super();
        if (EventTargetImplementation) {
            assertEventTarget(EventTargetImplementation);
            const { dispatchEvent } = new EventTargetImplementation(...args);
            this.dispatchEvent = dispatchEvent;
        }
    }
}

class NavigationEventTarget extends EventTarget {
    addEventListener(type, listener, options) {
        assertEventCallback(listener);
        return super.addEventListener(type, listener, typeof options === "boolean" ? { once: options } : options);
        function assertEventCallback(listener) {
            if (typeof listener !== "function")
                throw new Error("Please us the function variant of event listener");
        }
    }
    removeEventListener(type, listener, options) {
        assertEventCallback(listener);
        return super.removeEventListener(type, listener);
        function assertEventCallback(listener) {
            if (typeof listener !== "function")
                throw new Error("Please us the function variant of event listener");
        }
    }
}

const isWebCryptoSupported = "crypto" in globalThis && typeof globalThis.crypto.randomUUID === "function";
const v4 = isWebCryptoSupported
    ? globalThis.crypto.randomUUID.bind(globalThis.crypto)
    : () => Array.from({ length: 5 }, () => `${Math.random()}`.replace(/^0\./, ""))
        .join("-")
        .replace(".", "");

// To prevent cyclic imports, where a circular is used, instead use the prototype interface
// and then copy over the "private" symbol
const NavigationGetState$1 = Symbol.for("@virtualstate/navigation/getState");
const NavigationHistoryEntryNavigationType = Symbol.for("@virtualstate/navigation/entry/navigationType");
const NavigationHistoryEntryKnownAs = Symbol.for("@virtualstate/navigation/entry/knownAs");
const NavigationHistoryEntrySetState = Symbol.for("@virtualstate/navigation/entry/setState");
function isPrimitiveValue(state) {
    return (typeof state === "number" ||
        typeof state === "boolean" ||
        typeof state === "symbol" ||
        typeof state === "bigint" ||
        typeof state === "string");
}
function isValue(state) {
    return !!(state || isPrimitiveValue(state));
}
class NavigationHistoryEntry extends NavigationEventTarget {
    #index;
    #state;
    get index() {
        return typeof this.#index === "number" ? this.#index : this.#index();
    }
    key;
    id;
    url;
    sameDocument;
    get [NavigationHistoryEntryNavigationType]() {
        return this.#options.navigationType;
    }
    get [NavigationHistoryEntryKnownAs]() {
        const set = new Set(this.#options[NavigationHistoryEntryKnownAs]);
        set.add(this.id);
        return set;
    }
    #options;
    get [EventTargetListeners$1]() {
        return [
            ...(super[EventTargetListeners$1] ?? []),
            ...(this.#options[EventTargetListeners$1] ?? []),
        ];
    }
    constructor(init) {
        super();
        this.#options = init;
        this.key = init.key || v4();
        this.id = v4();
        this.url = init.url ?? undefined;
        this.#index = init.index;
        this.sameDocument = init.sameDocument ?? true;
        this.#state = init.state ?? undefined;
    }
    [NavigationGetState$1]() {
        return this.#options?.getState?.(this);
    }
    getState() {
        let state = this.#state;
        if (!isValue(state)) {
            const external = this[NavigationGetState$1]();
            if (isValue(external)) {
                state = this.#state = external;
            }
        }
        /**
         * https://github.com/WICG/app-history/blob/7c0332b30746b14863f717404402bc49e497a2b2/spec.bs#L1406
         * Note that in general, unless the state value is a primitive, entry.getState() !== entry.getState(), since a fresh copy is returned each time.
         */
        if (typeof state === "undefined" ||
            isPrimitiveValue(state)) {
            return state;
        }
        if (typeof state === "function") {
            console.warn("State passed to Navigation.navigate was a function, this may be unintentional");
            console.warn("Unless a state value is primitive, with a standard implementation of Navigation");
            console.warn("your state value will be serialized and deserialized before this point, meaning");
            console.warn("a function would not be usable.");
        }
        return {
            ...state,
        };
    }
    [NavigationHistoryEntrySetState](state) {
        this.#state = state;
    }
}

/**
 * @param handleCatch rejected promises automatically to allow free usage
 */
function deferred(handleCatch) {
    let resolve = undefined, reject = undefined;
    const promise = new Promise((resolveFn, rejectFn) => {
        resolve = resolveFn;
        reject = rejectFn;
    });
    ok$1(resolve);
    ok$1(reject);
    return {
        resolve,
        reject,
        promise: handleCatch ? promise.catch(handleCatch) : promise,
    };
}
function ok$1(value) {
    if (!value) {
        throw new Error("Value not provided");
    }
}

const GlobalAbortController = typeof AbortController !== "undefined" ? AbortController : undefined;

if (!GlobalAbortController) {
    throw new Error("AbortController expected to be available or polyfilled");
}
const AbortController$1 = GlobalAbortController;

function isPromise(value) {
    return (like(value) &&
        typeof value.then === "function");
}
function ok(value, message = "Expected value") {
    if (!value) {
        throw new Error(message);
    }
}
function isPromiseRejectedResult(value) {
    return value.status === "rejected";
}
function like(value) {
    return !!value;
}

const THIS_WILL_BE_REMOVED = "This will be removed when the first major release of @virtualstate/navigation is published";
const WARNINGS = {
    EVENT_INTERCEPT_HANDLER: `You are using a non standard interface, please update your code to use event.intercept({ async handler() {} })\n${THIS_WILL_BE_REMOVED}`
};
let GLOBAL_IS_WARNINGS_TRACED = true;
function logWarning(warning, ...message) {
    try {
        if (GLOBAL_IS_WARNINGS_TRACED) {
            console.trace(WARNINGS[warning], ...message);
        }
    }
    catch {
        // We don't want attempts to log causing issues
        // maybe we don't have a console
    }
}

const Rollback = Symbol.for("@virtualstate/navigation/rollback");
const Unset = Symbol.for("@virtualstate/navigation/unset");
const NavigationTransitionParentEventTarget = Symbol.for("@virtualstate/navigation/transition/parentEventTarget");
const NavigationTransitionFinishedDeferred = Symbol.for("@virtualstate/navigation/transition/deferred/finished");
const NavigationTransitionCommittedDeferred = Symbol.for("@virtualstate/navigation/transition/deferred/committed");
const NavigationTransitionNavigationType = Symbol.for("@virtualstate/navigation/transition/navigationType");
const NavigationTransitionInitialEntries = Symbol.for("@virtualstate/navigation/transition/entries/initial");
const NavigationTransitionFinishedEntries = Symbol.for("@virtualstate/navigation/transition/entries/finished");
const NavigationTransitionInitialIndex = Symbol.for("@virtualstate/navigation/transition/index/initial");
const NavigationTransitionFinishedIndex = Symbol.for("@virtualstate/navigation/transition/index/finished");
const NavigationTransitionEntry = Symbol.for("@virtualstate/navigation/transition/entry");
const NavigationTransitionIsCommitted = Symbol.for("@virtualstate/navigation/transition/isCommitted");
const NavigationTransitionIsFinished = Symbol.for("@virtualstate/navigation/transition/isFinished");
const NavigationTransitionIsRejected = Symbol.for("@virtualstate/navigation/transition/isRejected");
const NavigationTransitionKnown = Symbol.for("@virtualstate/navigation/transition/known");
const NavigationTransitionPromises = Symbol.for("@virtualstate/navigation/transition/promises");
const NavigationIntercept = Symbol.for("@virtualstate/navigation/intercept");
const NavigationTransitionIsOngoing = Symbol.for("@virtualstate/navigation/transition/isOngoing");
const NavigationTransitionIsPending = Symbol.for("@virtualstate/navigation/transition/isPending");
const NavigationTransitionIsAsync = Symbol.for("@virtualstate/navigation/transition/isAsync");
const NavigationTransitionWait = Symbol.for("@virtualstate/navigation/transition/wait");
const NavigationTransitionPromiseResolved = Symbol.for("@virtualstate/navigation/transition/promise/resolved");
const NavigationTransitionRejected = Symbol.for("@virtualstate/navigation/transition/rejected");
const NavigationTransitionCommit = Symbol.for("@virtualstate/navigation/transition/commit");
const NavigationTransitionFinish = Symbol.for("@virtualstate/navigation/transition/finish");
const NavigationTransitionStart = Symbol.for("@virtualstate/navigation/transition/start");
const NavigationTransitionStartDeadline = Symbol.for("@virtualstate/navigation/transition/start/deadline");
const NavigationTransitionError = Symbol.for("@virtualstate/navigation/transition/error");
const NavigationTransitionFinally = Symbol.for("@virtualstate/navigation/transition/finally");
const NavigationTransitionAbort = Symbol.for("@virtualstate/navigation/transition/abort");
const NavigationTransitionInterceptOptionsCommit = Symbol.for("@virtualstate/navigation/transition/intercept/options/commit");
const NavigationTransitionCommitIsManual = Symbol.for("@virtualstate/navigation/transition/commit/isManual");
class NavigationTransition extends EventTarget {
    finished;
    /**
     * @experimental
     */
    committed;
    from;
    navigationType;
    /**
     * true if transition has an async intercept
     */
    [NavigationTransitionIsAsync] = false;
    /**
     * @experimental
     */
    [NavigationTransitionInterceptOptionsCommit];
    #options;
    [NavigationTransitionFinishedDeferred] = deferred();
    [NavigationTransitionCommittedDeferred] = deferred();
    get [NavigationTransitionIsPending]() {
        return !!this.#promises.size;
    }
    get [NavigationTransitionNavigationType]() {
        return this.#options[NavigationTransitionNavigationType];
    }
    get [NavigationTransitionInitialEntries]() {
        return this.#options[NavigationTransitionInitialEntries];
    }
    get [NavigationTransitionInitialIndex]() {
        return this.#options[NavigationTransitionInitialIndex];
    }
    get [NavigationTransitionCommitIsManual]() {
        return !!(this[NavigationTransitionInterceptOptionsCommit]?.includes("after-transition") ||
            this[NavigationTransitionInterceptOptionsCommit]?.includes("manual"));
    }
    [NavigationTransitionFinishedEntries];
    [NavigationTransitionFinishedIndex];
    [NavigationTransitionIsCommitted] = false;
    [NavigationTransitionIsFinished] = false;
    [NavigationTransitionIsRejected] = false;
    [NavigationTransitionIsOngoing] = false;
    [NavigationTransitionKnown] = new Set();
    [NavigationTransitionEntry];
    #promises = new Set();
    #rolledBack = false;
    #abortController = new AbortController$1();
    get signal() {
        return this.#abortController.signal;
    }
    get [NavigationTransitionPromises]() {
        return this.#promises;
    }
    constructor(init) {
        super();
        this[NavigationTransitionInterceptOptionsCommit] = [];
        this[NavigationTransitionFinishedDeferred] =
            init[NavigationTransitionFinishedDeferred] ??
                this[NavigationTransitionFinishedDeferred];
        this[NavigationTransitionCommittedDeferred] =
            init[NavigationTransitionCommittedDeferred] ??
                this[NavigationTransitionCommittedDeferred];
        this.#options = init;
        const finished = (this.finished =
            this[NavigationTransitionFinishedDeferred].promise);
        const committed = (this.committed =
            this[NavigationTransitionCommittedDeferred].promise);
        // Auto catching abort
        void finished.catch((error) => error);
        void committed.catch((error) => error);
        this.from = init.from;
        this.navigationType = init.navigationType;
        this[NavigationTransitionFinishedEntries] =
            init[NavigationTransitionFinishedEntries];
        this[NavigationTransitionFinishedIndex] =
            init[NavigationTransitionFinishedIndex];
        const known = init[NavigationTransitionKnown];
        if (known) {
            for (const entry of known) {
                this[NavigationTransitionKnown].add(entry);
            }
        }
        this[NavigationTransitionEntry] = init[NavigationTransitionEntry];
        // Event listeners
        {
            // Events to promises
            {
                this.addEventListener(NavigationTransitionCommit, this.#onCommitPromise, { once: true });
                this.addEventListener(NavigationTransitionFinish, this.#onFinishPromise, { once: true });
            }
            // Events to property setters
            {
                this.addEventListener(NavigationTransitionCommit, this.#onCommitSetProperty, { once: true });
                this.addEventListener(NavigationTransitionFinish, this.#onFinishSetProperty, { once: true });
            }
            // Rejection + Abort
            {
                this.addEventListener(NavigationTransitionError, this.#onError, {
                    once: true,
                });
                this.addEventListener(NavigationTransitionAbort, () => {
                    if (!this[NavigationTransitionIsFinished]) {
                        return this[NavigationTransitionRejected](new AbortError());
                    }
                });
            }
            // Proxy all events from this transition onto entry + the parent event target
            //
            // The parent could be another transition, or the Navigation, this allows us to
            // "bubble up" events layer by layer
            //
            // In this implementation, this allows individual transitions to "intercept" navigate and break the child
            // transition from happening
            //
            // TODO WARN this may not be desired behaviour vs standard spec'd Navigation
            {
                this.addEventListener("*", this[NavigationTransitionEntry].dispatchEvent.bind(this[NavigationTransitionEntry]));
                this.addEventListener("*", init[NavigationTransitionParentEventTarget].dispatchEvent.bind(init[NavigationTransitionParentEventTarget]));
            }
        }
    }
    rollback = (options) => {
        // console.log({ rolled: this.#rolledBack });
        if (this.#rolledBack) {
            // TODO
            throw new InvalidStateError("Rollback invoked multiple times: Please raise an issue at https://github.com/virtualstate/navigation with the use case where you want to use a rollback multiple times, this may have been unexpected behaviour");
        }
        this.#rolledBack = true;
        return this.#options.rollback(options);
    };
    #onCommitSetProperty = () => {
        this[NavigationTransitionIsCommitted] = true;
    };
    #onFinishSetProperty = () => {
        this[NavigationTransitionIsFinished] = true;
    };
    #onFinishPromise = () => {
        // console.log("onFinishPromise")
        this[NavigationTransitionFinishedDeferred].resolve(this[NavigationTransitionEntry]);
    };
    #onCommitPromise = () => {
        if (this.signal.aborted) ;
        else {
            this[NavigationTransitionCommittedDeferred].resolve(this[NavigationTransitionEntry]);
        }
    };
    #onError = (event) => {
        return this[NavigationTransitionRejected](event.error);
    };
    [NavigationTransitionPromiseResolved] = (...promises) => {
        for (const promise of promises) {
            this.#promises.delete(promise);
        }
    };
    [NavigationTransitionRejected] = async (reason) => {
        if (this[NavigationTransitionIsRejected])
            return;
        this[NavigationTransitionIsRejected] = true;
        this[NavigationTransitionAbort]();
        const navigationType = this[NavigationTransitionNavigationType];
        // console.log({ navigationType, reason, entry: this[NavigationTransitionEntry] });
        if (typeof navigationType === "string" || navigationType === Rollback) {
            // console.log("navigateerror", { reason, z: isInvalidStateError(reason) });
            await this.dispatchEvent({
                type: "navigateerror",
                error: reason,
                get message() {
                    if (reason instanceof Error) {
                        return reason.message;
                    }
                    return `${reason}`;
                },
            });
            // console.log("navigateerror finished");
            if (navigationType !== Rollback &&
                !(isInvalidStateError(reason) || isAbortError(reason))) {
                try {
                    // console.log("Rollback", navigationType);
                    // console.warn("Rolling back immediately due to internal error", error);
                    await this.rollback()?.finished;
                    // console.log("Rollback complete", navigationType);
                }
                catch (error) {
                    // console.error("Failed to rollback", error);
                    throw new InvalidStateError("Failed to rollback, please raise an issue at https://github.com/virtualstate/navigation/issues");
                }
            }
        }
        this[NavigationTransitionCommittedDeferred].reject(reason);
        this[NavigationTransitionFinishedDeferred].reject(reason);
    };
    [NavigationIntercept] = (options) => {
        const transition = this;
        const promise = parseOptions();
        this[NavigationTransitionIsOngoing] = true;
        if (!promise)
            return;
        this[NavigationTransitionIsAsync] = true;
        const statusPromise = promise
            .then(() => ({
            status: "fulfilled",
            value: undefined,
        }))
            .catch(async (reason) => {
            await this[NavigationTransitionRejected](reason);
            return {
                status: "rejected",
                reason,
            };
        });
        this.#promises.add(statusPromise);
        function parseOptions() {
            if (!options)
                return undefined;
            if (isPromise(options)) {
                logWarning("EVENT_INTERCEPT_HANDLER");
                return options;
            }
            if (typeof options === "function") {
                logWarning("EVENT_INTERCEPT_HANDLER");
                return options();
            }
            const { handler, commit } = options;
            if (commit && typeof commit === "string") {
                transition[NavigationTransitionInterceptOptionsCommit].push(commit);
            }
            if (typeof handler !== "function") {
                return;
            }
            return handler();
        }
    };
    [NavigationTransitionWait] = async () => {
        if (!this.#promises.size)
            return this[NavigationTransitionEntry];
        try {
            const captured = [...this.#promises];
            const results = await Promise.all(captured);
            const rejected = results.filter((result) => result.status === "rejected");
            // console.log({ rejected, results, captured });
            if (rejected.length) {
                // TODO handle differently when there are failures, e.g. we could move navigateerror to here
                if (rejected.length === 1) {
                    throw rejected[0].reason;
                }
                if (typeof AggregateError !== "undefined") {
                    throw new AggregateError(rejected.map(({ reason }) => reason));
                }
                throw new Error();
            }
            this[NavigationTransitionPromiseResolved](...captured);
            if (this[NavigationTransitionIsPending]) {
                return this[NavigationTransitionWait]();
            }
            return this[NavigationTransitionEntry];
        }
        catch (error) {
            await this.#onError(error);
            throw await Promise.reject(error);
        }
        finally {
            await this[NavigationTransitionFinish]();
        }
    };
    [NavigationTransitionAbort]() {
        if (this.#abortController.signal.aborted)
            return;
        this.#abortController.abort();
        this.dispatchEvent({
            type: NavigationTransitionAbort,
            transition: this,
            entry: this[NavigationTransitionEntry],
        });
    }
    [NavigationTransitionFinish] = async () => {
        if (this[NavigationTransitionIsFinished]) {
            return;
        }
        await this.dispatchEvent({
            type: NavigationTransitionFinish,
            transition: this,
            entry: this[NavigationTransitionEntry],
            intercept: this[NavigationIntercept],
        });
    };
}

function getWindowBaseURL() {
    try {
        if (typeof window !== "undefined" && window.location) {
            return window.location.href;
        }
    }
    catch { }
}
function getBaseURL(url) {
    const baseURL = getWindowBaseURL() ?? "https://html.spec.whatwg.org/";
    return new URL(
    // Deno wants this to be always a string
    (url ?? "").toString(), baseURL);
}

function defer() {
    let resolve = undefined, reject = undefined, settled = false, status = "pending";
    const promise = new Promise((resolveFn, rejectFn) => {
        resolve = (value) => {
            status = "fulfilled";
            settled = true;
            resolveFn(value);
        };
        reject = (reason) => {
            status = "rejected";
            settled = true;
            rejectFn(reason);
        };
    });
    ok(resolve);
    ok(reject);
    return {
        get settled() {
            return settled;
        },
        get status() {
            return status;
        },
        resolve,
        reject,
        promise,
    };
}

class NavigationCurrentEntryChangeEvent {
    type;
    from;
    navigationType;
    constructor(type, init) {
        this.type = type;
        if (!init) {
            throw new TypeError("init required");
        }
        if (!init.from) {
            throw new TypeError("from required");
        }
        this.from = init.from;
        this.navigationType = init.navigationType ?? undefined;
    }
}

class NavigateEvent {
    type;
    canIntercept;
    /**
     * @deprecated
     */
    canTransition;
    destination;
    downloadRequest;
    formData;
    hashChange;
    info;
    signal;
    userInitiated;
    navigationType;
    constructor(type, init) {
        this.type = type;
        if (!init) {
            throw new TypeError("init required");
        }
        if (!init.destination) {
            throw new TypeError("destination required");
        }
        if (!init.signal) {
            throw new TypeError("signal required");
        }
        this.canIntercept = init.canIntercept ?? false;
        this.canTransition = init.canIntercept ?? false;
        this.destination = init.destination;
        this.downloadRequest = init.downloadRequest;
        this.formData = init.formData;
        this.hashChange = init.hashChange ?? false;
        this.info = init.info;
        this.signal = init.signal;
        this.userInitiated = init.userInitiated ?? false;
        this.navigationType = init.navigationType ?? "push";
    }
    commit() {
        throw new Error("Not implemented");
    }
    intercept(options) {
        throw new Error("Not implemented");
    }
    preventDefault() {
        throw new Error("Not implemented");
    }
    reportError(reason) {
        throw new Error("Not implemented");
    }
    scroll() {
        throw new Error("Not implemented");
    }
    /**
     * @deprecated
     */
    transitionWhile(options) {
        return this.intercept(options);
    }
}

const NavigationFormData = Symbol.for("@virtualstate/navigation/formData");
const NavigationDownloadRequest = Symbol.for("@virtualstate/navigation/downloadRequest");
const NavigationCanIntercept = Symbol.for("@virtualstate/navigation/canIntercept");
const NavigationUserInitiated = Symbol.for("@virtualstate/navigation/userInitiated");
const NavigationOriginalEvent = Symbol.for("@virtualstate/navigation/originalEvent");
function noop() {
    return undefined;
}
function getEntryIndex(entries, entry) {
    const knownIndex = entry.index;
    if (knownIndex !== -1) {
        return knownIndex;
    }
    // TODO find an entry if it has changed id
    return -1;
}
function createNavigationTransition(context) {
    const { commit: transitionCommit, currentIndex, options, known: initialKnown, currentEntry, transition, transition: { [NavigationTransitionInitialEntries]: previousEntries, [NavigationTransitionEntry]: entry, [NavigationIntercept]: intercept, }, reportError } = context;
    let { transition: { [NavigationTransitionNavigationType]: navigationType }, } = context;
    let resolvedEntries = [...previousEntries];
    const known = new Set(initialKnown);
    let destinationIndex = -1, nextIndex = currentIndex;
    if (navigationType === Rollback) {
        const { index } = options ?? { index: undefined };
        if (typeof index !== "number")
            throw new InvalidStateError("Expected index to be provided for rollback");
        destinationIndex = index;
        nextIndex = index;
    }
    else if (navigationType === "traverse" || navigationType === "reload") {
        destinationIndex = getEntryIndex(previousEntries, entry);
        nextIndex = destinationIndex;
    }
    else if (navigationType === "replace") {
        if (currentIndex === -1) {
            navigationType = "push";
            destinationIndex = currentIndex + 1;
            nextIndex = destinationIndex;
        }
        else {
            destinationIndex = currentIndex;
            nextIndex = currentIndex;
        }
    }
    else {
        destinationIndex = currentIndex + 1;
        nextIndex = destinationIndex;
    }
    if (typeof destinationIndex !== "number" || destinationIndex === -1) {
        throw new InvalidStateError("Could not resolve next index");
    }
    // console.log({ navigationType, entry, options });
    if (!entry.url) {
        console.trace({ navigationType, entry, options });
        throw new InvalidStateError("Expected entry url");
    }
    const destination = {
        url: entry.url,
        key: entry.key,
        index: destinationIndex,
        sameDocument: entry.sameDocument,
        getState() {
            return entry.getState();
        },
    };
    let hashChange = false;
    const currentUrlInstance = getBaseURL(currentEntry?.url);
    const destinationUrlInstance = new URL(destination.url);
    const currentHash = currentUrlInstance.hash;
    const destinationHash = destinationUrlInstance.hash;
    // console.log({ currentHash, destinationHash });
    if (currentHash !== destinationHash) {
        const currentUrlInstanceWithoutHash = new URL(currentUrlInstance.toString());
        currentUrlInstanceWithoutHash.hash = "";
        const destinationUrlInstanceWithoutHash = new URL(destinationUrlInstance.toString());
        destinationUrlInstanceWithoutHash.hash = "";
        hashChange =
            currentUrlInstanceWithoutHash.toString() ===
                destinationUrlInstanceWithoutHash.toString();
        // console.log({ hashChange, currentUrlInstanceWithoutHash: currentUrlInstanceWithoutHash.toString(), before: destinationUrlInstanceWithoutHash.toString() })
    }
    let contextToCommit;
    const { resolve: resolveCommit, promise: waitForCommit } = defer();
    function commit() {
        ok(contextToCommit, "Expected contextToCommit");
        resolveCommit(transitionCommit(contextToCommit));
    }
    const abortController = new AbortController$1();
    const event = new NavigateEvent("navigate", {
        signal: abortController.signal,
        info: undefined,
        ...options,
        canIntercept: options?.[NavigationCanIntercept] ?? true,
        formData: options?.[NavigationFormData] ?? undefined,
        downloadRequest: options?.[NavigationDownloadRequest] ?? undefined,
        hashChange,
        navigationType: options?.navigationType ??
            (typeof navigationType === "string" ? navigationType : "replace"),
        userInitiated: options?.[NavigationUserInitiated] ?? false,
        destination,
    });
    const originalEvent = options?.[NavigationOriginalEvent];
    const preventDefault = transition[NavigationTransitionAbort].bind(transition);
    if (originalEvent) {
        const definedEvent = originalEvent;
        event.intercept = function originalEventIntercept(options) {
            definedEvent.preventDefault();
            return intercept(options);
        };
        event.preventDefault = function originalEventPreventDefault() {
            definedEvent.preventDefault();
            return preventDefault();
        };
    }
    else {
        event.intercept = intercept;
        event.preventDefault = preventDefault;
    }
    // Enforce that transitionWhile and intercept match
    event.transitionWhile = event.intercept;
    event.commit = commit;
    if (reportError) {
        event.reportError = reportError;
    }
    event.scroll = noop;
    if (originalEvent) {
        event.originalEvent = originalEvent;
    }
    const currentEntryChange = new NavigationCurrentEntryChangeEvent("currententrychange", {
        from: currentEntry,
        navigationType: event.navigationType,
    });
    let updatedEntries = [], removedEntries = [], addedEntries = [];
    const previousKeys = previousEntries.map(entry => entry.key);
    if (navigationType === Rollback) {
        const { entries } = options ?? { entries: undefined };
        if (!entries)
            throw new InvalidStateError("Expected entries to be provided for rollback");
        resolvedEntries = entries;
        resolvedEntries.forEach((entry) => known.add(entry));
        const keys = resolvedEntries.map(entry => entry.key);
        removedEntries = previousEntries.filter(entry => !keys.includes(entry.key));
        addedEntries = resolvedEntries.filter(entry => !previousKeys.includes(entry.key));
    }
    // Default next index is current entries length, aka
    // console.log({ navigationType, givenNavigationType, index: this.#currentIndex, resolvedNextIndex });
    else if (navigationType === "replace" ||
        navigationType === "traverse" ||
        navigationType === "reload") {
        resolvedEntries[destination.index] = entry;
        if (navigationType !== "traverse") {
            updatedEntries.push(entry);
        }
        if (navigationType === "replace") {
            resolvedEntries = resolvedEntries.slice(0, destination.index + 1);
        }
        const keys = resolvedEntries.map(entry => entry.key);
        removedEntries = previousEntries.filter(entry => !keys.includes(entry.key));
        if (previousKeys.includes(entry.id)) {
            addedEntries = [entry];
        }
    }
    else if (navigationType === "push") {
        let removed = false;
        // Trim forward, we have reset our stack
        if (resolvedEntries[destination.index]) {
            // const before = [...this.#entries];
            resolvedEntries = resolvedEntries.slice(0, destination.index);
            // console.log({ before, after: [...this.#entries]})
            removed = true;
        }
        resolvedEntries.push(entry);
        addedEntries = [entry];
        if (removed) {
            const keys = resolvedEntries.map(entry => entry.key);
            removedEntries = previousEntries.filter(entry => !keys.includes(entry.key));
        }
    }
    known.add(entry);
    let entriesChange = undefined;
    if (updatedEntries.length || addedEntries.length || removedEntries.length) {
        entriesChange = {
            updatedEntries,
            addedEntries,
            removedEntries
        };
    }
    contextToCommit = {
        entries: resolvedEntries,
        index: nextIndex,
        known,
        entriesChange
    };
    return {
        entries: resolvedEntries,
        known,
        index: nextIndex,
        currentEntryChange,
        destination,
        navigate: event,
        navigationType,
        waitForCommit,
        commit,
        abortController
    };
}

function createEvent(event) {
    if (typeof CustomEvent !== "undefined" && typeof event.type === "string") {
        if (event instanceof CustomEvent) {
            return event;
        }
        const { type, detail, ...rest } = event;
        const customEvent = new CustomEvent(type, {
            detail: detail ?? rest,
        });
        Object.assign(customEvent, rest);
        assertEvent(customEvent, event.type);
        return customEvent;
    }
    return event;
}

const NavigationSetOptions = Symbol.for("@virtualstate/navigation/setOptions");
const NavigationSetEntries = Symbol.for("@virtualstate/navigation/setEntries");
const NavigationSetCurrentIndex = Symbol.for("@virtualstate/navigation/setCurrentIndex");
const NavigationSetCurrentKey = Symbol.for("@virtualstate/navigation/setCurrentKey");
const NavigationGetState = Symbol.for("@virtualstate/navigation/getState");
const NavigationSetState = Symbol.for("@virtualstate/navigation/setState");
const NavigationDisposeState = Symbol.for("@virtualstate/navigation/disposeState");
function isNavigationNavigationType(value) {
    return (value === "reload" ||
        value === "push" ||
        value === "replace" ||
        value === "traverse");
}
class Navigation extends NavigationEventTarget {
    // Should be always 0 or 1
    #transitionInProgressCount = 0;
    // #activePromise?: Promise<void> = undefined;
    #entries = [];
    #known = new Set();
    #currentIndex = -1;
    #activeTransition;
    #knownTransitions = new WeakSet();
    #baseURL = "";
    #initialEntry = undefined;
    #options = undefined;
    get canGoBack() {
        return !!this.#entries[this.#currentIndex - 1];
    }
    get canGoForward() {
        return !!this.#entries[this.#currentIndex + 1];
    }
    get currentEntry() {
        if (this.#currentIndex === -1) {
            if (!this.#initialEntry) {
                this.#initialEntry = new NavigationHistoryEntry({
                    getState: this[NavigationGetState],
                    navigationType: "push",
                    index: -1,
                    sameDocument: false,
                    url: this.#baseURL.toString()
                });
            }
            return this.#initialEntry;
        }
        return this.#entries[this.#currentIndex];
    }
    get transition() {
        const transition = this.#activeTransition;
        // Never let an aborted transition leak, it doesn't need to be accessed any more
        return transition?.signal.aborted ? undefined : transition;
    }
    constructor(options = {}) {
        super();
        this[NavigationSetOptions](options);
    }
    [NavigationSetOptions](options) {
        this.#options = options;
        this.#baseURL = getBaseURL(options?.baseURL);
        this.#entries = [];
        if (options.entries) {
            this[NavigationSetEntries](options.entries);
        }
        if (options.currentKey) {
            this[NavigationSetCurrentKey](options.currentKey);
        }
        else if (typeof options.currentIndex === "number") {
            this[NavigationSetCurrentIndex](options.currentIndex);
        }
    }
    /**
     * Set the current entry key without any lifecycle eventing
     *
     * This would be more exact than providing an index
     * @param key
     */
    [NavigationSetCurrentKey](key) {
        const index = this.#entries.findIndex(entry => entry.key === key);
        // If the key can't be found, becomes a no-op
        if (index === -1)
            return;
        this.#currentIndex = index;
    }
    /**
     * Set the current entry index without any lifecycle eventing
     * @param index
     */
    [NavigationSetCurrentIndex](index) {
        if (index <= -1)
            return;
        if (index >= this.#entries.length)
            return;
        this.#currentIndex = index;
    }
    /**
     * Set the entries available without any lifecycle eventing
     * @param entries
     */
    [NavigationSetEntries](entries) {
        this.#entries = entries.map(({ key, url, navigationType, state, sameDocument }, index) => new NavigationHistoryEntry({
            getState: this[NavigationGetState],
            navigationType: isNavigationNavigationType(navigationType) ? navigationType : "push",
            sameDocument: sameDocument ?? true,
            index,
            url,
            key,
            state
        }));
        if (this.#currentIndex === -1 && this.#entries.length) {
            // Initialise, even if its not the one that was expected
            this.#currentIndex = 0;
        }
    }
    [NavigationGetState] = (entry) => {
        return this.#options?.getState?.(entry) ?? undefined;
    };
    [NavigationSetState] = (entry) => {
        return this.#options?.setState?.(entry);
    };
    [NavigationDisposeState] = (entry) => {
        return this.#options?.disposeState?.(entry);
    };
    back(options) {
        if (!this.canGoBack)
            throw new InvalidStateError("Cannot go back");
        const entry = this.#entries[this.#currentIndex - 1];
        return this.#pushEntry("traverse", this.#cloneNavigationHistoryEntry(entry, {
            ...options,
            navigationType: "traverse",
        }));
    }
    entries() {
        return [...this.#entries];
    }
    forward(options) {
        if (!this.canGoForward)
            throw new InvalidStateError();
        const entry = this.#entries[this.#currentIndex + 1];
        return this.#pushEntry("traverse", this.#cloneNavigationHistoryEntry(entry, {
            ...options,
            navigationType: "traverse",
        }));
    }
    /**
    /**
     * @deprecated use traverseTo
     */
    goTo(key, options) {
        return this.traverseTo(key, options);
    }
    traverseTo(key, options) {
        const found = this.#entries.find((entry) => entry.key === key);
        if (found) {
            return this.#pushEntry("traverse", this.#cloneNavigationHistoryEntry(found, {
                ...options,
                navigationType: "traverse",
            }));
        }
        throw new InvalidStateError();
    }
    #isSameDocument = (url) => {
        function isSameOrigins(a, b) {
            return a.origin === b.origin;
        }
        const currentEntryUrl = this.currentEntry?.url;
        if (!currentEntryUrl)
            return true;
        return isSameOrigins(new URL(currentEntryUrl), new URL(url));
    };
    navigate(url, options) {
        let baseURL = this.#baseURL;
        if (this.currentEntry?.url) {
            // This allows use to use relative
            baseURL = this.currentEntry?.url;
        }
        const nextUrl = new URL(url, baseURL).toString();
        let navigationType = "push";
        if (options?.history === "push" || options?.history === "replace") {
            navigationType = options?.history;
        }
        const entry = this.#createNavigationHistoryEntry({
            getState: this[NavigationGetState],
            url: nextUrl,
            ...options,
            sameDocument: this.#isSameDocument(nextUrl),
            navigationType,
        });
        return this.#pushEntry(navigationType, entry, undefined, options);
    }
    #cloneNavigationHistoryEntry = (entry, options) => {
        return this.#createNavigationHistoryEntry({
            ...entry,
            getState: this[NavigationGetState],
            index: entry?.index ?? undefined,
            state: options?.state ?? entry?.getState(),
            navigationType: entry?.[NavigationHistoryEntryNavigationType] ??
                (typeof options?.navigationType === "string"
                    ? options.navigationType
                    : "replace"),
            ...options,
            get [NavigationHistoryEntryKnownAs]() {
                return entry?.[NavigationHistoryEntryKnownAs];
            },
            get [EventTargetListeners$1]() {
                return entry?.[EventTargetListeners$1];
            },
        });
    };
    #createNavigationHistoryEntry = (options) => {
        const entry = new NavigationHistoryEntry({
            ...options,
            index: options.index ??
                (() => {
                    return this.#entries.indexOf(entry);
                }),
        });
        return entry;
    };
    #pushEntry = (navigationType, entry, transition, options) => {
        /* c8 ignore start */
        if (entry === this.currentEntry)
            throw new InvalidStateError();
        const existingPosition = this.#entries.findIndex((existing) => existing.id === entry.id);
        if (existingPosition > -1) {
            throw new InvalidStateError();
        }
        /* c8 ignore end */
        return this.#commitTransition(navigationType, entry, transition, options);
    };
    #commitTransition = (givenNavigationType, entry, transition, options) => {
        const nextTransition = transition ??
            new NavigationTransition({
                from: this.currentEntry,
                navigationType: typeof givenNavigationType === "string"
                    ? givenNavigationType
                    : "replace",
                rollback: (options) => {
                    return this.#rollback(nextTransition, options);
                },
                [NavigationTransitionNavigationType]: givenNavigationType,
                [NavigationTransitionInitialEntries]: [...this.#entries],
                [NavigationTransitionInitialIndex]: this.#currentIndex,
                [NavigationTransitionKnown]: [...this.#known],
                [NavigationTransitionEntry]: entry,
                [NavigationTransitionParentEventTarget]: this,
            });
        const { finished, committed } = nextTransition;
        const handler = () => {
            return this.#immediateTransition(givenNavigationType, entry, nextTransition, options);
        };
        this.#queueTransition(nextTransition);
        void handler().catch((error) => void 0);
        // let nextPromise;
        // if (!this.#transitionInProgressCount || !this.#activePromise) {
        //   nextPromise = handler().catch((error) => void error);
        // } else {
        //   nextPromise = this.#activePromise.then(handler);
        // }
        //
        // const promise = nextPromise
        //     .catch(error => void error)
        //     .then(() => {
        //       if (this.#activePromise === promise) {
        //         this.#activePromise = undefined;
        //       }
        //     })
        //
        // this.#activePromise = promise;
        return { committed, finished };
    };
    #queueTransition = (transition) => {
        // TODO consume errors that are not abort errors
        // transition.finished.catch(error => void error);
        this.#knownTransitions.add(transition);
    };
    #immediateTransition = (givenNavigationType, entry, transition, options) => {
        try {
            // This number can grow if navigation is
            // called during a transition
            //
            // ... I had used transitionInProgressCount as a
            // safeguard until I could see this flow firsthand
            this.#transitionInProgressCount += 1;
            return this.#transition(givenNavigationType, entry, transition, options);
        }
        finally {
            this.#transitionInProgressCount -= 1;
        }
    };
    #rollback = (rollbackTransition, options) => {
        const previousEntries = rollbackTransition[NavigationTransitionInitialEntries];
        const previousIndex = rollbackTransition[NavigationTransitionInitialIndex];
        const previousCurrent = previousEntries[previousIndex];
        // console.log("z");
        // console.log("Rollback!", { previousCurrent, previousEntries, previousIndex });
        const entry = previousCurrent
            ? this.#cloneNavigationHistoryEntry(previousCurrent, options)
            : undefined;
        const nextOptions = {
            ...options,
            index: previousIndex,
            known: new Set([...this.#known, ...previousEntries]),
            navigationType: entry?.[NavigationHistoryEntryNavigationType] ?? "replace",
            entries: previousEntries,
        };
        const resolvedNavigationType = entry ? Rollback : Unset;
        const resolvedEntry = entry ??
            this.#createNavigationHistoryEntry({
                getState: this[NavigationGetState],
                navigationType: "replace",
                index: nextOptions.index,
                sameDocument: true,
                ...options,
            });
        return this.#pushEntry(resolvedNavigationType, resolvedEntry, undefined, nextOptions);
    };
    #transition = (givenNavigationType, entry, transition, options) => {
        // console.log({ givenNavigationType, transition });
        let navigationType = givenNavigationType;
        const performance = getPerformance();
        if (performance &&
            entry.sameDocument &&
            typeof navigationType === "string") {
            performance?.mark?.(`same-document-navigation:${entry.id}`);
        }
        let currentEntryChangeEvent = false, committedCurrentEntryChange = false;
        const { currentEntry } = this;
        void this.#activeTransition?.finished?.catch((error) => error);
        void this.#activeTransition?.[NavigationTransitionFinishedDeferred]?.promise?.catch((error) => error);
        void this.#activeTransition?.[NavigationTransitionCommittedDeferred]?.promise?.catch((error) => error);
        this.#activeTransition?.[NavigationTransitionAbort]();
        this.#activeTransition = transition;
        const startEventPromise = transition.dispatchEvent({
            type: NavigationTransitionStart,
            transition,
            entry,
        });
        const syncCommit = ({ entries, index, known }) => {
            if (transition.signal.aborted)
                return;
            this.#entries = entries;
            if (known) {
                this.#known = new Set([...this.#known, ...known]);
            }
            this.#currentIndex = index;
            // Let's trigger external state here
            // because it is the absolute point of
            // committing to using an entry
            //
            // If the entry came from an external source
            // then internal to getState the external source will be pulled from
            // only if the entry doesn't hold the state in memory
            //
            // TLDR I believe this will be no issue doing here, even if we end up
            // calling an external setState multiple times, it is better than
            // loss of the state
            this[NavigationSetState](this.currentEntry);
        };
        const asyncCommit = async (commit) => {
            if (committedCurrentEntryChange) {
                return;
            }
            committedCurrentEntryChange = true;
            syncCommit(commit);
            const { entriesChange } = commit;
            const promises = [
                transition.dispatchEvent(createEvent({
                    type: NavigationTransitionCommit,
                    transition,
                    entry,
                }))
            ];
            if (entriesChange) {
                promises.push(this.dispatchEvent(createEvent({
                    type: "entrieschange",
                    ...entriesChange
                })));
            }
            await Promise.all(promises);
        };
        const unsetTransition = async () => {
            await startEventPromise;
            if (!(typeof options?.index === "number" && options.entries))
                throw new InvalidStateError();
            const previous = this.entries();
            const previousKeys = previous.map(entry => entry.key);
            const keys = options.entries.map(entry => entry.key);
            const removedEntries = previous.filter(entry => !keys.includes(entry.key));
            const addedEntries = options.entries.filter(entry => !previousKeys.includes(entry.key));
            await asyncCommit({
                entries: options.entries,
                index: options.index,
                known: options.known,
                entriesChange: (removedEntries.length || addedEntries.length) ? {
                    removedEntries,
                    addedEntries,
                    updatedEntries: []
                } : undefined
            });
            await this.dispatchEvent(createEvent({
                type: "currententrychange",
            }));
            currentEntryChangeEvent = true;
            return entry;
        };
        const completeTransition = () => {
            if (givenNavigationType === Unset) {
                return unsetTransition();
            }
            const transitionResult = createNavigationTransition({
                currentEntry,
                currentIndex: this.#currentIndex,
                options,
                transition,
                known: this.#known,
                commit: asyncCommit,
                reportError: transition[NavigationTransitionRejected]
            });
            const microtask = new Promise(queueMicrotask);
            let promises = [];
            const iterator = transitionSteps(transitionResult)[Symbol.iterator]();
            const iterable = {
                [Symbol.iterator]: () => ({ next: () => iterator.next() }),
            };
            async function syncTransition() {
                for (const promise of iterable) {
                    if (isPromise(promise)) {
                        promises.push(Promise.allSettled([
                            promise
                        ]).then(([result]) => result));
                    }
                    if (transition[NavigationTransitionCommitIsManual] ||
                        (currentEntryChangeEvent && transition[NavigationTransitionIsAsync])) {
                        return asyncTransition().then(syncTransition);
                    }
                    if (transition.signal.aborted) {
                        break;
                    }
                }
                if (promises.length) {
                    return asyncTransition();
                }
            }
            async function asyncTransition() {
                const captured = [...promises];
                if (captured.length) {
                    promises = [];
                    const results = await Promise.all(captured);
                    const rejected = results.filter(isPromiseRejectedResult);
                    if (rejected.length === 1) {
                        throw await Promise.reject(rejected[0]);
                    }
                    else if (rejected.length) {
                        throw new AggregateError(rejected, rejected[0].reason?.message);
                    }
                }
                else if (!transition[NavigationTransitionIsOngoing]) {
                    await microtask;
                }
            }
            // console.log("Returning", { entry });
            return syncTransition()
                .then(() => transition[NavigationTransitionIsOngoing] ? undefined : microtask)
                .then(() => entry);
        };
        const dispose = async () => this.#dispose();
        function* transitionSteps(transitionResult) {
            const microtask = new Promise(queueMicrotask);
            const { currentEntryChange, navigate, waitForCommit, commit, abortController } = transitionResult;
            const navigateAbort = abortController.abort.bind(abortController);
            transition.signal.addEventListener("abort", navigateAbort, {
                once: true,
            });
            if (typeof navigationType === "string" || navigationType === Rollback) {
                const promise = currentEntry?.dispatchEvent(createEvent({
                    type: "navigatefrom",
                    intercept: transition[NavigationIntercept],
                    /**
                     * @deprecated
                     */
                    transitionWhile: transition[NavigationIntercept],
                }));
                if (promise)
                    yield promise;
            }
            if (typeof navigationType === "string") {
                yield transition.dispatchEvent(navigate);
            }
            if (!transition[NavigationTransitionCommitIsManual]) {
                commit();
            }
            yield waitForCommit;
            if (entry.sameDocument) {
                yield transition.dispatchEvent(currentEntryChange);
            }
            currentEntryChangeEvent = true;
            if (typeof navigationType === "string") {
                yield entry.dispatchEvent(createEvent({
                    type: "navigateto",
                    intercept: transition[NavigationIntercept],
                    /**
                     * @deprecated
                     */
                    transitionWhile: transition[NavigationIntercept],
                }));
            }
            yield dispose();
            if (!transition[NavigationTransitionPromises].size) {
                yield microtask;
            }
            yield transition.dispatchEvent({
                type: NavigationTransitionStartDeadline,
                transition,
                entry,
            });
            yield transition[NavigationTransitionWait]();
            transition.signal.removeEventListener("abort", navigateAbort);
            yield transition[NavigationTransitionFinish]();
            if (typeof navigationType === "string") {
                yield transition.dispatchEvent(createEvent({
                    type: "finish",
                    intercept: transition[NavigationIntercept],
                    /**
                     * @deprecated
                     */
                    transitionWhile: transition[NavigationIntercept],
                }));
                yield transition.dispatchEvent(createEvent({
                    type: "navigatesuccess",
                    intercept: transition[NavigationIntercept],
                    /**
                     * @deprecated
                     */
                    transitionWhile: transition[NavigationIntercept],
                }));
            }
        }
        const maybeSyncTransition = () => {
            try {
                return completeTransition();
            }
            catch (error) {
                return Promise.reject(error);
            }
        };
        return Promise.allSettled([maybeSyncTransition()])
            .then(async ([detail]) => {
            if (detail.status === "rejected") {
                await transition.dispatchEvent({
                    type: NavigationTransitionError,
                    error: detail.reason,
                    transition,
                    entry,
                });
            }
            await dispose();
            await transition.dispatchEvent({
                type: NavigationTransitionFinally,
                transition,
                entry,
            });
            await transition[NavigationTransitionWait]();
            if (this.#activeTransition === transition) {
                this.#activeTransition = undefined;
            }
            if (entry.sameDocument && typeof navigationType === "string") {
                performance.mark(`same-document-navigation-finish:${entry.id}`);
                performance.measure(`same-document-navigation:${entry.url}`, `same-document-navigation:${entry.id}`, `same-document-navigation-finish:${entry.id}`);
            }
        })
            .then(() => entry);
    };
    #dispose = async () => {
        // console.log(JSON.stringify({ known: [...this.#known], entries: this.#entries }));
        for (const known of this.#known) {
            const index = this.#entries.findIndex((entry) => entry.key === known.key);
            if (index !== -1) {
                // Still in use
                continue;
            }
            // No index, no longer known
            this.#known.delete(known);
            const event = createEvent({
                type: "dispose",
                entry: known,
            });
            this[NavigationDisposeState](known);
            await known.dispatchEvent(event);
            await this.dispatchEvent(event);
        }
        // console.log(JSON.stringify({ pruned: [...this.#known] }));
    };
    reload(options) {
        const { currentEntry } = this;
        if (!currentEntry)
            throw new InvalidStateError();
        const entry = this.#cloneNavigationHistoryEntry(currentEntry, options);
        return this.#pushEntry("reload", entry, undefined, options);
    }
    updateCurrentEntry(options) {
        const { currentEntry } = this;
        if (!currentEntry) {
            throw new InvalidStateError("Expected current entry");
        }
        // Instant change
        currentEntry[NavigationHistoryEntrySetState](options.state);
        this[NavigationSetState](currentEntry);
        const currentEntryChange = new NavigationCurrentEntryChangeEvent("currententrychange", {
            from: currentEntry,
            navigationType: undefined,
        });
        const entriesChange = createEvent({
            type: "entrieschange",
            addedEntries: [],
            removedEntries: [],
            updatedEntries: [
                currentEntry
            ]
        });
        return Promise.all([
            this.dispatchEvent(currentEntryChange),
            this.dispatchEvent(entriesChange)
        ]);
    }
}
function getPerformance() {
    if (typeof performance !== "undefined") {
        return performance;
    }
    /* c8 ignore start */
    return {
        now() {
            return Date.now();
        },
        mark() { },
        measure() { },
    };
    // const { performance: nodePerformance } = await import("perf_hooks");
    // return nodePerformance;
    /* c8 ignore end */
}

let navigation$1;
function getNavigation() {
    if (globalNavigation) {
        return globalNavigation;
    }
    if (navigation$1) {
        return navigation$1;
    }
    return (navigation$1 = new Navigation());
}

let GLOBAL_SERIALIZER = JSON;
function stringify(value) {
    return GLOBAL_SERIALIZER.stringify(value);
}
function parse(value) {
    return GLOBAL_SERIALIZER.parse(value);
}

const AppLocationCheckChange = Symbol.for("@virtualstate/navigation/location/checkChange");
const AppLocationAwaitFinished = Symbol.for("@virtualstate/navigation/location/awaitFinished");
const AppLocationTransitionURL = Symbol.for("@virtualstate/navigation/location/transitionURL");
const AppLocationUrl = Symbol.for("@virtualstate/navigation/location/url");
const NAVIGATION_LOCATION_DEFAULT_URL = "https://html.spec.whatwg.org/";
/**
 * @experimental
 */
class NavigationLocation {
    #options;
    #navigation;
    constructor(options) {
        this.#options = options;
        this.#navigation = options.navigation;
        const reset = () => {
            this.#transitioningURL = undefined;
            this.#baseURL = undefined;
        };
        this.#navigation.addEventListener("navigate", () => {
            const transition = this.#navigation.transition;
            if (transition && isCommittedAvailable(transition)) {
                transition[NavigationTransitionCommittedDeferred].promise.then(reset, reset);
            }
            function isCommittedAvailable(transition) {
                return NavigationTransitionCommittedDeferred in transition;
            }
        });
        this.#navigation.addEventListener("currententrychange", reset);
    }
    #urls = new WeakMap();
    #transitioningURL;
    #baseURL;
    get [AppLocationUrl]() {
        if (this.#transitioningURL) {
            return this.#transitioningURL;
        }
        const { currentEntry } = this.#navigation;
        if (!currentEntry) {
            this.#baseURL = getBaseURL(this.#options.baseURL);
            return this.#baseURL;
        }
        const existing = this.#urls.get(currentEntry);
        if (existing)
            return existing;
        const next = new URL(currentEntry.url ?? NAVIGATION_LOCATION_DEFAULT_URL);
        this.#urls.set(currentEntry, next);
        return next;
    }
    get hash() {
        return this[AppLocationUrl].hash;
    }
    set hash(value) {
        this.#setUrlValue("hash", value);
    }
    get host() {
        return this[AppLocationUrl].host;
    }
    set host(value) {
        this.#setUrlValue("host", value);
    }
    get hostname() {
        return this[AppLocationUrl].hostname;
    }
    set hostname(value) {
        this.#setUrlValue("hostname", value);
    }
    get href() {
        return this[AppLocationUrl].href;
    }
    set href(value) {
        this.#setUrlValue("href", value);
    }
    get origin() {
        return this[AppLocationUrl].origin;
    }
    get pathname() {
        return this[AppLocationUrl].pathname;
    }
    set pathname(value) {
        this.#setUrlValue("pathname", value);
    }
    get port() {
        return this[AppLocationUrl].port;
    }
    set port(value) {
        this.#setUrlValue("port", value);
    }
    get protocol() {
        return this[AppLocationUrl].protocol;
    }
    set protocol(value) {
        this.#setUrlValue("protocol", value);
    }
    get search() {
        return this[AppLocationUrl].search;
    }
    set search(value) {
        this.#setUrlValue("search", value);
    }
    #setUrlValue = (key, value) => {
        const currentUrlString = this[AppLocationUrl].toString();
        let nextUrl;
        if (key === "href") {
            nextUrl = new URL(value, currentUrlString);
        }
        else {
            nextUrl = new URL(currentUrlString);
            nextUrl[key] = value;
        }
        const nextUrlString = nextUrl.toString();
        if (currentUrlString === nextUrlString) {
            return;
        }
        void this.#transitionURL(nextUrl, () => this.#navigation.navigate(nextUrlString));
    };
    replace(url) {
        return this.#transitionURL(url, (url) => this.#navigation.navigate(url.toString(), {
            history: "replace",
        }));
    }
    reload() {
        return this.#awaitFinished(this.#navigation.reload());
    }
    assign(url) {
        return this.#transitionURL(url, (url) => this.#navigation.navigate(url.toString()));
    }
    [AppLocationTransitionURL](url, fn) {
        return this.#transitionURL(url, fn);
    }
    #transitionURL = async (url, fn) => {
        const instance = (this.#transitioningURL =
            typeof url === "string"
                ? new URL(url, this[AppLocationUrl].toString())
                : url);
        try {
            await this.#awaitFinished(fn(instance));
        }
        finally {
            if (this.#transitioningURL === instance) {
                this.#transitioningURL = undefined;
            }
        }
    };
    [AppLocationAwaitFinished](result) {
        return this.#awaitFinished(result);
    }
    #awaitFinished = async (result) => {
        this.#baseURL = undefined;
        if (!result)
            return;
        const { committed, finished } = result;
        await Promise.all([
            committed || Promise.resolve(undefined),
            finished || Promise.resolve(undefined),
        ]);
    };
    #triggerIfUrlChanged = () => {
        const current = this[AppLocationUrl];
        const currentUrl = current.toString();
        const expectedUrl = this.#navigation.currentEntry?.url;
        if (currentUrl !== expectedUrl) {
            return this.#transitionURL(current, () => this.#navigation.navigate(currentUrl));
        }
    };
    /**
     * This is needed if you have changed searchParams using its mutating methods
     *
     * TODO replace get searchParams with an observable change to auto trigger this function
     */
    [AppLocationCheckChange]() {
        return this.#triggerIfUrlChanged();
    }
}

const State = Symbol.for("@virtualstate/navigation/history/state");
/**
 * @experimental
 */
class NavigationHistory extends NavigationLocation {
    #options;
    #navigation;
    constructor(options) {
        super(options);
        this.#options = options;
        this.#navigation = options.navigation;
    }
    get length() {
        return this.#navigation.entries().length;
    }
    scrollRestoration = "manual";
    get state() {
        const currentState = this.#navigation.currentEntry?.getState();
        if (typeof currentState === "string" || typeof currentState === "number" || typeof currentState === "boolean") {
            return currentState;
        }
        return this.#options[State] ?? undefined;
    }
    back() {
        const entries = this.#navigation.entries();
        const index = this.#navigation.currentEntry?.index ?? -1;
        const back = entries[index - 1];
        const url = back?.url;
        if (!url)
            throw new InvalidStateError("Cannot go back");
        return this[AppLocationTransitionURL](url, () => this.#navigation.back());
    }
    forward() {
        const entries = this.#navigation.entries();
        const index = this.#navigation.currentEntry?.index ?? -1;
        const forward = entries[index + 1];
        const url = forward?.url;
        if (!url)
            throw new InvalidStateError("Cannot go forward");
        return this[AppLocationTransitionURL](url, () => this.#navigation.forward());
    }
    go(delta) {
        if (typeof delta !== "number" || delta === 0 || isNaN(delta)) {
            return this[AppLocationAwaitFinished](this.#navigation.reload());
        }
        const entries = this.#navigation.entries();
        const { currentEntry } = this.#navigation;
        if (!currentEntry) {
            throw new Error(`Could not go ${delta}`);
        }
        const nextIndex = currentEntry.index + delta;
        const nextEntry = entries[nextIndex];
        if (!nextEntry) {
            throw new Error(`Could not go ${delta}`);
        }
        const nextEntryKey = nextEntry.key;
        return this[AppLocationAwaitFinished](this.#navigation.traverseTo(nextEntryKey));
    }
    replaceState(data, unused, url) {
        if (url) {
            return this[AppLocationTransitionURL](url, (url) => this.#navigation.navigate(url.toString(), {
                state: data,
                history: "replace",
            }));
        }
        else {
            return this.#navigation.updateCurrentEntry({
                state: data
            });
        }
    }
    pushState(data, unused, url) {
        if (url) {
            return this[AppLocationTransitionURL](url, (url) => this.#navigation.navigate(url.toString(), {
                state: data,
            }));
        }
        else {
            return this.#navigation.updateCurrentEntry({
                state: data,
            });
        }
    }
}

const globalWindow = typeof window === "undefined" ? undefined : window;

const globalSelf = typeof self === "undefined" ? undefined : self;

const NavigationKey = "__@virtualstate/navigation/key";
const NavigationMeta = "__@virtualstate/navigation/meta";
function getWindowHistory(givenWindow = globalWindow) {
    if (typeof givenWindow === "undefined")
        return undefined;
    return givenWindow.history;
}
function isStateHistoryMeta(state) {
    return like(state) && state[NavigationMeta] === true;
}
function isStateHistoryWithMeta(state) {
    return like(state) && isStateHistoryMeta(state[NavigationKey]);
}
function disposeHistoryState(entry, persist) {
    if (!persist)
        return;
    if (typeof sessionStorage === "undefined")
        return;
    sessionStorage.removeItem(entry.key);
}
function getEntries(navigation, limit = DEFAULT_POLYFILL_OPTIONS.limit) {
    let entries = navigation.entries();
    if (typeof limit === "number") {
        entries = entries.slice(-limit);
    }
    return entries.map(({ id, key, url, sameDocument }) => ({
        id,
        key,
        url,
        sameDocument
    }));
}
function getNavigationEntryMeta(navigation, entry, limit = DEFAULT_POLYFILL_OPTIONS.limit) {
    return {
        [NavigationMeta]: true,
        currentIndex: entry.index,
        key: entry.key,
        entries: getEntries(navigation, limit),
        state: entry.getState()
    };
}
function getNavigationEntryWithMeta(navigation, entry, limit = DEFAULT_POLYFILL_OPTIONS.limit) {
    return {
        [NavigationKey]: getNavigationEntryMeta(navigation, entry, limit)
    };
}
function setHistoryState(navigation, history, entry, persist, limit) {
    setStateInSession();
    function getSerializableState() {
        return getNavigationEntryWithMeta(navigation, entry, limit);
    }
    function setStateInSession() {
        if (typeof sessionStorage === "undefined")
            return;
        try {
            const raw = stringify(getSerializableState());
            sessionStorage.setItem(entry.key, raw);
        }
        catch { }
    }
}
function getHistoryState(history, entry) {
    return (getStateFromHistoryIfMatchingKey() ??
        getStateFromSession());
    function getStateFromHistoryDirectly() {
        try {
            return history.state;
        }
        catch {
            return undefined;
        }
    }
    function getBaseState() {
        const value = (history.originalState ??
            getStateFromHistoryDirectly());
        return like(value) ? value : undefined;
    }
    function getStateFromHistoryIfMatchingKey() {
        const state = getBaseState();
        if (!isStateHistoryWithMeta(state))
            return undefined;
        if (state[NavigationKey].key !== entry.key)
            return undefined;
        return state[NavigationKey].state;
    }
    function getStateFromSession() {
        if (typeof sessionStorage === "undefined")
            return undefined;
        try {
            const raw = sessionStorage.getItem(entry.key);
            if (!raw)
                return undefined;
            const state = parse(raw);
            if (!like(state))
                return undefined;
            if (!isStateHistoryWithMeta(state))
                return undefined;
            return state[NavigationKey].state;
        }
        catch {
            return undefined;
        }
    }
}
const DEFAULT_POLYFILL_OPTIONS = Object.freeze({
    persist: true,
    persistState: true,
    history: true,
    limit: 50,
    patch: true,
    interceptEvents: true
});
function isNavigationPolyfill(navigation) {
    return (like(navigation) &&
        typeof navigation[NavigationSetEntries] === "function" &&
        typeof navigation[NavigationSetCurrentKey] === "function");
}
function getNavigationOnlyPolyfill(givenNavigation) {
    // When using as a polyfill, we will auto initiate a single
    // entry, but not cause an event for it
    const entries = [
        {
            key: v4()
        }
    ];
    const navigation = givenNavigation ?? new Navigation({
        entries
    });
    const history = new NavigationHistory({
        navigation
    });
    return {
        navigation,
        history,
        apply() {
            if (isNavigationPolyfill(givenNavigation) && !navigation.entries().length) {
                givenNavigation[NavigationSetEntries](entries);
            }
        }
    };
}
function interceptWindowClicks(navigation, window) {
    function clickCallback(ev, aEl) {
        // console.log("<-- clickCallback -->");
        // TODO opt into queueMicrotask before process
        process();
        function process() {
            if (!isAppNavigation(ev))
                return;
            ok(ev);
            const target = aEl.getAttribute("target");
            // See target detailed here
            // https://github.com/WICG/navigation-api/blob/7b2d326b8eeb75680e568dadaa67e3bb54c9ca7f/README.md?plain=1#L1465
            if (target) {
                if (target === "_blank") {
                    // Continue with default, new window
                    return;
                }
                if (target !== window.name) {
                    // Continue with default, not current window
                    return;
                }
            }
            const options = {
                history: "auto",
                [NavigationUserInitiated]: true,
                [NavigationDownloadRequest]: aEl.download,
                [NavigationOriginalEvent]: ev,
            };
            navigation.navigate(aEl.href, options);
        }
    }
    function submitCallback(ev, form) {
        // console.log("<-- submitCallback -->");
        // TODO opt into queueMicrotask before process
        process();
        function process() {
            if (ev.defaultPrevented)
                return;
            const method = ev.submitter && 'formMethod' in ev.submitter && ev.submitter.formMethod
                ? ev.submitter.formMethod
                : form.method;
            // XXX: safe to ignore dialog method?
            if (method === 'dialog')
                return;
            const action = ev.submitter && 'formAction' in ev.submitter && ev.submitter.formAction
                ? ev.submitter.formAction
                : form.action;
            const target = form.getAttribute("target");
            // See target detailed here
            // https://github.com/WICG/navigation-api/blob/7b2d326b8eeb75680e568dadaa67e3bb54c9ca7f/README.md?plain=1#L1465
            if (target) {
                if (target === "_blank") {
                    // Continue with default, new window
                    return;
                }
                if (target !== window.name) {
                    // Continue with default, not current window
                    return;
                }
            }
            let formData;
            /* c8 ignore start */
            try {
                formData = new FormData(form);
            }
            catch {
                // For runtimes where we polyfilled the window & then evented it
                // ... for some reason
                formData = new FormData(undefined);
            }
            /* c8 ignore end */
            const params = method === 'get'
                ? new URLSearchParams([...formData].map(([k, v]) => v instanceof File ? [k, v.name] : [k, v]))
                : undefined;
            const navFormData = method === 'post'
                ? formData
                : undefined;
            // action is always a fully qualified url in browsers
            const url = new URL(action, navigation.currentEntry.url);
            if (params)
                url.search = params.toString();
            const unknownEvent = ev;
            ok(unknownEvent);
            const options = {
                history: "auto",
                [NavigationUserInitiated]: true,
                [NavigationFormData]: navFormData,
                [NavigationOriginalEvent]: unknownEvent,
            };
            navigation.navigate(url.href, options);
        }
    }
    // console.log("click event added")
    window.addEventListener("click", (ev) => {
        // console.log("click event", ev)
        if (ev.target?.ownerDocument === window.document) {
            const aEl = getAnchorFromEvent(ev); // XXX: not sure what <a> tags without href do
            if (like(aEl)) {
                clickCallback(ev, aEl);
            }
        }
    });
    window.addEventListener("submit", (ev) => {
        // console.log("submit event")
        if (ev.target?.ownerDocument === window.document) {
            const form = getFormFromEvent(ev);
            if (like(form)) {
                submitCallback(ev, form);
            }
        }
    });
}
function getAnchorFromEvent(event) {
    return matchesAncestor(getComposedPathTarget(event), "a[href]:not([data-navigation-ignore])");
}
function getFormFromEvent(event) {
    return matchesAncestor(getComposedPathTarget(event), "form:not([data-navigation-ignore])");
}
function getComposedPathTarget(event) {
    if (!event.composedPath) {
        return event.target;
    }
    const targets = event.composedPath();
    return targets[0] ?? event.target;
}
function patchGlobalScope(window, history, navigation) {
    patchGlobals();
    patchPopState();
    patchHistory();
    function patchWindow(window) {
        try {
            Object.defineProperty(window, "navigation", {
                value: navigation,
            });
        }
        catch (e) { }
        if (!window.history) {
            try {
                Object.defineProperty(window, "history", {
                    value: history,
                });
            }
            catch (e) { }
        }
    }
    function patchGlobals() {
        patchWindow(window);
        // If we don't have the global window, don't also patch global scope
        if (window !== globalWindow)
            return;
        if (globalSelf) {
            try {
                Object.defineProperty(globalSelf, "navigation", {
                    value: navigation,
                });
            }
            catch (e) { }
        }
        if (typeof globalThis !== "undefined") {
            try {
                Object.defineProperty(globalThis, "navigation", {
                    value: navigation,
                });
            }
            catch (e) { }
        }
    }
    function patchHistory() {
        if (history instanceof NavigationHistory) {
            // It's our polyfill, but probably externally passed to getPolyfill
            return;
        }
        const polyfillHistory = new NavigationHistory({
            navigation
        });
        const pushState = polyfillHistory.pushState.bind(polyfillHistory);
        const replaceState = polyfillHistory.replaceState.bind(polyfillHistory);
        const go = polyfillHistory.go.bind(polyfillHistory);
        const back = polyfillHistory.back.bind(polyfillHistory);
        const forward = polyfillHistory.forward.bind(polyfillHistory);
        const prototype = Object.getPrototypeOf(history);
        const descriptor = {
            pushState: {
                ...Object.getOwnPropertyDescriptor(prototype, "pushState"),
                value: pushState
            },
            replaceState: {
                ...Object.getOwnPropertyDescriptor(prototype, "replaceState"),
                value: replaceState
            },
            go: {
                ...Object.getOwnPropertyDescriptor(prototype, "go"),
                value: go
            },
            back: {
                ...Object.getOwnPropertyDescriptor(prototype, "back"),
                value: back
            },
            forward: {
                ...Object.getOwnPropertyDescriptor(prototype, "forward"),
                value: forward
            }
        };
        Object.defineProperties(prototype, descriptor);
        const stateDescriptor = Object.getOwnPropertyDescriptor(Object.getPrototypeOf(history), "state");
        Object.defineProperty(history, "state", {
            ...stateDescriptor,
            get() {
                // Derive history state only ever directly from navigation state
                //
                // Decouple from classic history.state
                //
                // If the original state is wanted, use history.originalState,
                // which is done on a best effort basis and may be out of alignment from
                // navigation.currentEntry.getState()
                //
                // This state will always be tied to the navigation, not the background
                // browser's history stack, which could be offset from the applications
                // expected state between moments of transition.
                //
                // The change of using navigation.currentEntry.getState()
                // in place of history.state is significant, it's shifting to a model where
                // there can be an entry only for one single operation and then replaced
                //
                // e.g.
                //
                // navigation.navigate("/1", { state: { key: 1 }});
                // navigation.navigate("/2", { state: { key: 2 }});
                // await navigation.transition?.finished;
                //
                // The above code, if ran, history.state might not keep up...
                //
                // ... In safari if we run replaceState too many times in 30 seconds
                // then we will get an exception. So, inherently we know we
                // cannot just freely make use of history.state as a deterministic like
                // reference.
                return polyfillHistory.state;
            }
        });
        Object.defineProperty(history, "originalState", {
            ...stateDescriptor
        });
    }
    function patchPopState() {
        if (!window.PopStateEvent)
            return;
        const popStateEventPrototype = window.PopStateEvent.prototype;
        if (!popStateEventPrototype)
            return;
        const descriptor = Object.getOwnPropertyDescriptor(popStateEventPrototype, "state");
        Object.defineProperty(popStateEventPrototype, "state", {
            ...descriptor,
            get() {
                const original = descriptor.get.call(this);
                if (!isStateHistoryWithMeta(original))
                    return original;
                return original[NavigationKey].state;
            }
        });
        Object.defineProperty(popStateEventPrototype, "originalState", {
            ...descriptor
        });
    }
}
function getCompletePolyfill(options = DEFAULT_POLYFILL_OPTIONS) {
    const { persist: PERSIST_ENTRIES, persistState: PERSIST_ENTRIES_STATE, history: givenHistory, limit: patchLimit, patch: PATCH_HISTORY, interceptEvents: INTERCEPT_EVENTS, window: givenWindow = globalWindow, navigation: givenNavigation } = {
        // These are super default options, if the object de
        ...DEFAULT_POLYFILL_OPTIONS,
        ...options
    };
    // console.log({
    //   ...DEFAULT_POLYFILL_OPTIONS,
    //   ...options
    // })
    const IS_PERSIST = PERSIST_ENTRIES || PERSIST_ENTRIES_STATE;
    const window = givenWindow ?? globalWindow;
    const history = options.history && typeof options.history !== "boolean" ?
        options.history :
        getWindowHistory(window);
    if (!history) {
        return getNavigationOnlyPolyfill();
    }
    // console.log("POLYFILL LOADING");
    ok(window, "window required when using polyfill with history, this shouldn't be seen");
    // Use baseHistory so that we don't initialise entries we didn't intend to
    // if we used a polyfill history
    const historyInitialState = history?.state;
    let initialMeta = {
        currentIndex: -1,
        entries: [],
        key: ""};
    if (isStateHistoryWithMeta(historyInitialState)) {
        initialMeta = historyInitialState[NavigationKey];
    }
    let initialEntries = initialMeta.entries;
    const HISTORY_INTEGRATION = !!((givenWindow || givenHistory) && history);
    if (!initialEntries.length) {
        let url = undefined;
        if (window.location?.href) {
            url = window.location.href;
        }
        let state = undefined;
        if (!isStateHistoryWithMeta(historyInitialState) && !isStateHistoryMeta(historyInitialState)) {
            // console.log("Using state history direct", historyInitialState, history.state);
            state = historyInitialState;
        }
        const key = v4();
        initialEntries = [
            {
                key,
                state,
                url
            }
        ];
        initialMeta.key = key;
        initialMeta.currentIndex = 0;
    }
    // console.log("Initial Entries", initialEntries)
    const navigationOptions = {
        entries: initialEntries,
        currentIndex: initialMeta?.currentIndex,
        currentKey: initialMeta?.key,
        getState(entry) {
            if (!HISTORY_INTEGRATION)
                return;
            return getHistoryState(history, entry);
        },
        setState(entry) {
            // console.log({
            //   setState: entry.getState(),
            //   entry
            // })
            if (!HISTORY_INTEGRATION)
                return;
            if (!entry.sameDocument)
                return;
            setHistoryState(navigation, history, entry, IS_PERSIST, patchLimit);
        },
        disposeState(entry) {
            if (!HISTORY_INTEGRATION)
                return;
            disposeHistoryState(entry, IS_PERSIST);
        }
    };
    const navigation = givenNavigation ?? new Navigation(navigationOptions);
    const pushState = history?.pushState.bind(history);
    const replaceState = history?.replaceState.bind(history);
    const historyGo = history?.go.bind(history);
    // const back = history?.back.bind(history);
    // const forward = history?.forward.bind(history);
    // const origin = typeof location === "undefined" ? "https://example.com" : location.origin;
    return {
        navigation,
        history,
        apply() {
            // console.log("APPLYING POLYFILL TO NAVIGATION");
            if (isNavigationPolyfill(navigation)) {
                // Initialise navigation options
                navigation[NavigationSetOptions](navigationOptions);
            }
            if (HISTORY_INTEGRATION) {
                const ignorePopState = new Set();
                const ignoreCurrentEntryChange = new Set();
                navigation.addEventListener("navigate", event => {
                    if (event.destination.sameDocument) {
                        return;
                    }
                    // If the destination is not the same document, we are navigating away
                    event.intercept({
                        // Set commit after transition... and never commit!
                        commit: "after-transition",
                        async handler() {
                            // Let other tasks do something and abort if needed
                            queueMicrotask(() => {
                                if (event.signal.aborted)
                                    return;
                                submit();
                            });
                        }
                    });
                    function submit() {
                        if (like(event.originalEvent)) {
                            const anchor = getAnchorFromEvent(event.originalEvent);
                            if (anchor) {
                                return submitAnchor(anchor);
                            }
                            else {
                                const form = getFormFromEvent(event.originalEvent);
                                if (form) {
                                    return submitForm(form);
                                }
                            }
                        }
                        // Assumption that navigation event means to navigate...
                        location.href = event.destination.url;
                    }
                    function submitAnchor(element) {
                        const cloned = element.cloneNode();
                        cloned.setAttribute("data-navigation-ignore", "1");
                        cloned.click();
                    }
                    function submitForm(element) {
                        const cloned = element.cloneNode();
                        cloned.setAttribute("data-navigation-ignore", "1");
                        cloned.submit();
                    }
                });
                navigation.addEventListener("currententrychange", ({ navigationType, from }) => {
                    // console.log("<-- currententrychange event listener -->");
                    const { currentEntry } = navigation;
                    if (!currentEntry)
                        return;
                    const { key, url } = currentEntry;
                    if (ignoreCurrentEntryChange.delete(key) || !currentEntry?.sameDocument)
                        return;
                    const historyState = getNavigationEntryWithMeta(navigation, currentEntry, patchLimit);
                    // console.log("currentEntry change", historyState);
                    switch (navigationType || "replace") {
                        case "push":
                            return pushState(historyState, "", url);
                        case "replace":
                            return replaceState(historyState, "", url);
                        case "traverse":
                            const delta = currentEntry.index - from.index;
                            ignorePopState.add(key);
                            return historyGo(delta);
                        // TODO
                    }
                });
                window.addEventListener("popstate", (event) => {
                    // console.log("<-- popstate event listener -->");
                    const { state, originalState } = event;
                    const foundState = originalState ?? state;
                    if (!isStateHistoryWithMeta(foundState))
                        return;
                    const { [NavigationKey]: { key } } = foundState;
                    if (ignorePopState.delete(key))
                        return;
                    ignoreCurrentEntryChange.add(key);
                    let committed;
                    try {
                        committed = navigation.traverseTo(key).committed;
                    }
                    catch (error) {
                        if (error instanceof InvalidStateError && !PERSIST_ENTRIES) {
                            // ignore the error
                            return;
                        }
                        throw error;
                    }
                    if (PERSIST_ENTRIES || PERSIST_ENTRIES_STATE) {
                        committed
                            .then(entry => {
                            const historyState = getNavigationEntryWithMeta(navigation, entry, patchLimit);
                            replaceState(historyState, "", entry.url);
                        })
                            // Noop catch
                            .catch(() => { });
                    }
                });
                // window.addEventListener("hashchange", (ev) => {
                //   // TODO
                // })
            }
            if (INTERCEPT_EVENTS) {
                interceptWindowClicks(navigation, window);
            }
            if (PATCH_HISTORY) {
                patchGlobalScope(window, history, navigation);
            }
            if (!history.state) {
                // Initialise history state if not available
                const historyState = getNavigationEntryWithMeta(navigation, navigation.currentEntry, patchLimit);
                replaceState(historyState, "", navigation.currentEntry.url);
            }
        }
    };
}
function isAppNavigation(evt) {
    return evt.button === 0 &&
        !evt.defaultPrevented &&
        !evt.metaKey &&
        !evt.altKey &&
        !evt.ctrlKey &&
        !evt.shiftKey;
}
/** Checks if this element or any of its parents matches a given `selector` */
function matchesAncestor(givenElement, selector) {
    let element = getDefaultElement();
    // console.log({ element })
    while (element) {
        if (element.matches(selector)) {
            ok(element);
            return element;
        }
        element = element.parentElement ?? element.getRootNode()?.host;
    }
    return undefined;
    function getDefaultElement() {
        if (!givenElement)
            return undefined;
        if (givenElement.matches instanceof Function)
            return givenElement;
        return givenElement.parentElement;
    }
}

function applyPolyfill(options = DEFAULT_POLYFILL_OPTIONS) {
    const { apply, navigation } = getCompletePolyfill(options);
    apply();
    return navigation;
}
function shouldApplyPolyfill(navigation = getNavigation()) {
    const globalThat = globalThis;
    return (navigation !== globalNavigation &&
        !Object.hasOwn(globalThat, 'navigation') &&
        typeof window !== "undefined");
}

const navigation = getNavigation();
if (shouldApplyPolyfill(navigation)) {
    try {
        applyPolyfill({
            navigation
        });
    }
    catch (error) {
        console.error("Failed to apply polyfill");
        console.error(error);
    }
}

var R=class{type=3;name="";prefix="";value="";suffix="";modifier=3;constructor(t,r,n,o,c,l){this.type=t,this.name=r,this.prefix=n,this.value=o,this.suffix=c,this.modifier=l;}hasCustomName(){return this.name!==""&&typeof this.name!="number"}},be=/[$_\p{ID_Start}]/u,Pe=/[$_\u200C\u200D\p{ID_Continue}]/u,M=".*";function Re(e,t){return (/^[\x00-\x7F]*$/).test(e)}function v(e,t=false){let r=[],n=0;for(;n<e.length;){let o=e[n],c=function(l){if(!t)throw new TypeError(l);r.push({type:"INVALID_CHAR",index:n,value:e[n++]});};if(o==="*"){r.push({type:"ASTERISK",index:n,value:e[n++]});continue}if(o==="+"||o==="?"){r.push({type:"OTHER_MODIFIER",index:n,value:e[n++]});continue}if(o==="\\"){r.push({type:"ESCAPED_CHAR",index:n++,value:e[n++]});continue}if(o==="{"){r.push({type:"OPEN",index:n,value:e[n++]});continue}if(o==="}"){r.push({type:"CLOSE",index:n,value:e[n++]});continue}if(o===":"){let l="",s=n+1;for(;s<e.length;){let i=e.substr(s,1);if(s===n+1&&be.test(i)||s!==n+1&&Pe.test(i)){l+=e[s++];continue}break}if(!l){c(`Missing parameter name at ${n}`);continue}r.push({type:"NAME",index:n,value:l}),n=s;continue}if(o==="("){let l=1,s="",i=n+1,a=false;if(e[i]==="?"){c(`Pattern cannot start with "?" at ${i}`);continue}for(;i<e.length;){if(!Re(e[i])){c(`Invalid character '${e[i]}' at ${i}.`),a=true;break}if(e[i]==="\\"){s+=e[i++]+e[i++];continue}if(e[i]===")"){if(l--,l===0){i++;break}}else if(e[i]==="("&&(l++,e[i+1]!=="?")){c(`Capturing groups are not allowed at ${i}`),a=true;break}s+=e[i++];}if(a)continue;if(l){c(`Unbalanced pattern at ${n}`);continue}if(!s){c(`Missing pattern at ${n}`);continue}r.push({type:"REGEX",index:n,value:s}),n=i;continue}r.push({type:"CHAR",index:n,value:e[n++]});}return r.push({type:"END",index:n,value:""}),r}function D(e,t={}){let r=v(e);t.delimiter??="/#?",t.prefixes??="./";let n=`[^${S(t.delimiter)}]+?`,o=[],c=0,l=0,i=new Set,a=h=>{if(l<r.length&&r[l].type===h)return r[l++].value},f=()=>a("OTHER_MODIFIER")??a("ASTERISK"),d=h=>{let u=a(h);if(u!==void 0)return u;let{type:p,index:A}=r[l];throw new TypeError(`Unexpected ${p} at ${A}, expected ${h}`)},T=()=>{let h="",u;for(;u=a("CHAR")??a("ESCAPED_CHAR");)h+=u;return h},Se=h=>h,L=t.encodePart||Se,I="",U=h=>{I+=h;},$=()=>{I.length&&(o.push(new R(3,"","",L(I),"",3)),I="");},V=(h,u,p,A,Y)=>{let g=3;switch(Y){case "?":g=1;break;case "*":g=0;break;case "+":g=2;break}if(!u&&!p&&g===3){U(h);return}if($(),!u&&!p){if(!h)return;o.push(new R(3,"","",L(h),"",g));return}let m;p?p==="*"?m=M:m=p:m=n;let O=2;m===n?(O=1,m=""):m===M&&(O=0,m="");let P;if(u?P=u:p&&(P=c++),i.has(P))throw new TypeError(`Duplicate name '${P}'.`);i.add(P),o.push(new R(O,P,L(h),m,L(A),g));};for(;l<r.length;){let h=a("CHAR"),u=a("NAME"),p=a("REGEX");if(!u&&!p&&(p=a("ASTERISK")),u||p){let g=h??"";t.prefixes.indexOf(g)===-1&&(U(g),g=""),$();let m=f();V(g,u,p,"",m);continue}let A=h??a("ESCAPED_CHAR");if(A){U(A);continue}if(a("OPEN")){let g=T(),m=a("NAME"),O=a("REGEX");!m&&!O&&(O=a("ASTERISK"));let P=T();d("CLOSE");let xe=f();V(g,m,O,P,xe);continue}$(),d("END");}return o}function S(e){return e.replace(/([.+*?^${}()[\]|/\\])/g,"\\$1")}function X(e){return e&&e.ignoreCase?"ui":"u"}function Z(e,t,r){return F(D(e,r),t,r)}function k(e){switch(e){case 0:return "*";case 1:return "?";case 2:return "+";case 3:return ""}}function F(e,t,r={}){r.delimiter??="/#?",r.prefixes??="./",r.sensitive??=false,r.strict??=false,r.end??=true,r.start??=true,r.endsWith="";let n=r.start?"^":"";for(let s of e){if(s.type===3){s.modifier===3?n+=S(s.value):n+=`(?:${S(s.value)})${k(s.modifier)}`;continue}t&&t.push(s.name);let i=`[^${S(r.delimiter)}]+?`,a=s.value;if(s.type===1?a=i:s.type===0&&(a=M),!s.prefix.length&&!s.suffix.length){s.modifier===3||s.modifier===1?n+=`(${a})${k(s.modifier)}`:n+=`((?:${a})${k(s.modifier)})`;continue}if(s.modifier===3||s.modifier===1){n+=`(?:${S(s.prefix)}(${a})${S(s.suffix)})`,n+=k(s.modifier);continue}n+=`(?:${S(s.prefix)}`,n+=`((?:${a})(?:`,n+=S(s.suffix),n+=S(s.prefix),n+=`(?:${a}))*)${S(s.suffix)})`,s.modifier===0&&(n+="?");}let o=`[${S(r.endsWith)}]|$`,c=`[${S(r.delimiter)}]`;if(r.end)return r.strict||(n+=`${c}?`),r.endsWith.length?n+=`(?=${o})`:n+="$",new RegExp(n,X(r));r.strict||(n+=`(?:${c}(?=${o}))?`);let l=false;if(e.length){let s=e[e.length-1];s.type===3&&s.modifier===3&&(l=r.delimiter.indexOf(s)>-1);}return l||(n+=`(?=${c}|${o})`),new RegExp(n,X(r))}var x={delimiter:"",prefixes:"",sensitive:true,strict:true},B={delimiter:".",prefixes:"",sensitive:true,strict:true},q={delimiter:"/",prefixes:"/",sensitive:true,strict:true};function J(e,t){return e.length?e[0]==="/"?true:!t||e.length<2?false:(e[0]=="\\"||e[0]=="{")&&e[1]=="/":false}function Q(e,t){return e.startsWith(t)?e.substring(t.length,e.length):e}function Ee(e,t){return e.endsWith(t)?e.substr(0,e.length-t.length):e}function W(e){return !e||e.length<2?false:e[0]==="["||(e[0]==="\\"||e[0]==="{")&&e[1]==="["}var ee=["ftp","file","http","https","ws","wss"];function N(e){if(!e)return  true;for(let t of ee)if(e.test(t))return  true;return  false}function te(e,t){if(e=Q(e,"#"),t||e==="")return e;let r=new URL("https://example.com");return r.hash=e,r.hash?r.hash.substring(1,r.hash.length):""}function re(e,t){if(e=Q(e,"?"),t||e==="")return e;let r=new URL("https://example.com");return r.search=e,r.search?r.search.substring(1,r.search.length):""}function ne(e,t){return t||e===""?e:W(e)?j(e):z(e)}function se(e,t){if(t||e==="")return e;let r=new URL("https://example.com");return r.password=e,r.password}function ie(e,t){if(t||e==="")return e;let r=new URL("https://example.com");return r.username=e,r.username}function ae(e,t,r){if(r||e==="")return e;if(t&&!ee.includes(t))return new URL(`${t}:${e}`).pathname;let n=e[0]=="/";return e=new URL(n?e:"/-"+e,"https://example.com").pathname,n||(e=e.substring(2,e.length)),e}function oe(e,t,r){return _(t)===e&&(e=""),r||e===""?e:K(e)}function ce(e,t){return e=Ee(e,":"),t||e===""?e:y(e)}function _(e){switch(e){case "ws":case "http":return "80";case "wws":case "https":return "443";case "ftp":return "21";default:return ""}}function y(e){if(e==="")return e;if(/^[-+.A-Za-z0-9]*$/.test(e))return e.toLowerCase();throw new TypeError(`Invalid protocol '${e}'.`)}function le(e){if(e==="")return e;let t=new URL("https://example.com");return t.username=e,t.username}function fe(e){if(e==="")return e;let t=new URL("https://example.com");return t.password=e,t.password}function z(e){if(e==="")return e;if(/[\t\n\r #%/:<>?@[\]^\\|]/g.test(e))throw new TypeError(`Invalid hostname '${e}'`);let t=new URL("https://example.com");return t.hostname=e,t.hostname}function j(e){if(e==="")return e;if(/[^0-9a-fA-F[\]:]/g.test(e))throw new TypeError(`Invalid IPv6 hostname '${e}'`);return e.toLowerCase()}function K(e){if(e===""||/^[0-9]*$/.test(e)&&parseInt(e)<=65535)return e;throw new TypeError(`Invalid port '${e}'.`)}function he(e){if(e==="")return e;let t=new URL("https://example.com");return t.pathname=e[0]!=="/"?"/-"+e:e,e[0]!=="/"?t.pathname.substring(2,t.pathname.length):t.pathname}function ue(e){return e===""?e:new URL(`data:${e}`).pathname}function de(e){if(e==="")return e;let t=new URL("https://example.com");return t.search=e,t.search.substring(1,t.search.length)}function pe(e){if(e==="")return e;let t=new URL("https://example.com");return t.hash=e,t.hash.substring(1,t.hash.length)}var H=class{#i;#n=[];#t={};#e=0;#s=1;#l=0;#o=0;#d=0;#p=0;#g=false;constructor(t){this.#i=t;}get result(){return this.#t}parse(){for(this.#n=v(this.#i,true);this.#e<this.#n.length;this.#e+=this.#s){if(this.#s=1,this.#n[this.#e].type==="END"){if(this.#o===0){this.#b(),this.#f()?this.#r(9,1):this.#h()?this.#r(8,1):this.#r(7,0);continue}else if(this.#o===2){this.#u(5);continue}this.#r(10,0);break}if(this.#d>0)if(this.#A())this.#d-=1;else continue;if(this.#T()){this.#d+=1;continue}switch(this.#o){case 0:this.#P()&&this.#u(1);break;case 1:if(this.#P()){this.#C();let t=7,r=1;this.#E()?(t=2,r=3):this.#g&&(t=2),this.#r(t,r);}break;case 2:this.#S()?this.#u(3):(this.#x()||this.#h()||this.#f())&&this.#u(5);break;case 3:this.#O()?this.#r(4,1):this.#S()&&this.#r(5,1);break;case 4:this.#S()&&this.#r(5,1);break;case 5:this.#y()?this.#p+=1:this.#w()&&(this.#p-=1),this.#k()&&!this.#p?this.#r(6,1):this.#x()?this.#r(7,0):this.#h()?this.#r(8,1):this.#f()&&this.#r(9,1);break;case 6:this.#x()?this.#r(7,0):this.#h()?this.#r(8,1):this.#f()&&this.#r(9,1);break;case 7:this.#h()?this.#r(8,1):this.#f()&&this.#r(9,1);break;case 8:this.#f()&&this.#r(9,1);break;}}this.#t.hostname!==void 0&&this.#t.port===void 0&&(this.#t.port="");}#r(t,r){switch(this.#o){case 0:break;case 1:this.#t.protocol=this.#c();break;case 2:break;case 3:this.#t.username=this.#c();break;case 4:this.#t.password=this.#c();break;case 5:this.#t.hostname=this.#c();break;case 6:this.#t.port=this.#c();break;case 7:this.#t.pathname=this.#c();break;case 8:this.#t.search=this.#c();break;case 9:this.#t.hash=this.#c();break;}this.#o!==0&&t!==10&&([1,2,3,4].includes(this.#o)&&[6,7,8,9].includes(t)&&(this.#t.hostname??=""),[1,2,3,4,5,6].includes(this.#o)&&[8,9].includes(t)&&(this.#t.pathname??=this.#g?"/":""),[1,2,3,4,5,6,7].includes(this.#o)&&t===9&&(this.#t.search??="")),this.#R(t,r);}#R(t,r){this.#o=t,this.#l=this.#e+r,this.#e+=r,this.#s=0;}#b(){this.#e=this.#l,this.#s=0;}#u(t){this.#b(),this.#o=t;}#m(t){return t<0&&(t=this.#n.length-t),t<this.#n.length?this.#n[t]:this.#n[this.#n.length-1]}#a(t,r){let n=this.#m(t);return n.value===r&&(n.type==="CHAR"||n.type==="ESCAPED_CHAR"||n.type==="INVALID_CHAR")}#P(){return this.#a(this.#e,":")}#E(){return this.#a(this.#e+1,"/")&&this.#a(this.#e+2,"/")}#S(){return this.#a(this.#e,"@")}#O(){return this.#a(this.#e,":")}#k(){return this.#a(this.#e,":")}#x(){return this.#a(this.#e,"/")}#h(){if(this.#a(this.#e,"?"))return  true;if(this.#n[this.#e].value!=="?")return  false;let t=this.#m(this.#e-1);return t.type!=="NAME"&&t.type!=="REGEX"&&t.type!=="CLOSE"&&t.type!=="ASTERISK"}#f(){return this.#a(this.#e,"#")}#T(){return this.#n[this.#e].type=="OPEN"}#A(){return this.#n[this.#e].type=="CLOSE"}#y(){return this.#a(this.#e,"[")}#w(){return this.#a(this.#e,"]")}#c(){let t=this.#n[this.#e],r=this.#m(this.#l).index;return this.#i.substring(r,t.index)}#C(){let t={};Object.assign(t,x),t.encodePart=y;let r=Z(this.#c(),void 0,t);this.#g=N(r);}};var G=["protocol","username","password","hostname","port","pathname","search","hash"],E="*";function ge(e,t){if(typeof e!="string")throw new TypeError("parameter 1 is not of type 'string'.");let r=new URL(e,t);return {protocol:r.protocol.substring(0,r.protocol.length-1),username:r.username,password:r.password,hostname:r.hostname,port:r.port,pathname:r.pathname,search:r.search!==""?r.search.substring(1,r.search.length):void 0,hash:r.hash!==""?r.hash.substring(1,r.hash.length):void 0}}function b(e,t){return t?C(e):e}function w(e,t,r){let n;if(typeof t.baseURL=="string")try{n=new URL(t.baseURL),t.protocol===void 0&&(e.protocol=b(n.protocol.substring(0,n.protocol.length-1),r)),!r&&t.protocol===void 0&&t.hostname===void 0&&t.port===void 0&&t.username===void 0&&(e.username=b(n.username,r)),!r&&t.protocol===void 0&&t.hostname===void 0&&t.port===void 0&&t.username===void 0&&t.password===void 0&&(e.password=b(n.password,r)),t.protocol===void 0&&t.hostname===void 0&&(e.hostname=b(n.hostname,r)),t.protocol===void 0&&t.hostname===void 0&&t.port===void 0&&(e.port=b(n.port,r)),t.protocol===void 0&&t.hostname===void 0&&t.port===void 0&&t.pathname===void 0&&(e.pathname=b(n.pathname,r)),t.protocol===void 0&&t.hostname===void 0&&t.port===void 0&&t.pathname===void 0&&t.search===void 0&&(e.search=b(n.search.substring(1,n.search.length),r)),t.protocol===void 0&&t.hostname===void 0&&t.port===void 0&&t.pathname===void 0&&t.search===void 0&&t.hash===void 0&&(e.hash=b(n.hash.substring(1,n.hash.length),r));}catch{throw new TypeError(`invalid baseURL '${t.baseURL}'.`)}if(typeof t.protocol=="string"&&(e.protocol=ce(t.protocol,r)),typeof t.username=="string"&&(e.username=ie(t.username,r)),typeof t.password=="string"&&(e.password=se(t.password,r)),typeof t.hostname=="string"&&(e.hostname=ne(t.hostname,r)),typeof t.port=="string"&&(e.port=oe(t.port,e.protocol,r)),typeof t.pathname=="string"){if(e.pathname=t.pathname,n&&!J(e.pathname,r)){let o=n.pathname.lastIndexOf("/");o>=0&&(e.pathname=b(n.pathname.substring(0,o+1),r)+e.pathname);}e.pathname=ae(e.pathname,e.protocol,r);}return typeof t.search=="string"&&(e.search=re(t.search,r)),typeof t.hash=="string"&&(e.hash=te(t.hash,r)),e}function C(e){return e.replace(/([+*?:{}()\\])/g,"\\$1")}function Oe(e){return e.replace(/([.+*?^${}()[\]|/\\])/g,"\\$1")}function ke(e,t){t.delimiter??="/#?",t.prefixes??="./",t.sensitive??=false,t.strict??=false,t.end??=true,t.start??=true,t.endsWith="";let r=".*",n=`[^${Oe(t.delimiter)}]+?`,o=/[$_\u200C\u200D\p{ID_Continue}]/u,c="";for(let l=0;l<e.length;++l){let s=e[l];if(s.type===3){if(s.modifier===3){c+=C(s.value);continue}c+=`{${C(s.value)}}${k(s.modifier)}`;continue}let i=s.hasCustomName(),a=!!s.suffix.length||!!s.prefix.length&&(s.prefix.length!==1||!t.prefixes.includes(s.prefix)),f=l>0?e[l-1]:null,d=l<e.length-1?e[l+1]:null;if(!a&&i&&s.type===1&&s.modifier===3&&d&&!d.prefix.length&&!d.suffix.length)if(d.type===3){let T=d.value.length>0?d.value[0]:"";a=o.test(T);}else a=!d.hasCustomName();if(!a&&!s.prefix.length&&f&&f.type===3){let T=f.value[f.value.length-1];a=t.prefixes.includes(T);}a&&(c+="{"),c+=C(s.prefix),i&&(c+=`:${s.name}`),s.type===2?c+=`(${s.value})`:s.type===1?i||(c+=`(${n})`):s.type===0&&(!i&&(!f||f.type===3||f.modifier!==3||a||s.prefix!=="")?c+="*":c+=`(${r})`),s.type===1&&i&&s.suffix.length&&o.test(s.suffix[0])&&(c+="\\"),c+=C(s.suffix),a&&(c+="}"),s.modifier!==3&&(c+=k(s.modifier));}return c}var me=class{#i;#n={};#t={};#e={};#s={};#l=false;constructor(t={},r,n){try{let o;if(typeof r=="string"?o=r:n=r,typeof t=="string"){let i=new H(t);if(i.parse(),t=i.result,o===void 0&&typeof t.protocol!="string")throw new TypeError("A base URL must be provided for a relative constructor string.");t.baseURL=o;}else {if(!t||typeof t!="object")throw new TypeError("parameter 1 is not of type 'string' and cannot convert to dictionary.");if(o)throw new TypeError("parameter 1 is not of type 'string'.")}typeof n>"u"&&(n={ignoreCase:!1});let c={ignoreCase:n.ignoreCase===!0},l={pathname:E,protocol:E,username:E,password:E,hostname:E,port:E,search:E,hash:E};this.#i=w(l,t,!0),_(this.#i.protocol)===this.#i.port&&(this.#i.port="");let s;for(s of G){if(!(s in this.#i))continue;let i={},a=this.#i[s];switch(this.#t[s]=[],s){case "protocol":Object.assign(i,x),i.encodePart=y;break;case "username":Object.assign(i,x),i.encodePart=le;break;case "password":Object.assign(i,x),i.encodePart=fe;break;case "hostname":Object.assign(i,B),W(a)?i.encodePart=j:i.encodePart=z;break;case "port":Object.assign(i,x),i.encodePart=K;break;case "pathname":N(this.#n.protocol)?(Object.assign(i,q,c),i.encodePart=he):(Object.assign(i,x,c),i.encodePart=ue);break;case "search":Object.assign(i,x,c),i.encodePart=de;break;case "hash":Object.assign(i,x,c),i.encodePart=pe;break}try{this.#s[s]=D(a,i),this.#n[s]=F(this.#s[s],this.#t[s],i),this.#e[s]=ke(this.#s[s],i),this.#l=this.#l||this.#s[s].some(f=>f.type===2);}catch{throw new TypeError(`invalid ${s} pattern '${this.#i[s]}'.`)}}}catch(o){throw new TypeError(`Failed to construct 'URLPattern': ${o.message}`)}}test(t={},r){let n={pathname:"",protocol:"",username:"",password:"",hostname:"",port:"",search:"",hash:""};if(typeof t!="string"&&r)throw new TypeError("parameter 1 is not of type 'string'.");if(typeof t>"u")return  false;try{typeof t=="object"?n=w(n,t,!1):n=w(n,ge(t,r),!1);}catch{return  false}let o;for(o of G)if(!this.#n[o].exec(n[o]))return  false;return  true}exec(t={},r){let n={pathname:"",protocol:"",username:"",password:"",hostname:"",port:"",search:"",hash:""};if(typeof t!="string"&&r)throw new TypeError("parameter 1 is not of type 'string'.");if(typeof t>"u")return;try{typeof t=="object"?n=w(n,t,!1):n=w(n,ge(t,r),!1);}catch{return null}let o={};r?o.inputs=[t,r]:o.inputs=[t];let c;for(c of G){let l=this.#n[c].exec(n[c]);if(!l)return null;let s={};for(let[i,a]of this.#t[c].entries())if(typeof a=="string"||typeof a=="number"){let f=l[i+1];s[a]=f;}o[c]={input:n[c]??"",groups:s};}return o}static compareComponent(t,r,n){let o=(i,a)=>{for(let f of ["type","modifier","prefix","value","suffix"]){if(i[f]<a[f])return  -1;if(i[f]===a[f])continue;return 1}return 0},c=new R(3,"","","","",3),l=new R(0,"","","","",3),s=(i,a)=>{let f=0;for(;f<Math.min(i.length,a.length);++f){let d=o(i[f],a[f]);if(d)return d}return i.length===a.length?0:o(i[f]??c,a[f]??c)};return !r.#e[t]&&!n.#e[t]?0:r.#e[t]&&!n.#e[t]?s(r.#s[t],[l]):!r.#e[t]&&n.#e[t]?s([l],n.#s[t]):s(r.#s[t],n.#s[t])}get protocol(){return this.#e.protocol}get username(){return this.#e.username}get password(){return this.#e.password}get hostname(){return this.#e.hostname}get port(){return this.#e.port}get pathname(){return this.#e.pathname}get search(){return this.#e.search}get hash(){return this.#e.hash}get hasRegExpGroups(){return this.#l}};

if (!globalThis.URLPattern) {
  globalThis.URLPattern = me;
}

/**
 * Calculates the relative parts (pathname, search, hash) of a target URL
 * with respect to a base URL.
 *
 * Assumes target URL should be "under" the base URL for routing purposes.
 *
 * @param targetUrlString The full current URL (e.g., location.href).
 * @param baseUrlString The base URL for the application/component.
 * @returns An object with relative pathname, search, and hash, or null if not relative.
 */
const baseurl_relative_parts = (targetUrlString, baseUrlString) => {
    try {
        const targetUrl = targetUrlString instanceof URL ? targetUrlString : new URL(targetUrlString);
        // Ensure base has a context for resolving potential relative targetUrlString
        const baseUrl = baseUrlString instanceof URL ? baseUrlString : new URL(baseUrlString, document.baseURI); // Use document.baseURI if baseUrlString is relative itself
        // 1. Check Origin: Must be the same for sensible relative calculation
        if (targetUrl.origin !== baseUrl.origin) {
            return null;
        }
        const targetPath = targetUrl.pathname;
        const basePath = baseUrl.pathname;
        // 2. Check if target path starts with base path.
        // Handle base paths that might or might not end with '/' correctly.
        let relativePathname;
        let basePathPrefix = basePath;
        // Ensure base path acts as a directory prefix for comparison
        if (!basePathPrefix.endsWith('/')) {
            basePathPrefix += '/';
        }
        // Check if target starts with the base directory prefix
        if (targetPath.startsWith(basePathPrefix)) {
            relativePathname = targetPath.slice(basePathPrefix.length);
        }
        // Check if target *exactly* matches base path without trailing slash
        else if (targetPath === basePath && !basePath.endsWith('/')) {
            relativePathname = ''; // Target is the base itself
        }
        // Check if target matches base path that *does* have trailing slash
        else if (targetPath === basePath && basePath.endsWith('/')) {
            relativePathname = ''; // Target is the base itself (directory index)
        }
        else {
            // Target path doesn't start appropriately relative to base path
            return null;
        }
        // 3. Return the relative pathname and the original search/hash from the target URL
        return {
            pathname: relativePathname, // Path relative to base
            search: targetUrl.search, // Full search string from target
            hash: targetUrl.hash, // Full hash string from target
        };
    }
    catch (error) {
        console.error('Error parsing URLs for relative parts:', error);
        return null;
    }
};

const pageFutureTranslateX = cssLiteral('100%');
const pageFutureTranslateY = cssLiteral('0%');
const pageFutureScaleX = cssLiteral('100%');
const pageFutureScaleY = cssLiteral('100%');
const pageFutureOpacity = cssLiteral('100%');
const pagePastTranslateX = cssLiteral('-38%');
const pagePastTranslateY = cssLiteral('0%');
const pagePastScaleX = cssLiteral('100%');
const pagePastScaleY = cssLiteral('100%');
const pagePastOpacity = cssLiteral('100%');
cssLiteral('0%');
cssLiteral('0%');
cssLiteral('90%');
cssLiteral('90%');
cssLiteral('50%');
CSS.registerProperty({
    name: '--page-translate-x',
    syntax: '<length-percentage>',
    inherits: false,
    initialValue: `0px`,
});
CSS.registerProperty({
    name: '--page-translate-y',
    syntax: '<length-percentage>',
    inherits: false,
    initialValue: `0px`,
});
CSS.registerProperty({
    name: '--page-scale-x',
    syntax: '<percentage>',
    inherits: false,
    initialValue: `100%`,
});
CSS.registerProperty({
    name: '--page-scale-y',
    syntax: '<percentage>',
    inherits: false,
    initialValue: `100%`,
});
const appnNavigationStyle = i `:host{display:grid;grid-template-columns:1fr;grid-template-rows:1fr;grid-template-areas:'stack';width:100cqw;height:100cqh;overflow:hidden;background-color:var(--color-canvas)}::slotted(*){grid-area:stack;z-index:var(--index,1)}slot[name=router]{display:none}:host([stack]){perspective:calc(var(--z,1200) * 1px);transform-style:preserve-3d;perspective-origin:calc(var(--x,50) * 1%) calc(var(--y,50) * 1%)}:host([stack-direction=horizontal]){--x:130}:host([stack-direction=vertical]){--y:130}::slotted(*){transform-style:preserve-3d;user-select:none}::slotted(*){--page-translate-z:calc((var(--present-index, -1) - var(--index, 0)) * -36px);translate:var(--page-translate-x,0) var(--page-translate-y,0) var(--page-translate-z);scale:var(--page-scale-x,100%) var(--page-scale-y,100%)}`;
const appnNavigationHistoryEntryStyle = iter_map_not_null([
    i `:host{place-self:stretch;display:grid;transition-property:all;transition-behavior:allow-discrete}:host([data-tense=future]){--page-translate-x:${pageFutureTranslateX};--page-translate-y:${pageFutureTranslateY};--page-scale-x:${pageFutureScaleX};--page-scale-y:${pageFutureScaleY};--page-opacity:${pageFutureOpacity}}:host([data-tense=past]){--page-translate-x:${pagePastTranslateX};--page-translate-y:${pagePastTranslateY};--page-scale-x:${pagePastScaleX};--page-scale-y:${pagePastScaleY};--page-opacity:${pagePastOpacity}}:host([data-from-tense=present]){transition-duration:var(--page-leave-duration);transition-timing-function:var(--page-leave-ease)}:host([data-tense=present]){transition-duration:var(--page-enter-duration);transition-timing-function:var(--page-enter-ease)}`,
], (v) => v);

const APPN_NAVIGATION_STACK_DIRECTION_ENUM_VALUES = [null, 'horizontal', 'vertical'];
/**
 * @attr {boolean} stack - enable stack view mode
 * @attr {AppnNavigationStackDirection} stack-direction - The direction of the navigation stack.
 */
let AppnNavigationProviderElement = (() => {
    let _classDecorators = [t('appn-navigation-provider')];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = r;
    let _baseURI_decorators;
    let _baseURI_initializers = [];
    let _baseURI_extraInitializers = [];
    let _currentEntry_decorators;
    let _currentEntry_initializers = [];
    let _currentEntry_extraInitializers = [];
    let _onnavigate_decorators;
    let _onnavigate_initializers = [];
    let _onnavigate_extraInitializers = [];
    let _onnavigatesuccess_decorators;
    let _onnavigatesuccess_initializers = [];
    let _onnavigatesuccess_extraInitializers = [];
    let _onnavigateerror_decorators;
    let _onnavigateerror_initializers = [];
    let _onnavigateerror_extraInitializers = [];
    let _oncurrententrychange_decorators;
    let _oncurrententrychange_initializers = [];
    let _oncurrententrychange_extraInitializers = [];
    let _stack_decorators;
    let _stack_initializers = [];
    let _stack_extraInitializers = [];
    let _stackDirection_decorators;
    let _stackDirection_initializers = [];
    let _stackDirection_extraInitializers = [];
    let _routersElements_decorators;
    let _routersElements_initializers = [];
    let _routersElements_extraInitializers = [];
    (class extends _classSuper {
        static { _classThis = this; }
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
            _baseURI_decorators = [n({ type: String, reflect: true, attribute: 'base-uri' })];
            _currentEntry_decorators = [e$1({ context: appnNavigationHistoryEntryContext })];
            _onnavigate_decorators = [eventProperty()];
            _onnavigatesuccess_decorators = [eventProperty()];
            _onnavigateerror_decorators = [eventProperty()];
            _oncurrententrychange_decorators = [eventProperty()];
            _stack_decorators = [n({ type: Boolean, reflect: true, attribute: true })];
            _stackDirection_decorators = [safeProperty({ ...enumToSafeConverter(APPN_NAVIGATION_STACK_DIRECTION_ENUM_VALUES), attribute: 'stack-direction' })];
            _routersElements_decorators = [o({ slot: 'router', flatten: true })];
            __esDecorate(this, null, _baseURI_decorators, { kind: "accessor", name: "baseURI", static: false, private: false, access: { has: obj => "baseURI" in obj, get: obj => obj.baseURI, set: (obj, value) => { obj.baseURI = value; } }, metadata: _metadata }, _baseURI_initializers, _baseURI_extraInitializers);
            __esDecorate(this, null, _currentEntry_decorators, { kind: "accessor", name: "currentEntry", static: false, private: false, access: { has: obj => "currentEntry" in obj, get: obj => obj.currentEntry, set: (obj, value) => { obj.currentEntry = value; } }, metadata: _metadata }, _currentEntry_initializers, _currentEntry_extraInitializers);
            __esDecorate(this, null, _onnavigate_decorators, { kind: "accessor", name: "onnavigate", static: false, private: false, access: { has: obj => "onnavigate" in obj, get: obj => obj.onnavigate, set: (obj, value) => { obj.onnavigate = value; } }, metadata: _metadata }, _onnavigate_initializers, _onnavigate_extraInitializers);
            __esDecorate(this, null, _onnavigatesuccess_decorators, { kind: "accessor", name: "onnavigatesuccess", static: false, private: false, access: { has: obj => "onnavigatesuccess" in obj, get: obj => obj.onnavigatesuccess, set: (obj, value) => { obj.onnavigatesuccess = value; } }, metadata: _metadata }, _onnavigatesuccess_initializers, _onnavigatesuccess_extraInitializers);
            __esDecorate(this, null, _onnavigateerror_decorators, { kind: "accessor", name: "onnavigateerror", static: false, private: false, access: { has: obj => "onnavigateerror" in obj, get: obj => obj.onnavigateerror, set: (obj, value) => { obj.onnavigateerror = value; } }, metadata: _metadata }, _onnavigateerror_initializers, _onnavigateerror_extraInitializers);
            __esDecorate(this, null, _oncurrententrychange_decorators, { kind: "accessor", name: "oncurrententrychange", static: false, private: false, access: { has: obj => "oncurrententrychange" in obj, get: obj => obj.oncurrententrychange, set: (obj, value) => { obj.oncurrententrychange = value; } }, metadata: _metadata }, _oncurrententrychange_initializers, _oncurrententrychange_extraInitializers);
            __esDecorate(this, null, _stack_decorators, { kind: "accessor", name: "stack", static: false, private: false, access: { has: obj => "stack" in obj, get: obj => obj.stack, set: (obj, value) => { obj.stack = value; } }, metadata: _metadata }, _stack_initializers, _stack_extraInitializers);
            __esDecorate(this, null, _stackDirection_decorators, { kind: "accessor", name: "stackDirection", static: false, private: false, access: { has: obj => "stackDirection" in obj, get: obj => obj.stackDirection, set: (obj, value) => { obj.stackDirection = value; } }, metadata: _metadata }, _stackDirection_initializers, _stackDirection_extraInitializers);
            __esDecorate(this, null, _routersElements_decorators, { kind: "accessor", name: "routersElements", static: false, private: false, access: { has: obj => "routersElements" in obj, get: obj => obj.routersElements, set: (obj, value) => { obj.routersElements = value; } }, metadata: _metadata }, _routersElements_initializers, _routersElements_extraInitializers);
            __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
            _classThis = _classDescriptor.value;
            if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        }
        static styles = appnNavigationStyle;
        //#region AppnNavigation
        __nav = window.navigation;
        constructor() {
            super();
            new i$1(this, {
                context: appnNavigationContext,
                initialValue: this,
            });
            /// 这里独立写，是为了方便调试
            this.__nav.addEventListener('navigate', (event) => {
                if (!event.canIntercept) {
                    return;
                }
                event.intercept({
                    handler: () => this.__effectRoutes(event.navigationType),
                });
            });
            this.__nav.addEventListener('currententrychange', (_event) => {
                this.currentEntry = this.__nav.currentEntry;
            });
        }
        #baseURI_accessor_storage = __runInitializers(this, _baseURI_initializers, location.href);
        get baseURI() { return this.#baseURI_accessor_storage; }
        set baseURI(value) { this.#baseURI_accessor_storage = value; }
        /** Returns a snapshot of the joint session history entries. */
        async entries() {
            const entries = this.__nav.entries();
            const match_entries = entries.filter((entry) => (entry.url ? baseurl_relative_parts(entry.url, this.baseURI) : false));
            return match_entries;
        }
        async findFirstEntry(pattern, fromEntry) {
            const entries = await this.entries();
            const startIndex = fromEntry ? entries.indexOf(fromEntry) : 0;
            for (let i = startIndex > 0 ? startIndex : 0; i < entries.length; i++) {
                const entry = entries[i];
                const found = z$1(entry)
                    .with(pattern, (entry) => entry)
                    .otherwise(() => null);
                if (found)
                    return found;
            }
            return null;
        }
        async findLastEntry(pattern, fromEntry) {
            const entries = await this.entries();
            const startIndex = fromEntry ? entries.indexOf(fromEntry) : entries.length - 1;
            for (let i = startIndex < entries.length ? startIndex : entries.length - 1; i >= 0; i--) {
                const entry = entries[i];
                const found = z$1(entry)
                    .with(pattern, (entry) => entry)
                    .otherwise(() => null);
                if (found)
                    return found;
            }
            return null;
        }
        #currentEntry_accessor_storage = (__runInitializers(this, _baseURI_extraInitializers), __runInitializers(this, _currentEntry_initializers, this.__nav.currentEntry));
        // /** The current NavigationHistoryEntry. */
        // get currentEntry() {
        //   return this.__nav.currentEntry;
        // }
        get currentEntry() { return this.#currentEntry_accessor_storage; }
        set currentEntry(value) { this.#currentEntry_accessor_storage = value; }
        /** Updates the state object of the current NavigationHistoryEntry. */
        updateCurrentEntry(options) {
            this.__nav.updateCurrentEntry(options);
        }
        /** Represents the currently ongoing navigation or null if none. */
        get transition() {
            return this.__nav.transition;
        }
        /** Represents the activation details if the navigation was triggered by same-origin prerendering or bfcache restoration. */
        get activation() {
            // @ts-expect-error
            return this.__nav.activation ?? null;
        }
        /** Indicates if it's possible to navigate backwards. */
        get canGoBack() {
            return this.__nav.canGoBack;
        }
        /** Indicates if it's possible to navigate forwards. */
        get canGoForward() {
            return this.__nav.canGoForward;
        }
        /** Navigates to the specified URL. */
        navigate(url, options) {
            return this.__nav.navigate(url, options);
        }
        /** Reloads the current entry. */
        reload(options) {
            return this.__nav.reload(options);
        }
        /** Navigates to a specific history entry identified by its key. */
        traverseTo(key, options) {
            return this.__nav.traverseTo(key, options);
        }
        /** Navigates back one entry in the joint session history. */
        back(options) {
            return this.__nav.back(options);
        }
        /** Navigates forward one entry in the joint session history. */
        forward(options) {
            return this.__nav.forward(options);
        }
        #onnavigate_accessor_storage = (__runInitializers(this, _currentEntry_extraInitializers), __runInitializers(this, _onnavigate_initializers, void 0));
        // Event Handlers (using specific event types is better if available)
        get onnavigate() { return this.#onnavigate_accessor_storage; }
        set onnavigate(value) { this.#onnavigate_accessor_storage = value; }
        #onnavigatesuccess_accessor_storage = (__runInitializers(this, _onnavigate_extraInitializers), __runInitializers(this, _onnavigatesuccess_initializers, void 0));
        get onnavigatesuccess() { return this.#onnavigatesuccess_accessor_storage; }
        set onnavigatesuccess(value) { this.#onnavigatesuccess_accessor_storage = value; }
        #onnavigateerror_accessor_storage = (__runInitializers(this, _onnavigatesuccess_extraInitializers), __runInitializers(this, _onnavigateerror_initializers, void 0));
        get onnavigateerror() { return this.#onnavigateerror_accessor_storage; }
        set onnavigateerror(value) { this.#onnavigateerror_accessor_storage = value; }
        #oncurrententrychange_accessor_storage = (__runInitializers(this, _onnavigateerror_extraInitializers), __runInitializers(this, _oncurrententrychange_initializers, void 0));
        get oncurrententrychange() { return this.#oncurrententrychange_accessor_storage; }
        set oncurrententrychange(value) { this.#oncurrententrychange_accessor_storage = value; }
        #stack_accessor_storage = (__runInitializers(this, _oncurrententrychange_extraInitializers), __runInitializers(this, _stack_initializers, false));
        //#endregion
        //#region stack render
        get stack() { return this.#stack_accessor_storage; }
        set stack(value) { this.#stack_accessor_storage = value; }
        #stackDirection_accessor_storage = (__runInitializers(this, _stack_extraInitializers), __runInitializers(this, _stackDirection_initializers, null));
        get stackDirection() { return this.#stackDirection_accessor_storage; }
        set stackDirection(value) { this.#stackDirection_accessor_storage = value; }
        // 相机控制方法
        setCamera(x, y, z) {
            this.style.setProperty('--x', `${x}`);
            this.style.setProperty('--y', `${y}`);
            this.style.setProperty('--z', `${z}`);
        }
        #routersElements_accessor_storage = (__runInitializers(this, _stackDirection_extraInitializers), __runInitializers(this, _routersElements_initializers, void 0));
        //#endregion
        get routersElements() { return this.#routersElements_accessor_storage; }
        set routersElements(value) { this.#routersElements_accessor_storage = value; }
        /**
         * 将 NavigationHistoryEntry[] 映射到元素里
         */
        __effectRoutes = (__runInitializers(this, _routersElements_extraInitializers), async (navigationType) => {
            const effectRoutes = () => {
                const routersElements = this.routersElements.filter((ele) => ele instanceof HTMLTemplateElement);
                const allEntries = this.__nav.entries();
                const currentEntry = this.__nav.currentEntry;
                const currentEntryIndex = currentEntry ? allEntries.indexOf(currentEntry) : -1;
                allEntries.forEach((navEntry) => {
                    return this.__effectRoute(navEntry, routersElements, { allEntries, currentEntry, currentEntryIndex, navigationType });
                });
            };
            document.startViewTransition(() => {
                return effectRoutes();
            });
            // effectRoutes();
        });
        __effectRoute = (navEntry, routersElements, context) => {
            const current_url = navEntry.url;
            if (!current_url) {
                return;
            }
            const relative_parts = baseurl_relative_parts(current_url, this.baseURI);
            if (!relative_parts) {
                return;
            }
            for (const routerElement of routersElements) {
                const { pathname = '*', search = '*', hash = '*' } = routerElement.dataset;
                const p = new URLPattern({ pathname, search, hash });
                const matchResult = p.exec(relative_parts);
                if (matchResult) {
                    const templateElement = routerElement.dataset.target
                        ? z$1(routerElement.ownerDocument.getElementById(routerElement.dataset.target))
                            .when((ele) => ele instanceof HTMLTemplateElement, (ele) => ele)
                            .otherwise(() => null)
                        : routerElement;
                    if (templateElement) {
                        const oldNavHistoryEntryNode = this.querySelector(`appn-navigation-history-entry[data-index="${navEntry.index}"]`);
                        if (oldNavHistoryEntryNode) {
                            oldNavHistoryEntryNode.navigationEntry = navEntry;
                            if (oldNavHistoryEntryNode.templateEle !== templateElement) {
                                oldNavHistoryEntryNode.templateEle = templateElement;
                                oldNavHistoryEntryNode.hash = relative_parts.hash;
                                oldNavHistoryEntryNode.innerHTML = '';
                                oldNavHistoryEntryNode.appendChild(templateElement.content.cloneNode(true));
                            }
                            oldNavHistoryEntryNode.presentEntryIndex = context.currentEntryIndex;
                        }
                        else {
                            const newNavHistoryEntryNode = new AppnNavigationHistoryEntryElement();
                            newNavHistoryEntryNode.navigationEntry = navEntry;
                            newNavHistoryEntryNode.templateEle = templateElement;
                            newNavHistoryEntryNode.pathname = relative_parts.pathname;
                            newNavHistoryEntryNode.search = relative_parts.search;
                            newNavHistoryEntryNode.hash = relative_parts.hash;
                            newNavHistoryEntryNode.appendChild(templateElement.content.cloneNode(true));
                            newNavHistoryEntryNode.navigationType = context.navigationType ?? null;
                            this.appendChild(newNavHistoryEntryNode);
                            newNavHistoryEntryNode.presentEntryIndex = context.currentEntryIndex;
                        }
                    }
                    break;
                }
            }
        };
        render() {
            return this.__html;
        }
        __html = h(x$1 `<slot name="router" @slotchange="${this.__effectRoutes}"></slot><slot></slot><css-starting-style slotted="" selector="appn-navigation-history-entry[data-tense='present'][data-from-tense='future']" cssText="--page-translate-x: ${pageFutureTranslateX};--page-translate-y: ${pageFutureTranslateY};--page-scale-x: ${pageFutureScaleX};--page-scale-y: ${pageFutureScaleY};--page-opacity: ${pageFutureOpacity};"></css-starting-style>`);
        static {
            __runInitializers(_classThis, _classExtraInitializers);
        }
    });
    return _classThis;
})();
let AppnNavigationHistoryEntryElement = (() => {
    let _classDecorators = [t('appn-navigation-history-entry')];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = r;
    let _pathname_decorators;
    let _pathname_initializers = [];
    let _pathname_extraInitializers = [];
    let _search_decorators;
    let _search_initializers = [];
    let _search_extraInitializers = [];
    let _hash_decorators;
    let _hash_initializers = [];
    let _hash_extraInitializers = [];
    let _templateEle_decorators;
    let _templateEle_initializers = [];
    let _templateEle_extraInitializers = [];
    let _navigationType_decorators;
    let _navigationType_initializers = [];
    let _navigationType_extraInitializers = [];
    let _presentEntryIndex_decorators;
    let _presentEntryIndex_initializers = [];
    let _presentEntryIndex_extraInitializers = [];
    let _navigationEntry_decorators;
    let _navigationEntry_initializers = [];
    let _navigationEntry_extraInitializers = [];
    (class extends _classSuper {
        static { _classThis = this; }
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
            _pathname_decorators = [n({ type: String, reflect: true, attribute: true })];
            _search_decorators = [n({ type: String, reflect: true, attribute: true })];
            _hash_decorators = [n({ type: String, reflect: true, attribute: true })];
            _templateEle_decorators = [n({ type: Object })];
            _navigationType_decorators = [safeProperty(enumToSafeConverter([null, 'reload', 'push', 'replace', 'traverse']))];
            _presentEntryIndex_decorators = [n({ type: Number, reflect: true, attribute: true })];
            _navigationEntry_decorators = [e$1({ context: appnNavigationHistoryEntryContext })];
            __esDecorate(this, null, _pathname_decorators, { kind: "accessor", name: "pathname", static: false, private: false, access: { has: obj => "pathname" in obj, get: obj => obj.pathname, set: (obj, value) => { obj.pathname = value; } }, metadata: _metadata }, _pathname_initializers, _pathname_extraInitializers);
            __esDecorate(this, null, _search_decorators, { kind: "accessor", name: "search", static: false, private: false, access: { has: obj => "search" in obj, get: obj => obj.search, set: (obj, value) => { obj.search = value; } }, metadata: _metadata }, _search_initializers, _search_extraInitializers);
            __esDecorate(this, null, _hash_decorators, { kind: "accessor", name: "hash", static: false, private: false, access: { has: obj => "hash" in obj, get: obj => obj.hash, set: (obj, value) => { obj.hash = value; } }, metadata: _metadata }, _hash_initializers, _hash_extraInitializers);
            __esDecorate(this, null, _templateEle_decorators, { kind: "accessor", name: "templateEle", static: false, private: false, access: { has: obj => "templateEle" in obj, get: obj => obj.templateEle, set: (obj, value) => { obj.templateEle = value; } }, metadata: _metadata }, _templateEle_initializers, _templateEle_extraInitializers);
            __esDecorate(this, null, _navigationType_decorators, { kind: "accessor", name: "navigationType", static: false, private: false, access: { has: obj => "navigationType" in obj, get: obj => obj.navigationType, set: (obj, value) => { obj.navigationType = value; } }, metadata: _metadata }, _navigationType_initializers, _navigationType_extraInitializers);
            __esDecorate(this, null, _presentEntryIndex_decorators, { kind: "accessor", name: "presentEntryIndex", static: false, private: false, access: { has: obj => "presentEntryIndex" in obj, get: obj => obj.presentEntryIndex, set: (obj, value) => { obj.presentEntryIndex = value; } }, metadata: _metadata }, _presentEntryIndex_initializers, _presentEntryIndex_extraInitializers);
            __esDecorate(this, null, _navigationEntry_decorators, { kind: "accessor", name: "navigationEntry", static: false, private: false, access: { has: obj => "navigationEntry" in obj, get: obj => obj.navigationEntry, set: (obj, value) => { obj.navigationEntry = value; } }, metadata: _metadata }, _navigationEntry_initializers, _navigationEntry_extraInitializers);
            __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
            _classThis = _classDescriptor.value;
            if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        }
        static styles = appnNavigationHistoryEntryStyle;
        #pathname_accessor_storage = __runInitializers(this, _pathname_initializers, void 0);
        get pathname() { return this.#pathname_accessor_storage; }
        set pathname(value) { this.#pathname_accessor_storage = value; }
        #search_accessor_storage = (__runInitializers(this, _pathname_extraInitializers), __runInitializers(this, _search_initializers, void 0));
        get search() { return this.#search_accessor_storage; }
        set search(value) { this.#search_accessor_storage = value; }
        #hash_accessor_storage = (__runInitializers(this, _search_extraInitializers), __runInitializers(this, _hash_initializers, void 0));
        get hash() { return this.#hash_accessor_storage; }
        set hash(value) { this.#hash_accessor_storage = value; }
        #templateEle_accessor_storage = (__runInitializers(this, _hash_extraInitializers), __runInitializers(this, _templateEle_initializers, undefined));
        get templateEle() { return this.#templateEle_accessor_storage; }
        set templateEle(value) { this.#templateEle_accessor_storage = value; }
        #navigationType_accessor_storage = (__runInitializers(this, _templateEle_extraInitializers), __runInitializers(this, _navigationType_initializers, null));
        get navigationType() { return this.#navigationType_accessor_storage; }
        set navigationType(value) { this.#navigationType_accessor_storage = value; }
        #presentEntryIndex_accessor_storage = (__runInitializers(this, _navigationType_extraInitializers), __runInitializers(this, _presentEntryIndex_initializers, -1));
        get presentEntryIndex() { return this.#presentEntryIndex_accessor_storage; }
        set presentEntryIndex(value) { this.#presentEntryIndex_accessor_storage = value; }
        #navigationEntry_accessor_storage = (__runInitializers(this, _presentEntryIndex_extraInitializers), __runInitializers(this, _navigationEntry_initializers, null));
        get navigationEntry() { return this.#navigationEntry_accessor_storage; }
        set navigationEntry(value) { this.#navigationEntry_accessor_storage = value; }
        render() {
            this.dataset.key = this.navigationEntry?.key;
            /** 自身 index */
            const selfIndex = this.navigationEntry?.index ?? -1;
            /** 当前 NavigationHistoryEntry 的 index */
            const presentIndex = this.presentEntryIndex;
            this.style.setProperty('--index', (this.dataset.index = `${selfIndex}`));
            this.style.setProperty('--present-index', `${presentIndex}`);
            let fromTense = this.dataset.tense;
            /**
             * 如果 present 在最后，那么：
             *
             * curr:  ...past | past    | PRESENT
             * from:  ...past | PRESENT | future
             * diff:    -2    | -1      | 0
             *
             * ---
             *
             * navigationType === 'push'，那么：
             *
             * curr:        ...past | past    | PRESENT | future  | future...
             * from-enter:  ...past | PRESENT | future  | future  | future...
             * diff-enter:  -2      | -1      | 0       | +1      | +2
             *
             * from-back:   ...past | past   | past     | PRESENT | future...
             * diff-back:   -2      | -1     | 0        | +1      | +2
             *
             */
            if (fromTense == null) {
                const pos = z$1(this.navigationType)
                    .with('push', () => 1)
                    .with('traverse', () => -1)
                    .otherwise(() => 0);
                if (selfIndex > presentIndex - pos) {
                    fromTense = 'future';
                }
                else if (selfIndex < presentIndex - pos) {
                    // presentIndex - 1
                    fromTense = 'past';
                }
                else {
                    fromTense = 'present';
                }
            }
            this.dataset.fromTense = fromTense;
            const tense = presentIndex === -1
                ? undefined
                : z$1(selfIndex)
                    .with(presentIndex, () => 'present')
                    .otherwise(() => (selfIndex < presentIndex ? 'past' : 'future'));
            this.dataset.tense = tense;
            const vtn = `vtn-${selfIndex}`;
            this.style.setProperty('--view-transition-name', vtn);
            this.inert = tense !== 'present';
            return x$1 `<slot></slot>`;
        }
        constructor() {
            super(...arguments);
            __runInitializers(this, _navigationEntry_extraInitializers);
        }
        static {
            __runInitializers(_classThis, _classExtraInitializers);
        }
    });
    return _classThis;
})();
//#endregion

export { AppnNavigationHistoryEntryElement, AppnNavigationProviderElement };
