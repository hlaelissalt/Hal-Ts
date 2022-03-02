import assert from "assert";
import mocha from "mocha";
import { getHalObjectResponse } from "../src";
import {
  basicObject,
  complexObject,
} from "./fixtures/hal.response.object.fixture";

mocha.describe("Test Hal Object Response", () => {
  mocha.it("Should create response for basic object", (done) => {
    const response = getHalObjectResponse(basicObject);

    assert.strictEqual(
      response._links.self.href,
      `${basicObject.url}/${basicObject.data.identifier}`
    );

    assert.strictEqual(response._embeded, basicObject.data._embeded);

    assert.strictEqual(response.identifier, basicObject.data.identifier);

    done();
  });

  mocha.it("Should create response for complex object", (done) => {
    const response = getHalObjectResponse(complexObject);

    assert.strictEqual(
      response._links.self.href,
      `${complexObject.url}/${complexObject.data.identifier}`
    );

    assert.strictEqual(
      response._embeded?._links.self.href,
      `${complexObject.data._embeded?.url}/${complexObject.data._embeded?.identifier}`
    );

    done();
  });
});