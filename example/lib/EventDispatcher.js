(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global = global || self, global.EventDispatcher = factory());
}(this, (function () { 'use strict';

	class EventDispatcher {
	    constructor(eventKeyList = []) {
	        /**
	         * store all the filters
	         */
	        this.filters = [];
	        /**
	         * store all the listeners by key
	         */
	        this.listeners = new Map();
	        this.all = (listener) => {
	            return this.filt(() => true, listener);
	        };
	        this.clear = (eventKey) => {
	            this.listeners.delete(eventKey);
	            return this;
	        };
	        this.clearAll = () => {
	            const keys = this.listeners.keys();
	            for (let key of keys) {
	                this.listeners.delete(key);
	            }
	            return this;
	        };
	        this.dispatch = (eventKey, target) => {
	            if (!this.checkEventKeyAvailable(eventKey)) {
	                console.error("EventDispatcher couldn't dispatch the event since EventKeyList doesn't contains key: ", eventKey);
	                return this;
	            }
	            const array = this.listeners.get(eventKey) || [];
	            let len = array.length;
	            let item;
	            for (let i = 0; i < len; i++) {
	                item = array[i];
	                item.listener({
	                    eventKey,
	                    target,
	                    life: --item.times
	                });
	                if (item.times <= 0) {
	                    array.splice(i--, 1);
	                    --len;
	                }
	            }
	            return this.checkFilt(eventKey, target);
	        };
	        this.filt = (rule, listener) => {
	            this.filters.push({
	                rule,
	                listener
	            });
	            return this;
	        };
	        this.off = (eventKey, listener) => {
	            const array = this.listeners.get(eventKey);
	            if (!array) {
	                return this;
	            }
	            const len = array.length;
	            for (let i = 0; i < len; i++) {
	                if (array[i].listener === listener) {
	                    array.splice(i, 1);
	                    break;
	                }
	            }
	            return this;
	        };
	        this.on = (eventKey, listener) => {
	            return this.times(eventKey, Infinity, listener);
	        };
	        this.once = (eventKey, listener) => {
	            return this.times(eventKey, 1, listener);
	        };
	        this.times = (eventKey, times, listener) => {
	            if (!this.checkEventKeyAvailable(eventKey)) {
	                console.error("EventDispatcher couldn't add the listener: ", listener, "since EventKeyList doesn't contains key: ", eventKey);
	                return this;
	            }
	            let array = this.listeners.get(eventKey) || [];
	            if (!this.listeners.has(eventKey)) {
	                this.listeners.set(eventKey, array);
	            }
	            array.push({
	                listener,
	                times
	            });
	            return this;
	        };
	        this.checkFilt = (eventKey, target) => {
	            for (let item of this.filters) {
	                if (item.rule(eventKey, target)) {
	                    item.listener({
	                        eventKey,
	                        target,
	                        life: Infinity
	                    });
	                }
	            }
	            return this;
	        };
	        this.checkEventKeyAvailable = (eventKey) => {
	            if (this.eventKeyList.length) {
	                if (!this.eventKeyList.includes(eventKey)) {
	                    return false;
	                }
	            }
	            return true;
	        };
	        this.eventKeyList = eventKeyList;
	    }
	}

	return EventDispatcher;

})));
