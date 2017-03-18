import * as test from "tape";
import * as sinon from "sinon";
import MockXMLHttpRequest from "../MockXMLHttpRequest";
import MockProgressEvent from "../polyfill/MockProgressEvent";
import { HTTP_METHOD_OUTDATED, HTTP_METHODS } from "../utils";

/* tslint:disable only-arrow-functions */

test("should throw if responseText is not \"\" or \"text\"", t => {
  const xhr = new MockXMLHttpRequest();
  t.throws(() => xhr.responseText);
  t.end();
});

test("should return \"\" if readyState < LOADING", t => {
  const xhr = new MockXMLHttpRequest();
  (xhr as any)._responseType = "text";
  (xhr as any).readyState = MockXMLHttpRequest.OPENED;
  t.equal(xhr.responseText, "");
  t.end();
});

test("should return responseText", t => {
  const xhr = new MockXMLHttpRequest();
  (xhr as any)._responseType = "text";
  (xhr as any)._responseText = "foo";
  (xhr as any).readyState = MockXMLHttpRequest.DONE;
  t.equal(xhr.responseText, "foo");
  t.end();
});

test("should throw on set if Request is done", t => {
  const xhr = new MockXMLHttpRequest();
  (xhr as any).readyState = MockXMLHttpRequest.LOADING;
  t.throws(() => xhr.responseType = "text");
  t.end();
});

test("should get/set responseType", t => {
  const xhr = new MockXMLHttpRequest();
  (xhr as any)._responseType = "text";
  (xhr as any).readyState = MockXMLHttpRequest.OPENED;
  xhr.responseType = "text";
  t.equal(xhr.responseType, "text");
  t.end();
});

test("should throw on set if not async", t => {
  const xhr = new MockXMLHttpRequest();
  xhr.async = false;
  t.throws(() => xhr.timeout = 20);
  t.end();
});

test("should get/set timeout", t => {
  const xhr = new MockXMLHttpRequest();
  xhr.timeout = 20;
  t.equal(xhr.timeout, 20);
  t.end();
});

test("should throw on set if request is already in progress", t => {
  const xhr = new MockXMLHttpRequest();
  (xhr as any).readyState = MockXMLHttpRequest.DONE;
  t.throws(() => xhr.withCredentials = false);

  (xhr as any).readyState = MockXMLHttpRequest.UNSENT;
  t.end();
});

test("should get/set withCredentials", t => {
  const xhr = new MockXMLHttpRequest();
  xhr.withCredentials = true;
  t.equal(xhr.withCredentials, true);
  t.end();
});

// test("should set a header", t => {
//   MockXMLHttpRequest.addHandler((req, res) => {
//     t.equal(req.header("content-type"), "application/json");
//     t.end();
//   });

//   const xhr = new MockXMLHttpRequest();
//   xhr.open("get", "/");
//   xhr.setRequestHeader("Content-Type", "application/json");
//   xhr.send();
// });

// test("should be OPENED", t => {
//   const xhr = new MockXMLHttpRequest();
//   xhr.open("get", "/");
//   t.equal(xhr.readyState, xhr.OPENED);
//   t.end();
// });

// test("should throw on outdated HTTP methods", t => {
//   const xhr = new MockXMLHttpRequest();
//   HTTP_METHOD_OUTDATED.forEach(method => {
//     t.throws(() => xhr.open(method, "/"));
//   });
//   t.end();
// });

// test("should throw on invalid HTTP methods", t => {
//   const xhr = new MockXMLHttpRequest();
//   ["foo", "BAZ"].forEach(method => {
//     t.throws(() => xhr.open(method, "/"));
//   });
//   t.end();
// });

// test("should have a request body", t => {
//   MockXMLHttpRequest.addHandler((req, res) => {
//     t.equal(req.body(), "Hello World!");
//     t.end();
//   });

//   const xhr = new MockXMLHttpRequest();
//   xhr.open("get", "/");
//   xhr.send("Hello World!");
// });

// test("should not have a request body", t => {
//   MockXMLHttpRequest.addHandler((req, res) => {
//     t.equal(req.body(), null);
//     t.end();
//   });

//   const xhr = new MockXMLHttpRequest();
//   xhr.open("get", "/");
//   xhr.send();
// });

// test("should time out after 100ms", t => {
//   MockXMLHttpRequest.addHandler((req, res) => res.timeout(true));

