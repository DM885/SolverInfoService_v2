import {jest} from '@jest/globals';
import {addSolver, deleteSolver, listSolvers, updateSolver} from '../src/index.js';
import helpers from '../src/helpers.js';

const sessionId = 1;
const requestId = 1;

// Mock functions.
helpers.query = jest.fn();
const publishFn = jest.fn();

describe('A SolverInfoService', () => {

  beforeEach(async () => {
    helpers.query.mockClear();
    publishFn.mockClear();
  });

  it('should query the database when requesting the solvers.', async () => {
    // Call the listSolvers function.
    const msg = {sessionId: sessionId, requestId: requestId};
    await listSolvers(msg, publishFn);

    // Check that it queried the database.
    expect(helpers.query).toHaveBeenCalledTimes(1);
  });

  it('should publish the response when requesting the solvers.', async () => {
    // Mock the functions.
    const solvers = [{id: 1, name: 'foo', docker_image: 'bar'}];
    helpers.query.mockReturnValueOnce(solvers);

    // Call the listSolvers function.
    const msg = {sessionId: sessionId, requestId: requestId};
    await listSolvers(msg, publishFn);

    // Check that it queried the database.
    expect(publishFn).toHaveBeenCalledTimes(1);
    expect(publishFn).toHaveBeenCalledWith('list-solvers-response', {
      solvers: solvers,
    });
  });

  it('should query the database twice when adding a new solver and no deleted one existed before.', async () => {
    // Mock the functions.
    const solvers = [];
    helpers.query.mockReturnValueOnce(solvers);
    helpers.query.mockReturnValueOnce(true);

    // Call the addSolver function.
    const msg = {sessionId: sessionId, requestId: requestId, name: 'foo', docker_image: 'bar'};
    await addSolver(msg, publishFn);

    // Check that it queried the database.
    expect(helpers.query).toHaveBeenCalledTimes(2);
  });

  it('should query the database twice when adding a new solver and one deleted one existed before.', async () => {
    // Mock the functions.
    const solvers = [{id: 1, name: 'foo', docker_image: 'bar'}];
    helpers.query.mockReturnValueOnce(solvers);
    helpers.query.mockReturnValueOnce(true);

    // Call the addSolver function.
    const msg = {sessionId: sessionId, requestId: requestId, name: 'foo', docker_image: 'bar'};
    await addSolver(msg, publishFn);

    // Check that it queried the database.
    expect(helpers.query).toHaveBeenCalledTimes(2);
  });

  it('should publish the response when adding a solver and no deleted one existed before.', async () => {
    // Mock the functions.
    const solvers = [];
    helpers.query.mockReturnValueOnce(solvers);
    helpers.query.mockReturnValueOnce(true);

    // Call the addSolver function.
    const msg = {sessionId: sessionId, requestId: requestId, name: 'foo', docker_image: 'bar'};
    await addSolver(msg, publishFn);

    // Check that it queried the database.
    expect(publishFn).toHaveBeenCalledTimes(1);
    expect(publishFn).toHaveBeenCalledWith('add-solver-response', {
      error: false,
    });
  });

  it('should publish the response when adding a solver and a deleted one existed before.', async () => {
    // Mock the functions.
    const solvers = [{id: 1, name: 'foo', docker_image: 'bar'}];
    helpers.query.mockReturnValueOnce(solvers);
    helpers.query.mockReturnValueOnce(true);

    // Call the addSolver function.
    const msg = {sessionId: sessionId, requestId: requestId, name: 'foo', docker_image: 'bar'};
    await addSolver(msg, publishFn);

    // Check that it queried the database.
    expect(publishFn).toHaveBeenCalledTimes(1);
    expect(publishFn).toHaveBeenCalledWith('add-solver-response', {
      error: false
    });
  });

  it('should query the database when deleting a solver.', async () => {
    // Call the deleteSolver function.
    const msg = {sessionId: sessionId, requestId: requestId, solverId: 1};
    await deleteSolver(msg, publishFn);

    // Check that it queried the database.
    expect(helpers.query).toHaveBeenCalledTimes(1);
  });

  it('should publish the response when deleting a solver.', async () => {
    // Mock the functions.
    helpers.query.mockReturnValueOnce(true);

    // Call the deleteSolver function.
    const msg = {sessionId: sessionId, requestId: requestId, solverId: 1};
    await deleteSolver(msg, publishFn);

    // Check that it queried the database.
    expect(publishFn).toHaveBeenCalledTimes(1);
    expect(publishFn).toHaveBeenCalledWith('delete-solver-response', {
      error: false
    });
  });

  it('should query the database when updating a solver.', async () => {
    // Call the updateSolver function.
    const msg = {sessionId: sessionId, requestId: requestId, solverId: 1, name: 'foo', docker_image: 'bar'};
    await updateSolver(msg, publishFn);

    // Check that it queried the database.
    expect(helpers.query).toHaveBeenCalledTimes(1);
  });

  it('should publish the response when updating a solver.', async () => {
    // Mock the functions.
    helpers.query.mockReturnValueOnce(true);

    // Call the updateSolver function.
    const msg = {sessionId: sessionId, requestId: requestId, solverId: 1, name: 'foo', docker_image: 'bar'};
    await updateSolver(msg, publishFn);

    // Check that it queried the database.
    expect(publishFn).toHaveBeenCalledTimes(1);
    expect(publishFn).toHaveBeenCalledWith('update-solver-response', {
      error: false
    });
  });

});
