import {
  aggregateVoters,
  countVotes,
  filterLoser,
  findLoser,
  testWinner
} from './src/tally.js';

function runOff(rows, output = '', count = 1) {
  const options = rows.reduce((acc, row) => ({...acc, [row.option_id]: row.name}), {});
  const votes = aggregateVoters(rows);
  const results = countVotes(votes);
  const winner = testWinner(results);
  const loser = findLoser(results, rows);
  const next = filterLoser(loser, rows);
  output += `--- Round ${count} ---\n\n`;
  output += `Votes\n${Object.keys(votes).map(id => `${votes[id].voter}: ${votes[id].name} (${votes[id].rank})`).join('\n')}\n\n`;
  output += `Results\n${Object.keys(results).map(id => `${options[id]}: ${results[id]}`).join('\n')}\n\n`;
  if (winner) {
    output += `Winner: ${options[winner]}\n`;
  } else {
    output += `Loser: ${options[loser]}\n`
  }
  output += '\n';

  return winner ? output : next.length > 1 ? runOff(next, output, ++count) : null;
}

export function results (election_id, done) {
  const electId = parseInt(election_id, 10);
  const query = `SELECT voter_id, option_id, rank, voters.name AS voter, options.name, voters.enabled FROM votes LEFT JOIN voters ON voter_id = voters.id LEFT JOIN options ON option_id = options.id WHERE voters.enabled = 1 AND election_id = ${electId}`;
  db.all(query, function(err, rows) {
    done(runOff(rows));
  });
}

export function popularity (election_id, done) {
  const electId = parseInt(election_id, 10);
  const query = `SELECT options.name, sum(rank) as golf_score, voters.enabled FROM votes LEFT JOIN options ON votes.option_id = options.id LEFT JOIN voters ON voter_id = voters.id WHERE voters.enabled = 1 AND election_id = ${electId} GROUP BY option_id ORDER BY golf_score`;
  db.all(query, function(err, rows) {
    if (err) {
      done(err);
    }
    const result = rows.reduce((acc, row) => ({...acc, [row.name]: row.golf_score}), {});
    done(result);
  });
}

export function api(event, context, callback) {
  callback(null, JSON.stringify(event, null, 2));
}

