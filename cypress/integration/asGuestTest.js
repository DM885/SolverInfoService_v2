describe('SolverInfoService as Guest', () => {

  beforeEach(() => {
    // No user is created as we run the endpoints as non-authenticated guest.
  });

  it('should return 401 Unauthorized when listing the solvers.', () => {
    cy.request({
      method: 'GET',
      url: '/solvers',
      failOnStatusCode: false,
      headers: {
        'Content-Type': 'application/json'
      },
    }).then(response => {
      expect(response.status).to.eq(401);
    });
  });

  it('should return 401 Unauthorized when adding a solver.', () => {
    cy.request({
      method: 'POST',
      url: '/solvers',
      failOnStatusCode: false,
      headers: {
        'Content-Type': 'application/json'
      },
      body: {
        name: 'foo',
        docker_image: 'bar'
      }
    }).then(response => {
      expect(response.status).to.eq(401);
    });
  });

  it('should return 401 Unauthorized when updating a solver.', () => {
    cy.request({
      method: 'PUT',
      url: '/solvers/1',
      failOnStatusCode: false,
      headers: {
        'Content-Type': 'application/json'
      },
      body: {
        name: 'foo',
        docker_image: 'bar'
      }
    }).then(response => {
      expect(response.status).to.eq(401);
    });
  });

  it('should return 401 Unauthorized when deleting a solver.', () => {
    cy.request({
      method: 'DELETE',
      url: '/solvers/1',
      failOnStatusCode: false,
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(response => {
      expect(response.status).to.eq(401);
    });
  });
});