//   let start: any;
//   let end: any;
//   const xhr = new MockXMLHttpRequest();
//   xhr.timeout = 100;
//   xhr.open("get", "/");
//   xhr.ontimeout = () => {
//     end = Date.now();
//     t.true(end - start >= 100);
//     t.equal(xhr.readyState, 4);
//     t.end();
//   };
//   start = Date.now();
//   xhr.send();
// });

// test("should time out after 100ms even though the timeout is set to timeout after 10ms", t => {
//   MockXMLHttpRequest.addHandler((req, res) => {
//     return res.timeout(100);
//   });

//   const xhr = new MockXMLHttpRequest();
//   xhr.timeout = 10;
//   xhr.open("get", "/");

//   let start: any;
//   let end: any;
//   xhr.ontimeout = () => {
//     end = Date.now();
//     t.true(end - start >= 100);
//     t.equal(xhr.readyState, xhr.DONE);
//     t.end();
//   };
//   start = Date.now();
//   xhr.send();
// });

// test("should not time out after 100ms when the request has been aborted", t => {
//   let aborted = false;
//   let timedout = false;

//   MockXMLHttpRequest.addHandler((req, res) => res.timeout(10));

//   const xhr = new MockXMLHttpRequest();
//   xhr.open("get", "/");
//   xhr.ontimeout = () => timedout = true;
//   xhr.onabort = () => aborted = true;
//   xhr.send();
//   xhr.abort();

//   setTimeout(() => {
//     t.true(aborted);
//     t.true(!timedout);
//     t.end();
//   }, 10);
// });

// test("should have a response header", t => {
//   MockXMLHttpRequest.addHandler((req, res) => {
//     return res.header("Content-Type", "application/json");
//   });

//   const xhr = new MockXMLHttpRequest();
//   xhr.open("get", "/");
//   xhr.onload = () => {
//     t.equal(xhr.getResponseHeader("Content-Type"), "application/json");
//     t.end();
//   };
//   xhr.send();
// });

// test("should have a response header", t => {
//   MockXMLHttpRequest.addHandler((req, res) => {
//     return res
//       .header("Content-Type", "application/json")
//       .header("X-Powered-By", "SecretSauce");
//   });

//   const xhr = new MockXMLHttpRequest();
//   xhr.open("get", "/");
//   xhr.onload = () => {
//     t.equal(xhr.getAllResponseHeaders(), "content-type: application/json\r\nx-powered-by: SecretSauce\r\n");
//     t.end();
//   };
//   xhr.send();
// });

// test("should allow registering load event listener", t => {
//   MockXMLHttpRequest.addHandler((req, res) => res);

//   const xhr = new MockXMLHttpRequest();
//   xhr.addEventListener("load", function(event) {
//     t.equal(event.currentTarget, xhr);
//     t.equal(event.type, "load");
//     t.equal(this, xhr);
//     t.end();
//   });
//   xhr.open("get", "/");
//   xhr.send();
// });

// test("should allow registering abort event listener", t => {
//   MockXMLHttpRequest.addHandler((req, res) => res);

//   const xhr = new MockXMLHttpRequest();
//   xhr.addEventListener("abort", function(event) {
//     t.equal(event.currentTarget, xhr);
//     t.equal(this, xhr);
//     t.end();
//   });
//   xhr.open("get", "/");
//   xhr.send();
//   xhr.abort();
// });

// test("should allow registering progress event listener", t => {
//   MockXMLHttpRequest.addHandler((req, res) => {
//     req.progress(50, 100);
//     return res;
//   });

//   const xhr = new MockXMLHttpRequest();
//   xhr.addEventListener("progress", event => {
//     t.equal(event instanceof MockProgressEvent, true);
//     t.equal(event.type, "progress");
//     t.equal(event.lengthComputable, true);
//     t.equal(event.loaded, 50);
//     t.equal(event.total, 100);
//     t.end();
//   });
//   xhr.open("get", "/");
//   xhr.send();
// });

// test("should allow unregistering event listener", t => {
//   MockXMLHttpRequest.addHandler((req, res) => res);
//   const spy = sinon.spy();

//   const xhr = new MockXMLHttpRequest();

//   xhr.addEventListener("load", spy);
//   xhr.removeEventListener("load", spy);
//   xhr.open("get", "/");
//   xhr.send();

//   setTimeout(() => {
//     t.equal(spy.callCount, 0);
//     t.end();
//   }, 5);
// });
