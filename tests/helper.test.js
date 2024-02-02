const helper = require("../utils/helper");
const queries = require("../utils/queries");
const { subTotalArray, orderData} = require("../__mocks__/orderdata");

describe("Helper Functions", () => {
  describe("Order Helper Functions", () => {
    test("Should reduce the subtotals and return the sum", () => {
      const result = helper.reduceIndividualOrders(subTotalArray);
      expect(result).toBe(60);
    })
    test('Should build a correct bulk insert query', () => {
      const orderId = 123;
      const result = helper.buildBulkInsertQuery(orderId, orderData);
      // Expected query string
      const expectedQuery = `${queries.INSERT_ORDER_DETAILS_BULK} (?, ?, ?, ?), (?, ?, ?, ?)`;
      expect(result.query).toBe(expectedQuery);
      // Expected values
      const expectedValues = [123, 1, 2, 10, 123, 2, 3, 15];
      expect(result.values).toEqual(expectedValues);
    });
  });
});
