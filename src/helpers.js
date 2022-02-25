import rapid from '@ovcina/rapidriver';
import jwt from 'jsonwebtoken';
import mysql from 'mysql';


const SECRET = process.env.SECRET ?? `3(?<,t2mZxj$5JT47naQFTXwqNWP#W>'*Kr!X!(_M3N.u8v}%N/JYGHC.Zwq.!v-`;  // JWT secret
const rabbitUser = process.env.rabbitUser ?? 'guest';
const rabbitPass = process.env.rabbitPass ?? 'guest';
const host = 'amqp://' + rabbitUser + ':' + rabbitPass + '@' + (process.env.rabbitHost ?? `localhost`);  // RabbitMQ url

/**
 * Automatically adds logging, request and sessionIDs to rabbit responses.
 * @param host a string representing the host to start a subscription with
 * @param subscribers a list of subscribers
 */
function subscriber(host, subscribers) {
  rapid.subscribe(host, subscribers.map(subscriber => ({
    river: subscriber.river,
    event: subscriber.event,
    work: (msg, publish) => {
      const wrappedPublish = (event, data) => {
        let logPath = msg.logPath ?? [];
        logPath.push({
          river: subscriber.river,
          event: subscriber.event
        });

        publish(event, {
          ...data,
          sessionId: msg.sessionId,
          requestId: msg.requestId,
          logPath
        });
      };
      subscriber.work(msg, wrappedPublish);
    },
  })));
}

/**
 * Returns the token payload if its valid, otherwise it returns false.
 * @param token a string holding the token
 * @returns Promise<false|TokenData>
 */
function getTokenData(token) {
  return new Promise(resolve => jwt.verify(token, SECRET, (err, data) => resolve(err ? false : data)));
}

let connection;
if (process.env.mysqlDb) {
  connection = mysql.createConnection({
    host: process.env.mysqlHost ?? 'localhost',
    user: process.env.mysqlUser ?? 'root',
    password: process.env.mysqlPass ?? '',
    database: process.env.mysqlDb ?? 'db',
  });
  connection.connect();

  // Create solvers table if not exists.
  const res = await query('CREATE TABLE IF NOT EXISTS `solvers` (`id` int(11) unsigned NOT NULL AUTO_INCREMENT, `name` varchar(255) NOT NULL, `docker_image` varchar(255) NOT NULL, `deleted` boolean NOT NULL DEFAULT 0, KEY `Index 1` (`id`)) ENGINE=InnoDB DEFAULT CHARSET=latin1;');
  
  if(!res) process.exit(1)
}

/**
 * Runs a SQL query on the DB.
 * @param stmt a string representing the SQL query
 * @param WHERE a list of strings containing the parameters for the WHERE part
 * @returns Promise<results[]|false>
 */
function query(stmt, WHERE = []) {
  return new Promise(r => connection.query(stmt, WHERE, (err, results) => r(err ? false : results)));
}

export default {
  host,
  subscriber,
  getTokenData,
  query
};
