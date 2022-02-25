import helpers from './helpers.js';

export async function listSolvers(msg, publish) {
  const solvers = await helpers.query('SELECT * FROM `solvers` WHERE `deleted` = ?;', [false]);

  publish('list-solvers-response', {
    solvers: solvers
  });
}

export async function addSolver(msg, publish) {
  const solvers = await helpers.query('SELECT `id` FROM `solvers` WHERE `name` = ? AND `docker_image` = ? AND `deleted` = ?;', [
    msg.name,
    msg.docker_image,
    true
  ]);

  if (solvers && solvers.length > 0) {
    // There already exists such a solver which was deleted before. Revive this one.
    const stmt = await helpers.query('UPDATE `solvers` SET `deleted` = 0 WHERE `id` = ?', [
      solvers[0].id
    ]);

    publish('add-solver-response', {
      error: !stmt
    });
  } else {
    // We cannot reuse a previously disabled solver, so create a new one.
    const stmt = await helpers.query('INSERT INTO `solvers` (`name`, `docker_image`, `deleted`) VALUES (?, ?, ?)', [
      msg.name,
      msg.docker_image,
      false
    ]);

    publish('add-solver-response', {
      error: !stmt
    });
  }
}

export async function deleteSolver(msg, publish) {
  const stmt = await helpers.query('UPDATE `solvers` SET `deleted` = 1 WHERE `id` = ?', [
    msg.solverId
  ]);

  publish('delete-solver-response', {
    error: !stmt
  });
}

export async function updateSolver(msg, publish) {
  const stmt = await helpers.query('UPDATE `solvers` SET `name` = ?, `docker_image` = ?  WHERE `id` = ?', [
    msg.name,
    msg.docker_image,
    msg.solverId
  ]);

  publish('update-solver-response', {
    error: !stmt
  });
}

if (process.env.RAPID) {
  helpers.subscriber(helpers.host, [
    {river: 'solver-info', event: 'list-solvers', work: listSolvers},
    {river: 'solver-info', event: 'add-solver', work: addSolver},
    {river: 'solver-info', event: 'delete-solver', work: deleteSolver},
    {river: 'solver-info', event: 'update-solver', work: updateSolver}
  ]);
}
