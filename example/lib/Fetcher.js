(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('@valeera/eventdispatcher')) :
	typeof define === 'function' && define.amd ? define(['@valeera/eventdispatcher'], factory) :
	(global = global || self, global.Fetcher = factory(global.EventDispatcher));
}(this, (function (EventDispatcher) { 'use strict';

	EventDispatcher = EventDispatcher && EventDispatcher.hasOwnProperty('default') ? EventDispatcher['default'] : EventDispatcher;

	class FetchManager extends EventDispatcher {
	    constructor(urls) {
	        super();
	        this.errorTasks = [];
	        this.finishedTasks = [];
	        this.process = 0;
	        this.progressingTasks = [];
	        this.size = 0;
	        this.tasks = [];
	        this.add = (target) => {
	            if (typeof target === 'string') {
	                target = new Fetcher(target);
	            }
	            target.on(Fetcher.STARTED, (event) => {
	                this.size += event.target.size;
	            }).on(Fetcher.PROGRESSING, (event) => {
	                this.process += event.target.process;
	                this.dispatch(FetchManager.PROGRESSING, this);
	            }).once(Fetcher.PROGRESSING, (event) => {
	                this.progressingTasks.push(event.target);
	            }).on(Fetcher.FINSIHED, (event) => {
	                this.finishedTasks.push(event.target.size);
	                this.dispatch(FetchManager.TASK_FINISHED, event.target);
	            }).on(Fetcher.ERROR, (event) => {
	                this.errorTasks.push(event.target.size);
	                this.dispatch(FetchManager.TASK_ERROR, event.target);
	            });
	            this.tasks.push(target);
	            return this;
	        };
	        this.fetch = async () => {
	            const arr = [];
	            this.tasks.forEach((fetcher) => {
	                arr.push(fetcher.fetch());
	            });
	            return Promise.all(arr).then(() => {
	                return this;
	            });
	        };
	        urls.forEach((url) => {
	            this.add(url);
	        });
	    }
	}
	FetchManager.TASK_FINISHED = "task_finished";
	FetchManager.TASK_ERROR = "task_error";
	FetchManager.PROGRESSING = "progressing";
	FetchManager.FINISHED = "finished";

	class Fetcher extends EventDispatcher {
	    constructor(url = "") {
	        super();
	        this.process = 0;
	        this.url = "";
	        this.state = Fetcher.IDLING;
	        this.currentReadData = null;
	        this.update = (url) => {
	            this.url = url;
	            this.process = 0;
	            this.currentReadData = null;
	            this.state = Fetcher.IDLING;
	            return this;
	        };
	        this.cancel = () => {
	            if (this.reader) {
	                this.state = Fetcher.CANCELLED;
	                return this.reader.cancel();
	            }
	        };
	        this.getCurrentReadSpeed = () => {
	            if (!this.currentReadData || !this.currentReadData.value) {
	                return 0;
	            }
	            const arr = this.currentReadData.value;
	            return arr.length * arr.constructor.BYTES_PER_ELEMENT;
	        };
	        this.fetch = (options) => {
	            return fetch(this.url, options).then((response) => {
	                this.response = response;
	                const { body, headers } = response;
	                this.size = parseInt(headers.get('content-length') || '0', 10);
	                if (body) {
	                    this.reader = body.getReader();
	                    this.stream = new ReadableStream({
	                        start: (controller) => {
	                            this.state = Fetcher.STARTED;
	                            this.dispatch(Fetcher.STARTED, this);
	                            const push = () => {
	                                this.reader.read().then((res) => {
	                                    this.currentReadData = res;
	                                    let { done, value } = res;
	                                    if (done) {
	                                        controller.close();
	                                        this.currentReadData = null;
	                                        this.state = Fetcher.FINSIHED;
	                                        this.dispatch(Fetcher.FINSIHED, this);
	                                    }
	                                    else {
	                                        this.process += this.getCurrentReadSpeed();
	                                        this.state = Fetcher.PROGRESSING;
	                                        this.dispatch(Fetcher.PROGRESSING, this);
	                                    }
	                                    controller.enqueue(value);
	                                    push();
	                                }).catch(() => {
	                                    this.state = Fetcher.ERROR;
	                                    this.dispatch(Fetcher.ERROR, this);
	                                });
	                            };
	                            push();
	                        },
	                        cancel: () => {
	                            this.state = Fetcher.CANCELLED;
	                            this.dispatch(Fetcher.CANCELLED, this);
	                        }
	                    });
	                }
	                else {
	                    this.state = Fetcher.ERROR;
	                    this.dispatch(Fetcher.ERROR, this);
	                }
	                return new Response(this.stream, { headers });
	            }).catch((error) => {
	                this.state = Fetcher.ERROR;
	                this.dispatch(Fetcher.ERROR, error);
	            });
	        };
	        this.update(url || "");
	    }
	}
	Fetcher.FetcherManager = FetchManager;
	Fetcher.STARTED = "started";
	Fetcher.FINSIHED = "finished";
	Fetcher.PROGRESSING = "progressing";
	Fetcher.CANCELLED = "cancelled";
	Fetcher.ERROR = "error";
	Fetcher.IDLING = "idling";

	return Fetcher;

})));
