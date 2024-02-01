const sql = require("../db");
const helper = require("../utils/helper");
const queries = require("../utils/queries");

jest.mock("../db");

describe("Helper Functions", () => {
  describe("Helper Functions", () => {
    test("Should reduce the subtotals and return the sum", () => {
      const orderDetails = [
        { subtotal: 10 },
        { subtotal: 20 },
        { subtotal: 30 },
      ];
      const result = helper.reduceIndividualOrders(orderDetails);
      expect(result).toBe(60);
    })
    test('should build a correct bulk insert query', () => {
      const orderId = 123;
      const data = [
        { product_id: 1, quantity: 2, subtotal: 10 },
        { product_id: 2, quantity: 3, subtotal: 15 },
      ];
      const result = helper.buildBulkInsertQuery(orderId, data);
      // Expected query string
      const expectedQuery = `${queries.INSERT_ORDER_DETAILS_BULK} (?, ?, ?, ?), (?, ?, ?, ?)`;
      expect(result.query).toBe(expectedQuery);
      // Expected values
      const expectedValues = [123, 1, 2, 10, 123, 2, 3, 15];
      expect(result.values).toEqual(expectedValues);
    });
  });

});
