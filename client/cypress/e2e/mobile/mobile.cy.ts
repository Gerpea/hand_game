describe("Mobile", () => {
  it("Should redirect mobile agents to mobile page", () => {
    cy.visit("/");
    cy.location("pathname").should("eq", "/mobile");
  });
});
