describe('SolverInfoService as User', () => {

  before(() => {
    cy.loginAsUser();
    cy.getAT();
  });

  it('should be able to list the solvers.', () => {
    cy.request({
      method: 'GET',
      url: '/solvers',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + Cypress.env('token')
      },
    }).then(response => {
      expect(response.status).to.eq(200);
    });
  });

  it('should return 403 Forbidden when adding a solver.', () => {
    cy.request({
      method: 'POST',
      url: '/solvers',
      failOnStatusCode: false,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + Cypress.env('token')
      },
      body: {
        name: 'foo',
        docker_image: 'bar'
      }
    }).then(response => {
      expect(response.status).to.eq(403);
    });
  });

  it('should return 403 Forbidden when updating a solver.', () => {
    cy.request({
      method: 'PUT',
      url: '/solvers/1',
      failOnStatusCode: false,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + Cypress.env('token')
      },
      body: {
        name: 'foo',
        docker_image: 'bar'
      }
    }).then(response => {
      expect(response.status).to.eq(403);
    });
  });

  it('should return 403 Forbidden when deleting a solver.', () => {
    cy.request({
      method: 'DELETE',
      url: '/solvers/1',
      failOnStatusCode: false,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + Cypress.env('token')
      }
    }).then(response => {
      expect(response.status).to.eq(403);
    });
  });
});
