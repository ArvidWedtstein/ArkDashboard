import { mockRedwoodDirective, getDirectiveName } from "@redwoodjs/testing/api";

import hasPermission from "./hasPermission";

describe("hasPermission directive", () => {
  it("declares the directive sdl as schema, with the correct name", () => {
    expect(hasPermission.schema).toBeTruthy();
    expect(getDirectiveName(hasPermission.schema)).toBe("hasPermission");
  });

  it("has a hasPermission throws an error if validation does not pass", () => {
    const mockExecution = mockRedwoodDirective(hasPermission, {});

    // expect(mockExecution).toThrowError(
    //   'Implementation missing for hasPermission'
    // )
  });
});
