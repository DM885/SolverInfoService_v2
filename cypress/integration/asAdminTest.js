describe('SolverInfoService as Admin', () => {

  beforeEach(() => {
    cy.loginAsAdmin();
    cy.getAT();

    cy.getAll();
    cy.deleteAll();
  });
  
  it('should return empty list when getting solvers while no solvers were added.', () => {
    cy.request({
      method: 'GET',
      url: '/solvers',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + Cypress.env('token')
      },
    }).then(response => {
      expect(response.status).to.eq(200);
      expect(response.body.data.length).to.eq(0);
    });
  });

  it('should return list with created solver when getting solvers after solver was added.', () => {
    // First create a solver that we can later update.
    cy.request({
      method: 'POST',
      url: '/solvers',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + Cypress.env('token')
      },
      body: {
        name: 'foo',
        docker_image: 'bar'
      }
    }).then(() => {

      // Now test if the created solver is returned.
      cy.request({
        method: 'GET',
        url: '/solvers',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + Cypress.env('token')
        },
      }).then(response => {
        expect(response.status).to.eq(200);
        expect(response.body.data.length).to.eq(1);
        expect(response.body.data[0].name).to.eq('foo');
        expect(response.body.data[0].docker_image).to.eq('bar');
      });
    });
  });

  it('should be able to add a solver.', () => {
    cy.request({
      method: 'POST',
      url: '/solvers',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + Cypress.env('token')
      },
      body: {
        name: 'foo',
        docker_image: 'bar'
      }
    }).then(response => {
      expect(response.status).to.eq(200);
      expect(response.body.error).to.eq(false);
    });
  });

  it('should be able to update a solver.', () => {
    // First create a solver that we can later update.
    cy.request({
      method: 'POST',
      url: '/solvers',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + Cypress.env('token')
      },
      body: {
        name: 'foo',
        docker_image: 'bar'
      }
    }).then(() => {

      // Now get the created solver by listing all solvers.
      cy.request({
        method: 'GET',
        url: '/solvers',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + Cypress.env('token')
        },
      }).then(response => {
        response.body.data.forEach(solver => {

          // And now test if we can update the solver.
          cy.request({
            method: 'PUT',
            url: `/solvers/${solver.id}`,
            headers: {
              'Content-Type': 'application/json',
              'Authorization': 'Bearer ' + Cypress.env('token')
            },
            body: {
              name: 'newFoo',
              docker_image: 'newBar'
            }
          }).then(response => {
            // Check if the response of the PUT request is as expected.
            expect(response.status).to.eq(200);
            expect(response.body.error).to.eq(false);
          });
        });

        // Check if getting the solvers returns the updated solver.
        cy.request({
          method: 'GET',
          url: '/solvers',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + Cypress.env('token')
          },
        }).then(response => {
          expect(response.status).to.eq(200);
          expect(response.body.data.length).to.eq(1);
          expect(response.body.data[0].name).to.eq('newFoo');
          expect(response.body.data[0].docker_image).to.eq('newBar');
        });
      });
    });
  });

  it('should be able to delete a solver.', () => {
    // First create a solver that we can later delete.
    cy.request({
      method: 'POST',
      url: '/solvers',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + Cypress.env('token')
      },
      body: {
        name: 'foo',
        docker_image: 'bar'
      }
    }).then(() => {

      // Now get the created solver by listing all solvers.
      cy.request({
        method: 'GET',
        url: '/solvers',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + Cypress.env('token')
        },
      }).then(response => {
        response.body.data.forEach(solver => {

          // And now test if we can delete the solver.
          cy.request({
            method: 'DELETE',
            url: `/solvers/${solver.id}`,
            headers: {
              'Content-Type': 'application/json',
              'Authorization': 'Bearer ' + Cypress.env('token')
            }
          }).then(response => {
            // Check if the response of the DELETE request is as expected.
            expect(response.status).to.eq(200);
            expect(response.body.error).to.eq(false);
          });
        });

        // Check if getting the solvers no longer returns the deleted solver.
        cy.request({
          method: 'GET',
          url: '/solvers',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + Cypress.env('token')
          },
        }).then(response => {
          expect(response.status).to.eq(200);
          expect(response.body.data.length).to.eq(0);
        });
      });
    });
  });
});
