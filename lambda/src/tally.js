export function aggregateVoters(rows) {
  return rows.reduce((acc, {voter_id, ...row}) => ({...acc, [voter_id]: (acc[voter_id] && acc[voter_id].rank < row.rank) ? acc[voter_id] : row}), {});
}

export function countVotes(votes) {
  return Object.values(votes).reduce((acc, {option_id}) => ({...acc, [option_id]: (acc[option_id] || 0) + 1}), {});
}

export function filterLoser(loser, rows) {
  return rows.filter(row => row.option_id != loser);
}

export function findLoser(results, rows) {
  const options = Object.keys(results);
  const losers = options.reduce((acc, opt) => {
    const lowest = results[acc[0]] || Infinity;
    if (results[opt] < lowest) return [opt];
    if (results[opt] === lowest) return acc.concat(opt);
    return acc;
  }, []);
  let loser;
  if (losers.length > 1) {
    const sums = losers.reduce((acc, opt) => {
      acc[opt] = rows.filter(row => row.option_id == opt).reduce((total, row) => total + row.rank, 0);
      return acc;
    }, {});
    return loser = Object.keys(sums).reduce((worst, opt) => sums[opt] > sums[worst] ? opt : worst);
  }
  return loser = losers[0];
}

export function testWinner(results) {
  const options = Object.keys(results);
  const plurality = options.reduce((hi, opt) => results[opt] < results[hi] ? hi : opt, null);
  const sum = options.reduce((total, opt) => total + results[opt], 0);
  return results[plurality] > sum / 2 && plurality;
}
