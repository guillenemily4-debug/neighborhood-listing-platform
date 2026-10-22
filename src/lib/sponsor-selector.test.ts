
import test from "node:test";
import assert from "node:assert/strict";

import {
  selectSponsor,
  type SponsorCandidate,
  type SponsorContext,
} from "./sponsor-selector";

const context: SponsorContext = {
  propertyId: "property-1",
  zipCode: "90001",
  nearbyZipCodes: ["90002", "90003"],
  placement: "property-sidebar",
  today: "2026-10-22",
};

const sponsor: SponsorCandidate = {
  id: "sponsor-1",
  isApproved: true,
  isActive: true,
  placement: "property-sidebar",
  startDate: "2026-10-01",
  endDate: "2026-10-31",
  targetZipCodes: ["90001"],
  priority: 1,
};

test("Exact ZIP match", () => {
  const result = selectSponsor(context, [sponsor]);
  assert.equal(result?.id, "sponsor-1");
});

test("Nearby ZIP match", () => {
  const nearby = {
    ...sponsor,
    targetZipCodes: ["90002"],
  };

  const result = selectSponsor(context, [nearby]);
  assert.equal(result?.id, "sponsor-1");
});

test("Inactive sponsor is rejected", () => {
  const inactive = {
    ...sponsor,
    isActive: false,
  };

  assert.equal(selectSponsor(context, [inactive]), null);
});

test("Expired campaign is rejected", () => {
  const expired = {
    ...sponsor,
    endDate: "2026-10-21",
  };

  assert.equal(selectSponsor(context, [expired]), null);
});

test("Tie produces a deterministic result", () => {
  const second = {
    ...sponsor,
    id: "sponsor-2",
  };

  const firstResult = selectSponsor(context, [
    sponsor,
    second,
  ]);

  const secondResult = selectSponsor(context, [
    second,
    sponsor,
  ]);

  assert.equal(firstResult?.id, secondResult?.id);
});

test("No matching ZIP returns fallback", () => {
  const differentZip = {
    ...sponsor,
    targetZipCodes: ["10001"],
  };

  assert.equal(
    selectSponsor(context, [differentZip]),
    null
  );
});

test("Unapproved sponsor is rejected", () => {
  const unapproved = {
    ...sponsor,
    isApproved: false,
  };

  assert.equal(selectSponsor(context, [unapproved]), null);
});

test("Wrong placement is rejected", () => {
  const wrongPlacement = {
    ...sponsor,
    placement: "homepage-banner",
  };

  assert.equal(selectSponsor(context, [wrongPlacement]), null);
});

test("Campaign end date is inclusive", () => {
  const endingToday = {
    ...sponsor,
    endDate: "2026-10-22",
  };

  assert.equal(
    selectSponsor(context, [endingToday])?.id,
    "sponsor-1"
  );
});
test("Empty sponsor list returns null", () => {
  assert.equal(selectSponsor(context, []), null);
});

test("Future campaign is rejected", () => {
  const future = {
    ...sponsor,
    startDate: "2026-11-01",
  };

  assert.equal(selectSponsor(context, [future]), null);
});

test("Campaign start date is inclusive", () => {
  const startingToday = {
    ...sponsor,
    startDate: context.today,
  };

  assert.equal(
    selectSponsor(context, [startingToday])?.id,
    sponsor.id
  );
});

test("Higher priority sponsor wins", () => {
  const higherPriority = {
    ...sponsor,
    id: "sponsor-high",
    priority: 20,
  };

  const result = selectSponsor(context, [
    sponsor,
    higherPriority,
  ]);

  assert.equal(result?.id, "sponsor-high");
});

test("Exact ZIP wins when priority is tied", () => {
  const nearby = {
    ...sponsor,
    id: "sponsor-nearby",
    targetZipCodes: ["90002"],
  };

  const result = selectSponsor(context, [
    nearby,
    sponsor,
  ]);

  assert.equal(result?.id, sponsor.id);
});

test("Invalid property ZIP returns null", () => {
  const invalidContext = {
    ...context,
    zipCode: "invalid",
  };

  assert.equal(
    selectSponsor(invalidContext, [sponsor]),
    null
  );
});

test("Three properties produce predictable outcomes", () => {
  const coffeeShop = {
    ...sponsor,
    id: "coffee-shop",
    targetZipCodes: ["90001"],
    priority: 10,
  };

  const bakery = {
    ...sponsor,
    id: "local-bakery",
    targetZipCodes: ["90002"],
    priority: 10,
  };

  const candidates = [coffeeShop, bakery];

  const property1 = {
    ...context,
    propertyId: "property-1",
    zipCode: "90001",
    nearbyZipCodes: [],
  };

  const property2 = {
    ...context,
    propertyId: "property-2",
    zipCode: "90002",
    nearbyZipCodes: [],
  };

  const property3 = {
    ...context,
    propertyId: "property-3",
    zipCode: "90099",
    nearbyZipCodes: [],
  };

  assert.equal(
    selectSponsor(property1, candidates)?.id,
    "coffee-shop"
  );

  assert.equal(
    selectSponsor(property2, candidates)?.id,
    "local-bakery"
  );

  assert.equal(
    selectSponsor(property3, candidates),
    null
  );
});

test("Leading zero ZIP code matches correctly", () => {
  const leadingZeroSponsor = {
    ...sponsor,
    id: "leading-zero",
    targetZipCodes: ["01234"],
  };

  const leadingZeroContext = {
    ...context,
    zipCode: "01234",
    nearbyZipCodes: [],
  };

  assert.equal(
    selectSponsor(
      leadingZeroContext,
      [leadingZeroSponsor]
    )?.id,
    "leading-zero"
  );
});

test("Higher-priority inactive sponsor is rejected", () => {
  const inactiveHighPriority = {
    ...sponsor,
    id: "inactive-high",
    priority: 100,
    isActive: false,
  };

  const activeLowPriority = {
    ...sponsor,
    id: "active-low",
    priority: 1,
  };

  assert.equal(
    selectSponsor(context, [
      inactiveHighPriority,
      activeLowPriority,
    ])?.id,
    "active-low"
  );
});

test("Multi-ZIP sponsors receive no extra weight", () => {
  const multiZip = {
    ...sponsor,
    id: "multi-zip",
    targetZipCodes: ["90001", "90002"],
  };

  const singleZip = {
    ...sponsor,
    id: "single-zip",
    targetZipCodes: ["90001"],
  };

  const first = selectSponsor(context, [
    multiZip,
    singleZip,
  ]);

  const second = selectSponsor(context, [
    singleZip,
    multiZip,
  ]);

  assert.ok(
    first?.id === "multi-zip" ||
    first?.id === "single-zip"
  );

  assert.equal(first?.id, second?.id);
});
