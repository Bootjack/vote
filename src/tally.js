import path from 'path';
import sqlite3 from 'sqlite3';
const sqlite3Client = sqlite3.verbose();
//var db = new sqlite3.Database(':memory:');

const dbPath = path.resolve(__dirname, '../data/elections');
const db = new sqlite3Client.Database(dbPath);

function aggregateVoters(rows) {
  return rows.reduce((acc, {voter_id, ...row}) => ({...acc, [voter_id]: (acc[voter_id] && acc[voter_id].rank < row.rank) ? acc[voter_id] : row}), {});
}

function countVotes(votes) {
  return Object.values(votes).reduce((acc, {option_id}) => ({...acc, [option_id]: (acc[option_id] || 0) + 1}), {});
}

function testWinner(results) {
  const options = Object.keys(results);
  const plurality = options.reduce((hi, opt) => results[opt] < results[hi] ? hi : opt, null);
  const sum = options.reduce((total, opt) => total + results[opt], 0);
  console.log('plurality', plurality, 'with', results[plurality], '/', sum);
  return results[plurality] > sum / 2 && plurality;
}

function filterLoser(results, rows) {
  const options = Object.keys(results);
  const losers = options.reduce((acc, opt) => {
    const lowest = results[acc[0]] || Infinity;
    if (results[opt] < lowest) return [opt];
    if (results[opt] === lowest) return acc.concat(opt);
    return acc;
  }, []);
  console.log('losers', losers);
  let loser;
  if (losers.length > 1) {
    const sums = losers.reduce((acc, opt) => {
      acc[opt] = rows.filter(row => row.option_id == opt).reduce((total, row) => total + row.rank, 0);
      return acc;
    }, {});
    console.log('loser sums', sums);
    loser = Object.keys(sums).reduce((worst, opt) => sums[opt] > sums[worst] ? opt : worst);
  } else {
    loser = losers[0];
  }
  console.log('loser', loser);
  return rows.filter(row => row.option_id != loser);
}

function runOff(rows) {
  console.log('--- new runoff round ---')
  const votes = aggregateVoters(rows);
  console.log('votes', votes);
  const results = countVotes(votes);
  console.log('results', results);
  const winner = testWinner(results);
  console.log('winner', winner);
  const next = filterLoser(results, rows);
  console.log('next', next.length);
  return winner ? winner : next.length > 1 ? runOff(next) : null;
}

export function results(election_id, done) {
  const electId = parseInt(election_id, 10);
  const query = `SELECT voter_id, option_id, rank, voters.enabled FROM votes LEFT JOIN voters ON voter_id = voters.id WHERE voters.enabled = 1 AND election_id = ${electId}`;
  db.all(query, function(err, rows) {
    const winner = runOff(rows);
    db.get(`SELECT * FROM options WHERE id = ${winner}`, (err, result) => {
      done(result);
    });
  });
}

export function popularity(election_id, done) {
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

results(1, function(output){
  console.log(output);
});
